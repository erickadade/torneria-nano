# 5 - Registro de facturas y cobros (interno, sin ARCA)

## Problema

No existe ninguna vista ni colección para registrar facturas. Hoy Presupuestos (#4) llega hasta el estado `facturado` como una simple etiqueta, pero no hay ningún registro real de qué se facturó, por qué medio de pago, ni si ya se cobró — que es justamente lo que Vale necesita para llevar el control interno del negocio mientras la facturación electrónica ante ARCA sigue bloqueada (ver `REQUIREMENTS.md`, "Pendiente de definir").

## Objetivo

Que Vale pueda registrar una factura —a partir de un presupuesto aprobado (copiando sus líneas automáticamente) o cargada directo sin presupuesto—, con medio de pago y estado de cobro, para saber en todo momento qué facturó y qué le falta cobrar.

## Fuera de alcance

- **Emisión electrónica ante ARCA** (funcionalidad 10, fase futura, bloqueada — no se emite CAE, no se genera PDF fiscal, no se completa `facturadoArca`/`tipoComprobante`/`cae`/`pdfUrl`. Esos campos del modelo quedan sin usar por ahora).
- Descuento automático de stock al facturar (funcionalidad 6, P1, issue aparte).
- Edición o eliminación de una factura ya creada (no pedido — una factura, igual que en la vida real, no se "edita"; si hace falta corregir algo, es un caso a resolver manualmente por ahora, no forma parte de este issue).
- Reportes o totales agregados de cobros pendientes (podría ser un P1 futuro, no entra acá).
- Impresión e exportación de la factura a PDF.

## Requisitos

### P0 (bloqueante)

- Colección `facturas` en Firestore con la forma definida en `REQUIREMENTS.md`:
  ```
  factura: {
    id, numero, fechaEmision,
    presupuestoId (opcional — si viene de un presupuesto),
    clienteId,
    lineas,
    total,
    medioPago: "efectivo" | "cheque" | "cheque_digital" | "debito" | "tarjeta_credito",
    fechaCobro (solo si medioPago = cheque o cheque_digital),
    estadoPago: "pendiente" | "cobrado",
    facturadoArca: false,
    tipoComprobante: null, cae: null, pdfUrl: null
  }
  ```
  Los campos de ARCA se guardan con esos valores fijos (`false`/`null`) — no se completan en este issue.
- `numero` es un **correlativo autogenerado**, mismo patrón que `numero` en `presupuestos` (#4) y `codigo` en `servicios` (#2): contador en `contadores/facturas` incrementado con `runTransaction`.
- Nueva vista `Facturas` (`src/views/Facturas.jsx`), con su ruta `/facturas` en `src/App.jsx` (protegida por `ProtectedRoute`, mismo patrón que las demás rutas) y su link en la navegación de `src/components/Header.jsx` (agregar "Facturas" al array `links`, tanto en el nav de escritorio como el mobile ya existente).
- Formulario de alta de factura (modal, reutilizando `Modal` de `src/components/Modal.jsx`), con dos flujos posibles que Vale elige primero:
  - **Con presupuesto**: selector que lista únicamente los presupuestos en estado `aprobado` (de la colección `presupuestos`, #4). Al elegir uno, se copian automáticamente `clienteId`, `lineas` y `total` — no se recargan ítems a mano. Al guardar la factura, el presupuesto de origen pasa automáticamente a estado `facturado` (actualización en la misma operación, vía `updateDoc` sobre `presupuestos/{id}`).
  - **Sin presupuesto**: se carga cliente (selector de `clientes`, #1) y líneas directamente, reutilizando el mismo bloque de líneas repuesto/servicio que ya existe en `Presupuestos.jsx` (selector de producto/servicio o carga libre, agregar/quitar líneas, cálculo de total en vivo).
- Campo **medio de pago** (select obligatorio): efectivo, cheque, cheque digital, débito, tarjeta de crédito.
- Campo **fecha de cobro**: visible y obligatorio solo cuando el medio de pago es cheque o cheque digital (mostrar/ocultar el campo según la selección).
- Campo **estado de pago** (select: pendiente / cobrado), pendiente por defecto al crear.
- Listado de facturas en `Facturas.jsx`: tabla (patrón `table-scroll` / `table`) con número, cliente, fecha de emisión, total, medio de pago y estado de pago. El estado de pago se puede cambiar directo desde un select inline en la tabla (mismo patrón que el estado de `Presupuestos.jsx`), para marcar como "cobrado" sin abrir el formulario completo.
- Vista protegida por `ProtectedRoute`.
- Usar los tokens de `src/styles/tokens.css` y reutilizar las clases ya existentes de `src/styles/components.css` — nada de CSS nuevo salvo lo puntual que haga falta (ej. mostrar/ocultar el campo de fecha de cobro).
- Formatear montos en pesos (es-AR), igual que en el resto del sistema.

### P1 (deseable)

- Buscador/filtro por número o cliente en el listado.
- Indicador visual en la tabla para facturas con `estadoPago: "pendiente"` con `medioPago` cheque/cheque digital cuya `fechaCobro` ya pasó (cheque vencido sin acreditar).

## Criterios de aceptación

- [ ] Se puede crear una factura a partir de un presupuesto en estado `aprobado`, y sus líneas/cliente/total se copian automáticamente sin recargar nada.
- [ ] Al crear la factura desde un presupuesto, ese presupuesto pasa a estado `facturado` (verificable en la vista de Presupuestos).
- [ ] El selector de presupuestos para facturar solo muestra los que están en estado `aprobado` (no `borrador` ni ya `facturado`).
- [ ] Se puede crear una factura sin presupuesto, cargando cliente y líneas manualmente (repuesto y/o servicio).
- [ ] Cada factura nueva recibe un número correlativo que no se repite.
- [ ] Si el medio de pago es cheque o cheque digital, el formulario exige fecha de cobro; con cualquier otro medio, el campo no aparece.
- [ ] El listado muestra correctamente número, cliente, fecha, total, medio de pago y estado de pago.
- [ ] Se puede cambiar el estado de pago de "pendiente" a "cobrado" directo desde el listado.
- [ ] El listado se actualiza en tiempo real (o al menos al recargar) reflejando altas y cambios de estado de pago.
- [ ] Los montos se muestran formateados en pesos (es-AR).
- [ ] Si se intenta acceder a `/facturas` sin estar logueada, redirige a Login.
- [ ] El link "Facturas" aparece en el menú de navegación (desktop y mobile) y funciona igual que los demás.

## Notas para la IA

- Archivo principal a crear: `src/views/Facturas.jsx`. Seguir la misma estructura general que `Presupuestos.jsx` (#4, el más parecido: numeración correlativa, líneas repuesto/servicio, selector de cliente) — reutilizar la lógica de líneas tal cual esté ahí en vez de reescribirla, aunque probablemente haga falta duplicar el bloque de JSX de líneas (o extraerlo a un componente compartido si el duplicado es demasiado grande — usar criterio; no es obligatorio para este issue, pero es una buena oportunidad si sale natural).
- Tocar también: `src/App.jsx` (nueva ruta `/facturas`) y `src/components/Header.jsx` (nuevo link en `links`, tanto el nav de escritorio como `header__nav--mobile`).
- Para el correlativo de `numero`, replicar el patrón de `runTransaction` ya usado en `Servicios.jsx` (#2) y `Presupuestos.jsx` (#4), contra `contadores/facturas`.
- Al guardar una factura creada "con presupuesto", la actualización del estado del presupuesto de origen a `facturado` debe ir en la misma función async que crea la factura (no hace falta una transacción atómica entre ambas escrituras — un fallo parcial es un caso borde aceptable para este issue, no se pide manejarlo).
- No completar los campos de ARCA (`facturadoArca`, `tipoComprobante`, `cae`, `pdfUrl`) más allá de sus valores fijos por defecto — no armar ninguna lógica alrededor de ellos.
- No descontar stock en este issue (ver "Fuera de alcance") — eso es la funcionalidad 6, un issue aparte.
- Sin TypeScript — todo en JavaScript plano, igual que el resto del proyecto.
- No agregar Cloud Functions ni dependencias de Afip SDK/Claude API.
- Este issue depende funcionalmente de Clientes (#1), Servicios (#2), Stock (#3) y Presupuestos (#4), todos ya implementados.
