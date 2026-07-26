# Tornería — Contexto del proyecto para Claude Code

## Qué es

Sistema de gestión para una tornería que vende repuestos y presta servicios (torneado, reparaciones, etc.). Permite manejar stock, armar presupuestos combinando repuestos y mano de obra, y llevar el registro de clientes. **Prioridad: funcionalidad punta a punta antes que pulido visual.**

Es un sistema de uso exclusivo para este negocio (sin lógica multi-tenant).

## Fase actual vs. fases futuras

**Ahora:** stock, clientes, servicios frecuentes y presupuestos — todo resoluble con React + Firestore, sin backend propio.

**Más adelante (no implementar todavía, requiere Cloud Functions):**
- Facturación electrónica conectada a ARCA vía Afip SDK
- Importación de facturas de proveedor por foto/PDF vía Claude Vision

Mientras estas dos no estén, la facturación se sigue haciendo por fuera del sistema (a mano o con otra herramienta). No agregar Cloud Functions, backend ni dependencias de Afip SDK/Claude API hasta que se pida explícitamente.

## Stack

- React + Vite, JavaScript plano (sin TypeScript)
- Firebase: Firestore + Authentication (email/password)
- Firebase Hosting
- `.env` tiene las credenciales reales — nunca subir a GitHub

## Modelo de datos (Firestore)

| Colección | Campos clave |
|---|---|
| `productos` | codigo, codigoBarras, descripcion, stockActual, stockMinimo, recargoPorcentaje, proveedores: [{ proveedorId, precioCosto, ultimaCompra }] |
| `proveedores` | nombre, cuit, contacto |
| `servicios` | descripcion, precio, categoria (opcional) — catálogo independiente de `productos`, no afecta stock |
| `clientes` | nombreRazonSocial, cuitODni, condicionIva, email, telefono |
| `presupuestos` | numero, fechaEmision, validoHasta, clienteId, trabajoEquipo, lineas: [{ tipo: "repuesto"\|"servicio", ... }], subtotal, iva, total, estado: "borrador"\|"aprobado"\|"facturado" |

Nota: un producto puede tener varios proveedores con costos distintos — no es una relación 1 a 1.

Las líneas de presupuesto son siempre separadas por tipo (repuesto o servicio), nunca combinadas en un precio único, para poder descontar stock automáticamente cuando corresponda.

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

**P1 — Uso diario**
5. Descuento automático de stock al facturar/aprobar presupuesto
6. Alertas de stock bajo + lista de pedido agrupada por proveedor (sugiere el proveedor más barato por producto, editable)

**P2 — Confort**
7. Escaneo de código de barras con la cámara
8. Impresión de etiquetas con código de barras

**Fuera de esta fase:** Facturación con ARCA, importación de facturas de proveedor por foto (ver arriba).

## Convenciones

- Commits chicos y descriptivos por feature. Preguntar antes de hacer push si no es obvio.
- Al terminar de implementar un issue, siempre sugerir el mensaje de commit al final de la respuesta.
- No agregar Cloud Functions, Afip SDK ni Claude API hasta que se pida explícitamente (ver "Fase actual vs. fases futuras").
