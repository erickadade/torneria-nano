# Tornería — Contexto del proyecto para Claude Code

## Qué es

Sistema de gestión para una tornería que vende repuestos y presta servicios (torneado, reparaciones, etc.). Permite manejar stock, armar presupuestos combinando repuestos y mano de obra, llevar el registro de clientes, y registrar facturas y cobros. **Prioridad: funcionalidad punta a punta antes que pulido visual.**

Es un sistema de uso exclusivo para este negocio (sin lógica multi-tenant).

## Fase actual vs. fases futuras

**Ahora:** stock, clientes, servicios frecuentes, presupuestos y registro interno de facturas y cobros (sin conexión a ARCA) — todo resoluble con React + Firestore, sin backend propio.

**Más adelante (no implementar todavía, requiere Cloud Functions):**
- Emisión electrónica ante ARCA vía Afip SDK (CAE, PDF, QR) — además bloqueada hasta definir la condición de IVA de la tornería (monotributista vs. responsable inscripto)
- Importación de facturas de proveedor por foto/PDF vía Claude Vision

El registro de facturas y cobros del sistema (número, cliente, medio de pago, estado de cobro) **no depende de esta definición** — se puede construir ya. Lo que queda afuera por ahora es únicamente conectar ese registro con la emisión fiscal real ante ARCA. Mientras tanto, el comprobante fiscal se sigue emitiendo por fuera del sistema (a mano o con otra herramienta). No agregar Cloud Functions, backend ni dependencias de Afip SDK/Claude API hasta que se pida explícitamente.

## Stack

- React + Vite, JavaScript plano (sin TypeScript)
- Firebase: Firestore + Authentication (email/password)
- Firebase Hosting
- `.env` tiene las credenciales reales — nunca subir a GitHub

## Frontend

- El frontend siempre debe desarrollarse **responsive** (mobile-first o al menos con breakpoints que cubran mobile, tablet y desktop). Vale puede necesitar usar el sistema desde el celular en el taller, así que ninguna vista puede asumir pantalla de escritorio.

## Modelo de datos (Firestore)

| Colección | Campos clave |
|---|---|
| `productos` | codigo, codigoBarras, descripcion, stockActual, stockMinimo, recargoPorcentaje, proveedores: [{ proveedorId, precioCosto, ultimaCompra }] |
| `proveedores` | nombre, cuit, contacto |
| `servicios` | descripcion, precio, categoria (opcional) — catálogo independiente de `productos`, no afecta stock |
| `clientes` | nombreRazonSocial, cuitODni, condicionIva, email, telefono |
| `presupuestos` | numero, fechaEmision, validoHasta, clienteId, trabajoEquipo, lineas: [{ tipo: "repuesto"\|"servicio", ... }], subtotal, iva, total, estado: "borrador"\|"aprobado"\|"facturado" |
| `facturas` | numero, fechaEmision, presupuestoId (opcional — si viene de un presupuesto aprobado), clienteId, lineas (copiadas del presupuesto o cargadas directo), total, medioPago: "efectivo"\|"cheque"\|"cheque_digital"\|"debito"\|"tarjeta_credito", fechaCobro (solo si medioPago es cheque o cheque_digital), estadoPago: "pendiente"\|"cobrado". *Campos de emisión ARCA (facturadoArca, tipoComprobante, cae, pdfUrl) quedan para la fase futura.* |

Notas:
- Un producto puede tener varios proveedores con costos distintos — no es una relación 1 a 1.
- Las líneas de presupuesto son siempre separadas por tipo (repuesto o servicio), nunca combinadas en un precio único, para poder descontar stock automáticamente cuando corresponda.
- Al crear una factura, primero se elige si parte de un presupuesto existente (se listan los aprobados y sus líneas se copian automáticamente) o si se carga directo sin presupuesto.

## Roles y permisos

- Un solo usuario/rol por ahora (dueña del negocio). No hay distinción de roles como en sophIA.
- Todas las vistas requieren login (no hay secciones públicas).

## Estructura de carpetas

```
src/
  views/         # Stock, Proveedores, Servicios, Clientes, Presupuestos, Login
  components/    # Header, ProductoCard, PresupuestoForm, LineaItem, Modal, ProtectedRoute
  styles/        # tokens.css, global.css, components.css
  lib/           # firebase.js
  hooks/         # useAuth.jsx
issues/          # prompts y contexto inicial de cada funcionalidad
```


## Funcionalidades — prioridad de desarrollo

**P0 — Base**
1. Productos/Stock (con múltiples proveedores por producto)
2. Clientes
3. Servicios frecuentes (catálogo aparte)
4. Presupuestos (líneas separadas repuesto/servicio)
5. Registro de facturas y cobros (interno, sin ARCA) — medio de pago, estado de pago, fecha de cobro para cheques

**P1 — Uso diario**
6. Descuento automático de stock al facturar/aprobar presupuesto
7. Alertas de stock bajo + lista de pedido agrupada por proveedor (sugiere el proveedor más barato por producto, editable)

**P2 — Confort**
8. Escaneo de código de barras con la cámara
9. Impresión de etiquetas con código de barras

**Fuera de esta fase:**
10. Emisión electrónica ante ARCA vía Afip SDK (CAE, PDF, QR) — bloqueada hasta definir condición de IVA
11. Importación de facturas de proveedor por foto/PDF vía Claude Vision

## Convenciones

- Commits chicos y descriptivos por feature. Preguntar antes de hacer push si no es obvio.
- Al terminar de implementar un issue, siempre sugerir el mensaje de commit al final de la respuesta.
- No agregar Cloud Functions, Afip SDK ni Claude API hasta que se pida explícitamente (ver "Fase actual vs. fases futuras").
