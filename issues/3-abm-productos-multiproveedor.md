# 3 - ABM de Productos/Stock con múltiples proveedores

## Problema

La vista de Stock (`src/views/Stock.jsx`) es hoy un placeholder sin funcionalidad ("Próximamente: alta y listado de productos"). No existe forma de cargar, ver, editar ni eliminar productos, y por lo tanto tampoco de llevar stock real del negocio. Sin esto, ningún otro módulo (presupuestos, alertas de stock) tiene datos sobre los que operar.

## Objetivo

Que Vale pueda dar de alta, listar, editar y eliminar productos desde la vista de Stock, con soporte para que cada producto tenga múltiples proveedores asociados, cada uno con su propio costo, y que el precio final se calcule automáticamente a partir del costo y el recargo.

## Fuera de alcance

- Importación de factura de proveedor por foto/PDF vía Claude Vision (funcionalidad 1 de `REQUIREMENTS.md`, fase futura — requiere Cloud Functions, no implementar todavía).
- Escaneo de código de barras con cámara (P2).
- Impresión de etiquetas (P2).
- Alertas de stock bajo y lista de pedido agrupada por proveedor (P1, issue aparte).
- Descuento automático de stock al facturar/aprobar presupuesto (P1, issue aparte — depende de que exista Presupuestos).
- ABM avanzado de Proveedores (edición completa, validación de CUIT, historial de compras). Este issue solo cubre lo mínimo para poder asociar un proveedor a un producto (ver Requisitos P0).

## Requisitos

### P0 (bloqueante)

- Colección `productos` en Firestore con la forma definida en `REQUIREMENTS.md`:
  ```
  producto: {
    id, codigo, codigoBarras, descripcion,
    stockActual, stockMinimo,
    recargoPorcentaje,
    proveedores: [
      { proveedorId, precioCosto, ultimaCompra }
    ]
  }
  ```
  `codigo` y `codigoBarras` se cargan manualmente (a diferencia del `codigo` autogenerado de `servicios` del issue #2) — son datos físicos del repuesto (código interno o de fabricante), no un correlativo del sistema. Vale suele reutilizar directamente el código que ya trae la pieza del proveedor (etiqueta/factura) en vez de inventar uno propio — no hace falta ninguna lógica especial para esto, es simplemente lo que va a tipear en el campo `codigo`.
- Colección `proveedores` en Firestore con la forma:
  ```
  proveedor: { id, nombre, cuit, contacto }
  ```
- Listado de productos en `Stock.jsx`: tabla (usando el patrón `table-scroll` / `table` de `src/styles/components.css`, ya usado en `Clientes.jsx` y `Servicios.jsx`) con código, descripción, stock actual, stock mínimo y precio final calculado (usando el proveedor de menor `precioCosto` cuando hay más de uno).
- Formulario de alta de producto (modal, reutilizando el componente `Modal` de `src/components/Modal.jsx` tal cual está) con: código (obligatorio), código de barras (opcional), descripción (obligatoria), stock actual, stock mínimo, % recargo, y al menos un proveedor con su costo.
- Poder agregar más de un proveedor al mismo producto desde el formulario (agregar/quitar filas de proveedor + costo), no una relación 1 a 1.
- Selector de proveedor dentro del formulario: si no hay proveedores cargados aún, permitir crear uno rápido (nombre obligatorio, CUIT y contacto opcionales) sin salir del flujo de alta de producto.
- Cálculo automático del precio final: `precioCosto * (1 + recargoPorcentaje / 100)`, usando el costo del proveedor más barato cuando el producto tiene varios.
- Edición de producto existente (mismos campos que el alta, incluyendo editar/agregar/quitar proveedores).
- Eliminación de producto con confirmación (`window.confirm`, mismo patrón que `Clientes.jsx` y `Servicios.jsx`).
- Vista protegida por `ProtectedRoute` (ya aplica a nivel de ruta en `App.jsx`, verificar que no se rompe).
- Usar los tokens de `src/styles/tokens.css` para colores, tipografía y espaciado, y reutilizar las clases ya creadas en `src/styles/components.css` (`.table`, `.table-scroll`, `.btn`, `.form`, `.search-input`, `.view__header`, etc.) en vez de duplicar estilos — nada de hex codes hardcodeados.
- Formatear costos y precios en pesos con separador de miles `.` y decimal `,` (es-AR), igual que en `Servicios.jsx`.

### P1 (deseable)

- Buscador/filtro por código o descripción en el listado.
- Orden de columnas en la tabla (por stock, por precio).
- Mostrar en el listado un indicador visual simple si `stockActual <= stockMinimo` (sin implementar todavía la vista de alertas completa, que es P1 aparte).

## Criterios de aceptación

- [ ] Se puede crear un producto con un solo proveedor y ver el precio final calculado correctamente.
- [ ] Se puede crear un producto con dos o más proveedores, cada uno con costo distinto, y el precio final usa el costo más bajo.
- [ ] Se puede editar un producto existente y los cambios persisten en Firestore.
- [ ] Se puede eliminar un producto y desaparece del listado.
- [ ] Se puede crear un proveedor nuevo desde el formulario de producto sin salir del flujo.
- [ ] El listado de productos se actualiza en tiempo real (o al menos al recargar) reflejando altas, ediciones y bajas.
- [ ] Los montos se muestran formateados en pesos (es-AR).
- [ ] La vista respeta los estilos definidos en `tokens.css` y reutiliza las clases de `components.css` (sin colores hardcodeados nuevos).
- [ ] Si se intenta acceder a `/stock` sin estar logueada, redirige a Login (comportamiento ya cubierto por `ProtectedRoute`, solo verificar que sigue funcionando).

## Notas para la IA

- Archivo principal a tocar: `src/views/Stock.jsx`. Seguir la misma estructura que `src/views/Clientes.jsx` y `src/views/Servicios.jsx` (issues #1 y #2, ya implementados): `onSnapshot` para el listado en tiempo real, modal de alta/edición con `useState` de formulario, validación antes de guardar, `deleteDoc` con confirmación.
- Reutilizar `src/components/Modal.jsx` tal cual está, no crear un modal nuevo.
- El array `proveedores` dentro del formulario necesita su propio estado local (lista de filas `{ proveedorId, precioCosto }`, con `ultimaCompra` seteado a la fecha de guardado) — puede vivir como estado dentro de `Stock.jsx`, no hace falta un componente separado a menos que simplifique la implementación.
- Respetar el modelo multi-proveedor: nunca simplificar `proveedores` a un solo campo `proveedorId`/`precioCosto` plano en el producto.
- No crear Cloud Functions ni agregar dependencias de Afip SDK / Claude API — la importación de facturas de proveedor queda fuera de este issue.
- Sin TypeScript — todo en JavaScript plano, igual que el resto del proyecto.
- No es necesario implementar todavía el ABM completo de Proveedores como vista propia (`src/views/Proveedores.jsx` sigue siendo un placeholder) — la creación rápida de proveedor descripta en Requisitos P0 puede vivir como parte del formulario de producto o como un mini-modal propio.
- Este issue es prerequisito técnico de: descuento automático de stock (funcionalidad 6), alertas de stock bajo (funcionalidad 7) y de las líneas tipo "repuesto" en Presupuestos (funcionalidad 4), aunque no dependen del ABM completo de Proveedores.
