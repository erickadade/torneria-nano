# 2 - Catálogo de Servicios frecuentes

## Problema

La vista de Servicios (`src/views/Servicios.jsx`) es hoy un placeholder sin funcionalidad. No existe forma de cargar, ver, editar ni eliminar los servicios que ofrece la tornería (torneado, reparaciones, asesoramiento técnico, etc.), y sin esto no se puede avanzar con Presupuestos (funcionalidad 4), que necesita seleccionar servicios del catálogo al armar líneas tipo "servicio".

## Objetivo

Que Vale pueda dar de alta, listar, editar y eliminar servicios frecuentes desde la vista de Servicios, como catálogo independiente del de productos, para poder seleccionarlos rápido al armar un presupuesto.

## Fuera de alcance

- Cualquier lógica de stock o descuento de inventario — los servicios **no afectan stock** (a diferencia de los productos), por eso viven en una colección separada.
- Selección de servicios dentro del formulario de Presupuestos (issue #4, aparte) — este issue solo cubre el ABM del catálogo en sí.
- Tiempo estimado, kits o sub-ítems de un servicio (posible evolución futura, no pedida todavía).

## Requisitos

### P0 (bloqueante)

- Colección `servicios` en Firestore con la forma definida en `REQUIREMENTS.md`:
  ```
  servicio: { id, codigo (correlativo autogenerado), descripcion, precio, categoria (opcional) }
  ```
- `codigo` es un **correlativo autogenerado por el sistema** al crear el servicio (no lo escribe Vale, no es editable). Sirve para referenciar el servicio en presupuestos y facturas — no está pensado para escaneo de código de barras (eso es exclusivo de productos, ver issue #3).
  - Implementar el correlativo llevando un contador en Firestore (ej. documento `contadores/servicios` con un campo `ultimoNumero`, incrementado con `runTransaction` en cada alta) para evitar duplicados si se crean servicios simultáneamente.
  - Mostrar el código en el listado con formato simple y legible (ej. `S-001`, `S-002`).
- Listado de servicios en `Servicios.jsx`: tabla con código, descripción, categoría (si tiene) y precio, usando el mismo patrón de tabla con scroll horizontal propio (`table-scroll` / `table`) que ya se usa en `Clientes.jsx`.
- Formulario de alta de servicio (modal, reutilizando el componente `Modal` de `src/components/Modal.jsx`) con: descripción (obligatoria), precio (obligatorio, numérico positivo), categoría (opcional, texto libre). El código no se pide en el formulario, se asigna solo al guardar.
- Edición de servicio existente (descripción, precio, categoría — el código no se edita una vez asignado).
- Eliminación de servicio con confirmación (`window.confirm`, mismo patrón que `Clientes.jsx`).
- Vista protegida por `ProtectedRoute` (ya aplica a nivel de ruta en `App.jsx`, verificar que no se rompe).
- Usar los tokens de `src/styles/tokens.css` para colores, tipografía y espaciado — nada de hex codes hardcodeados. Reutilizar las clases ya creadas en `src/styles/components.css` (`.table`, `.table-scroll`, `.btn`, `.form`, `.search-input`, etc.) en vez de duplicar estilos.
- Formatear el precio en el listado con separador de miles `.` y decimal `,` (es-AR): `$ 145.300,00`.

### P1 (deseable)

- Buscador/filtro por descripción o categoría en el listado.
- Agrupar visualmente el listado por categoría cuando el servicio la tiene cargada.

## Criterios de aceptación

- [ ] Se puede crear un servicio con descripción y precio (sin categoría) y aparece en el listado con un código autogenerado.
- [ ] Se puede crear un servicio con categoría y se muestra correctamente en la tabla.
- [ ] Los códigos autogenerados son correlativos y no se repiten, incluso creando varios servicios seguidos.
- [ ] Si falta la descripción o el precio no es un número positivo, el formulario no permite guardar.
- [ ] Se puede editar un servicio existente y los cambios persisten en Firestore.
- [ ] Se puede eliminar un servicio y desaparece del listado.
- [ ] El listado se actualiza en tiempo real (o al menos al recargar) reflejando altas, ediciones y bajas.
- [ ] El precio se muestra formateado en pesos con separador de miles y coma decimal.
- [ ] La vista respeta los estilos definidos en `tokens.css` y reutiliza las clases de `components.css` (sin colores hardcodeados nuevos).
- [ ] Si se intenta acceder a `/servicios` sin estar logueada, redirige a Login (comportamiento ya cubierto por `ProtectedRoute`, solo verificar que sigue funcionando).

## Notas para la IA

- Archivo principal a tocar: `src/views/Servicios.jsx`. Seguir la misma estructura que `src/views/Clientes.jsx` (ya implementado en el issue #1): `onSnapshot` para el listado en tiempo real, modal de alta/edición con `useState` de formulario, validación antes de guardar, `deleteDoc` con confirmación.
- Reutilizar `src/components/Modal.jsx` tal cual está, no crear un modal nuevo.
- Reutilizar las clases de `src/styles/components.css` (`.view__header`, `.search-input`, `.table-scroll`, `.table`, `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--danger`, `.form`, `.form__actions`) en vez de escribir CSS nuevo, salvo que haga falta algo específico de este formulario (ej. estilo del campo precio).
- No fusionar esta colección con `productos` ni reutilizar componentes de Stock — son catálogos independientes por decisión de diseño (ver `REQUIREMENTS.md`).
- Sin TypeScript — todo en JavaScript plano, igual que el resto del proyecto.
- No agregar Cloud Functions ni dependencias de Afip SDK/Claude API.
- Este issue es prerequisito técnico de Presupuestos (issue #4), que necesita seleccionar servicios del catálogo (o cargarlos libres) para las líneas tipo "servicio".
