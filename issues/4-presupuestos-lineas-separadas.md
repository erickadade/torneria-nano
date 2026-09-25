# 4 - Presupuestos con líneas separadas (repuesto/servicio)

## Problema

La vista de Presupuestos (`src/views/Presupuestos.jsx`) es hoy un placeholder sin funcionalidad. No existe forma de armar un presupuesto combinando repuestos (buscados en stock) y servicios (del catálogo o cargados libres), que es el corazón del uso diario del sistema — sin esto, Clientes (#1), Servicios (#2) y Stock (#3) quedan sin el flujo que los conecta.

## Objetivo

Que Vale pueda armar un presupuesto para un cliente, agregando líneas separadas de repuestos y servicios, con numeración y fecha automáticas, cálculo de subtotal y total, y un estado que avance de borrador a aprobado a facturado.

## Fuera de alcance

- **IVA**: `REQUIREMENTS.md` marca el cálculo de IVA como "pendiente de definición fiscal" (depende de si Vale termina siendo monotributista o responsable inscripto). Este issue **no calcula ni desglosa IVA** — el presupuesto muestra subtotal y total, y son iguales (`total = subtotal`). El campo `iva` del modelo se guarda en `0` como placeholder hasta que se defina la condición fiscal en un issue aparte.
- Descuento automático de stock al aprobar/facturar un presupuesto (funcionalidad 6, P1, issue aparte).
- Registro de facturas y cobros (funcionalidad 5, issue aparte) — este issue solo cubre hasta el estado `facturado` como etiqueta, no la emisión ni el registro de cobro real.
- Emisión electrónica ante ARCA (fase futura, bloqueada).
- Impresión o exportación del presupuesto a PDF (no pedido todavía).
- Edición de un presupuesto ya en estado `facturado` (una vez facturado, se considera cerrado — no se contempla reabrirlo en este issue).

## Requisitos

### P0 (bloqueante)

- Colección `presupuestos` en Firestore con la forma definida en `REQUIREMENTS.md`:
  ```
  presupuesto: {
    id, numero, fechaEmision, validoHasta,
    clienteId, trabajoEquipo,
    lineas: [
      { tipo: "repuesto", productoId, cantidad, precioUnitario },
      { tipo: "servicio", servicioId (opcional si es libre), descripcion, precio }
    ],
    subtotal, iva, total,
    estado: "borrador" | "aprobado" | "facturado"
  }
  ```
  `iva` se guarda siempre en `0` por ahora (ver "Fuera de alcance"); `total` es igual a `subtotal`.
- `numero` es un **correlativo autogenerado** (mismo patrón que `codigo` en `servicios`, issue #2): contador en Firestore (`contadores/presupuestos`) incrementado con `runTransaction` en cada alta. No editable.
- `fechaEmision` se asigna automáticamente a la fecha de creación (no editable). `validoHasta` es un campo de fecha que carga Vale manualmente.
- Listado de presupuestos en `Presupuestos.jsx`: tabla (patrón `table-scroll` / `table`) con número, cliente, fecha de emisión, total y estado. Click en una fila (o botón "Ver/Editar") abre el detalle.
- Formulario de alta/edición de presupuesto (modal, reutilizando `Modal` de `src/components/Modal.jsx`):
  - Selector de cliente (de la colección `clientes`, issue #1) — obligatorio.
  - Campo "Trabajo/equipo" (texto libre, ej. "Tractor Pauny doble tracción") — opcional.
  - Campo "Válido hasta" (fecha) — obligatorio.
  - Bloque de líneas, con dos formas de agregar:
    - **Línea de repuesto**: buscador/selector de producto (de la colección `productos`, issue #3), cantidad (numérica > 0) y precio unitario. El precio unitario se autocompleta con el precio final del producto al seleccionarlo, pero queda editable.
    - **Línea de servicio**: selector de servicio del catálogo (colección `servicios`, issue #2) que autocompleta descripción y precio, **o** carga libre (descripción + precio manual, sin `servicioId`).
  - Poder agregar y quitar líneas de ambos tipos, mezcladas, en cualquier orden.
  - Cálculo en vivo de subtotal (suma de `cantidad * precioUnitario` para repuestos + `precio` para servicios) mientras se arma el presupuesto.
- Guardar el presupuesto en estado `borrador` al crearlo. Permitir cambiar el estado (`borrador` → `aprobado` → `facturado`) desde el listado o el detalle, con un control simple (select o botones), sin lógica adicional de negocio todavía (eso llega con los issues #5 y #6).
- Eliminación de presupuesto con confirmación (`window.confirm`, mismo patrón que los issues anteriores) — solo permitida en estado `borrador` (no se puede borrar un presupuesto ya aprobado o facturado).
- Vista protegida por `ProtectedRoute` (ya aplica a nivel de ruta en `App.jsx`, verificar que no se rompe).
- Usar los tokens de `src/styles/tokens.css` y reutilizar las clases de `src/styles/components.css` (`.table`, `.table-scroll`, `.btn`, `.form`, `.search-input`, `.view__header`, etc.) — nada de hex codes hardcodeados ni CSS duplicado.
- Formatear montos en pesos (es-AR), igual que en Servicios y Stock.

### P1 (deseable)

- Buscador/filtro por número o cliente en el listado de presupuestos.
- Indicador visual de presupuestos vencidos (`validoHasta` en el pasado y estado todavía `borrador` o `aprobado`).

## Criterios de aceptación

- [ ] Se puede crear un presupuesto para un cliente existente, con al menos una línea de repuesto y una de servicio, y el subtotal/total se calculan correctamente.
- [ ] Cada presupuesto nuevo recibe un número correlativo que no se repite, incluso creando varios seguidos.
- [ ] La fecha de emisión se asigna automáticamente y no es editable.
- [ ] Se puede agregar una línea de servicio tomándolo del catálogo (autocompleta descripción/precio) y también cargarla libre (sin `servicioId`).
- [ ] Se puede agregar una línea de repuesto buscando un producto existente, y el precio unitario se autocompleta pero se puede editar.
- [ ] Se pueden quitar líneas ya agregadas antes de guardar.
- [ ] El presupuesto se crea en estado `borrador` y se puede cambiar a `aprobado` y luego a `facturado`.
- [ ] No se puede eliminar un presupuesto que no esté en estado `borrador`.
- [ ] El listado se actualiza en tiempo real (o al menos al recargar) reflejando altas, cambios de estado y bajas.
- [ ] Los montos se muestran formateados en pesos (es-AR), y `total` coincide con `subtotal` (sin IVA todavía).
- [ ] La vista respeta los estilos de `tokens.css` y reutiliza las clases de `components.css`.
- [ ] Si se intenta acceder a `/presupuestos` sin estar logueada, redirige a Login (comportamiento ya cubierto por `ProtectedRoute`, solo verificar que sigue funcionando).

## Notas para la IA

- Archivo principal a tocar: `src/views/Presupuestos.jsx`. Seguir la misma estructura general que `Clientes.jsx`, `Servicios.jsx` y `Stock.jsx` (issues #1, #2 y #3, ya implementados): `onSnapshot` para el listado en tiempo real, modal de alta/edición con `useState` de formulario, validación antes de guardar, `deleteDoc` con confirmación.
- Para el correlativo de `numero`, replicar el patrón exacto usado para `codigo` en `src/views/Servicios.jsx` (contador con `runTransaction`), pero contra el documento `contadores/presupuestos`.
- Para el selector de producto en las líneas de repuesto, reutilizar la lógica de cálculo de precio final de `src/views/Stock.jsx` (costo mínimo entre proveedores × recargo) al autocompletar el precio unitario sugerido.
- Este formulario es más complejo que los anteriores (selector de cliente + líneas dinámicas de dos tipos): está bien que el estado del formulario y el array de líneas vivan en `Presupuestos.jsx` sin necesidad de componentes nuevos, salvo que la complejidad del JSX lo justifique — en ese caso, extraer un componente `LineaItem` a `src/components/` es razonable (ya previsto en la estructura de `CLAUDE.md`).
- No implementar ninguna lógica de IVA todavía (ver "Fuera de alcance") — el campo existe en el modelo pero se persiste en `0`.
- No descontar stock al cambiar el estado a `aprobado` o `facturado` — eso es la funcionalidad 6 (P1), un issue aparte.
- No crear Cloud Functions ni agregar dependencias de Afip SDK/Claude API.
- Sin TypeScript — todo en JavaScript plano, igual que el resto del proyecto.
- Este issue depende funcionalmente de los issues #1 (Clientes), #2 (Servicios) y #3 (Stock), todos ya implementados — no hay trabajo pendiente de esos issues que bloquee este.
