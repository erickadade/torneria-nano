# 1 - ABM de Clientes

## Problema

La vista de Clientes (`src/views/Clientes.jsx`) es hoy un placeholder sin funcionalidad. No existe forma de dar de alta, ver, editar ni eliminar clientes, y sin esto no se puede avanzar con Presupuestos (funcionalidad 4), que necesita asociar cada presupuesto a un `clienteId` existente.

## Objetivo

Que Vale pueda dar de alta, listar, editar y eliminar clientes desde la vista de Clientes, con los datos necesarios para identificarlos y, a futuro, facturarles.

## Fuera de alcance

- Cualquier validación o integración con ARCA/padrón de AFIP para verificar CUIT (fase futura, bloqueada por la definición de condición de IVA de la tornería).
- Historial de presupuestos o facturas por cliente (eso vive en las vistas de Presupuestos/Facturas, no en este issue).
- Importación masiva de clientes (CSV u otro formato).

## Requisitos

### P0 (bloqueante)

- Colección `clientes` en Firestore con la forma definida en `REQUIREMENTS.md`:
  ```
  cliente: {
    id, nombreRazonSocial, cuitODni,
    condicionIva, email, telefono
  }
  ```
- Listado de clientes en `Clientes.jsx`: tabla con nombre/razón social, CUIT o DNI, condición frente al IVA, email y teléfono.
- Formulario de alta de cliente (modal, usando el componente `Modal` que prevé `CLAUDE.md` en `components/`) con los campos: nombre/razón social (obligatorio), CUIT o DNI (obligatorio), condición frente al IVA (obligatorio, select), email (obligatorio — lo requiere ARCA a futuro), teléfono (opcional).
- Validación básica de formato antes de guardar: email con formato válido, CUIT/DNI solo numérico (con guiones opcionales para CUIT).
- Edición de cliente existente (mismos campos que el alta).
- Eliminación de cliente con confirmación (usar patrón de confirmación existente en el proyecto si ya hay uno, o un `window.confirm` simple si no).
- Vista protegida por `ProtectedRoute` (ya aplica a nivel de ruta en `App.jsx`, verificar que no se rompe).
- Usar los tokens de `src/styles/tokens.css` para colores, tipografía y espaciado — nada de hex codes hardcodeados.

### P1 (deseable)

- Buscador/filtro por nombre o CUIT/DNI en el listado.
- Orden alfabético por defecto en la tabla, con opción de reordenar por columna.

## Criterios de aceptación

- [ ] Se puede crear un cliente completando todos los campos obligatorios y aparece en el listado.
- [ ] Si falta un campo obligatorio o el email/CUIT tiene formato inválido, el formulario no permite guardar y muestra el error.
- [ ] Se puede editar un cliente existente y los cambios persisten en Firestore.
- [ ] Se puede eliminar un cliente y desaparece del listado.
- [ ] El listado de clientes se actualiza en tiempo real (o al menos al recargar) reflejando altas, ediciones y bajas.
- [ ] La vista respeta los estilos definidos en `tokens.css` (sin colores hardcodeados nuevos).
- [ ] Si se intenta acceder a `/clientes` sin estar logueada, redirige a Login (comportamiento ya cubierto por `ProtectedRoute`, solo verificar que sigue funcionando).

## Notas para la IA

- Archivos principales a tocar: `src/views/Clientes.jsx`, `src/lib/firebase.js` (si hace falta agregar helpers de Firestore).
- Si hace falta un componente `Modal` genérico y todavía no existe en `src/components/`, crearlo ahí (`CLAUDE.md` ya lo prevé como parte de la estructura del proyecto) — probablemente se reutilice en los issues de Productos (#3) y Servicios (#2), así que conviene dejarlo genérico desde acá.
- Las opciones válidas para `condicionIva` no están confirmadas en `REQUIREMENTS.md` más allá del nombre del campo — usar las categorías estándar de AFIP/ARCA (Responsable Inscripto, Monotributista, Exento, Consumidor Final) salvo que Dany indique otras.
- Sin TypeScript — todo en JavaScript plano, igual que el resto del proyecto.
- No agregar Cloud Functions ni dependencias de Afip SDK/Claude API.
- Este issue es prerequisito técnico de Presupuestos (issue #4), que necesita seleccionar un `clienteId` existente.
