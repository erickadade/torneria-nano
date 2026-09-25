# 16 - ABM de Proveedores

## Problema

La vista de Proveedores (`src/views/Proveedores.jsx`) es hoy un placeholder sin funcionalidad. El issue #3 (ABM de Productos) agregó una forma de **crear** un proveedor rápido desde el formulario de producto (nombre, CUIT opcional, contacto opcional), pero eso fue explícitamente un mínimo para no bloquear Stock — no hay forma de ver el listado completo de proveedores, editarlos ni eliminarlos. Además, `Presupuestos.jsx` y `Stock.jsx` ya referencian `proveedorId` en varios lugares, así que los datos existen en Firestore pero no hay una vista dedicada para gestionarlos.

## Objetivo

Que Vale pueda dar de alta, listar, editar y eliminar proveedores desde la vista de Proveedores, igual que ya puede hacerlo con Clientes (#1) y Servicios (#2).

## Fuera de alcance

- Historial de compras o vinculación con `ultimaCompra` de los productos (no pedido, y depende de cómo evolucione el módulo de stock).
- Validación de CUIT contra el padrón de AFIP/ARCA (fase futura).
- Cambiar o quitar la creación rápida de proveedor que ya existe dentro del formulario de producto (`Stock.jsx`, issue #3) — sigue funcionando igual, este issue solo agrega la vista propia.
- Lista de pedido agrupada por proveedor (funcionalidad 7, P1, issue aparte).

## Requisitos

### P0 (bloqueante)

- Reutilizar la colección `proveedores` ya existente en Firestore (creada por el issue #3):
  ```
  proveedor: { id, nombre, cuit, contacto }
  ```
  No se modifica la forma del documento.
- Listado de proveedores en `Proveedores.jsx`: tabla (patrón `table-scroll` / `table`) con nombre, CUIT y contacto.
- Formulario de alta de proveedor (modal, reutilizando `Modal` de `src/components/Modal.jsx`) con: nombre (obligatorio), CUIT (opcional), contacto (opcional) — mismos campos y opcionalidad que la creación rápida de `Stock.jsx`, para no generar inconsistencias entre los dos flujos.
- Edición de proveedor existente (mismos campos que el alta).
- Eliminación de proveedor con confirmación (`window.confirm`, mismo patrón que los issues anteriores).
  - Antes de eliminar, avisar si el proveedor está referenciado por algún producto (`productos` donde `proveedores[].proveedorId` coincide) — mostrar un mensaje de advertencia en la confirmación (ej. "Este proveedor está cargado en 3 productos. ¿Eliminar igual?"), pero no bloquear la eliminación (no hay integridad referencial en Firestore, y bloquear agregaría complejidad no pedida).
- Vista protegida por `ProtectedRoute` (ya aplica a nivel de ruta en `App.jsx`, verificar que no se rompe).
- Buscador por nombre o CUIT (mismo patrón que `Clientes.jsx`).
- Usar los tokens de `src/styles/tokens.css` y reutilizar las clases de `src/styles/components.css` (`.table`, `.table-scroll`, `.btn`, `.form`, `.search-input`, `.view__header`, etc.) — nada de CSS nuevo salvo que haga falta algo muy puntual.

### P1 (deseable)

- Desde la fila de un proveedor, mostrar cuántos productos lo tienen cargado (mismo cálculo que se usa para la advertencia de borrado).

## Criterios de aceptación

- [ ] Se puede crear un proveedor con nombre (sin CUIT ni contacto) y aparece en el listado.
- [ ] Se puede editar un proveedor existente (incluido uno creado desde el flujo rápido de `Stock.jsx`) y los cambios persisten en Firestore.
- [ ] Se puede eliminar un proveedor sin productos asociados sin advertencia especial.
- [ ] Al eliminar un proveedor que está cargado en al menos un producto, la confirmación avisa cuántos productos lo referencian.
- [ ] El buscador filtra por nombre o CUIT.
- [ ] El listado se actualiza en tiempo real (o al menos al recargar) reflejando altas, ediciones y bajas.
- [ ] Un proveedor creado desde el formulario de producto (`Stock.jsx`) aparece correctamente en el listado de `Proveedores.jsx` sin necesidad de tocarlo.
- [ ] La vista respeta los estilos de `tokens.css` y reutiliza las clases de `components.css`.
- [ ] Si se intenta acceder a `/proveedores` sin estar logueada, redirige a Login (comportamiento ya cubierto por `ProtectedRoute`, solo verificar que sigue funcionando).

## Notas para la IA

- Archivo principal a tocar: `src/views/Proveedores.jsx`. Seguir la misma estructura que `Clientes.jsx` (issue #1, el más parecido en complejidad): `onSnapshot` para el listado en tiempo real, modal de alta/edición con `useState` de formulario, validación antes de guardar, `deleteDoc` con confirmación.
- Reutilizar `Modal.jsx` tal cual está, no crear un modal nuevo.
- Para el conteo de productos asociados antes de eliminar, alcanza con filtrar la lista de `productos` ya traída por un `onSnapshot` (mismo patrón que usa `Presupuestos.jsx` para cruzar `clientes`/`servicios`/`productos`) — no hace falta una query especial de Firestore ni un índice compuesto.
- No tocar la lógica de creación rápida de proveedor en `src/views/Stock.jsx` (issue #3) — debe seguir funcionando igual, ambos flujos escriben a la misma colección.
- Sin TypeScript — todo en JavaScript plano, igual que el resto del proyecto.
- No agregar Cloud Functions ni dependencias de Afip SDK/Claude API.
