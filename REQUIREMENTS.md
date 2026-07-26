# Sistema de Stock, Presupuestos y Facturación — Tornería

## Contexto

Sistema de gestión para una tornería que vende repuestos y presta servicios (torneado, reparaciones, etc.). Permite manejar stock, armar presupuestos combinando repuestos y mano de obra, y facturar electrónicamente conectando con ARCA (ex AFIP).

Es un sistema independiente, de uso exclusivo para este negocio (no multi-tenant).

## Stack

- **Frontend/Backend**: Firebase (Firestore, Auth, Cloud Functions, Hosting)
- **Facturación electrónica**: [Afip SDK](https://afipsdk.com) como wrapper de los web services de ARCA (WSFEv1), en vez de conexión directa al WSDL
- **Extracción de datos de facturas de proveedor**: Claude API (Vision) desde Cloud Function
- **Desarrollo**: Claude Code + VS Code

## Decisiones de diseño

- Sistema independiente por negocio, sin lógica multi-tenant
- Facturación tercerizada a Afip SDK: el sistema no habla directo con el WSDL de ARCA, minimizando el riesgo de romperse ante cambios normativos
- Productos y Servicios son catálogos **separados** (no comparten colección), porque pueden evolucionar con necesidades distintas (ej: servicios podrían sumar tiempo estimado, kits, categorías propias)
- Un producto puede tener **múltiples proveedores**, cada uno con su propio costo — no hay relación 1:1 producto-proveedor
- Los presupuestos usan líneas **separadas** para repuestos y servicios (no líneas combinadas de precio único), lo que permite descuento automático de stock

## Pendiente de definir

- **Condición frente al IVA de la tornería** (monotributista vs responsable inscripto) — bloquea el desarrollo del módulo de Facturación (define tipo de comprobante a emitir y si se discrimina IVA). No bloquea Stock, Clientes, Servicios ni Presupuestos.

---

## Modelo de datos (borrador)

```
producto: {
  id, codigo, codigoBarras, descripcion,
  stockActual, stockMinimo,
  recargoPorcentaje,
  proveedores: [
    { proveedorId, precioCosto, ultimaCompra }
  ]
}

proveedor: {
  id, nombre, cuit, contacto
}

servicio: {
  id, descripcion, precio, categoria (opcional)
}
// Catálogo independiente del de productos

cliente: {
  id, nombreRazonSocial, cuitODni,
  condicionIva, email, telefono
}

presupuesto: {
  id, numero, fechaEmision, validoHasta,
  clienteId, trabajoEquipo (texto libre, ej. "Tractor Pauny doble tracción"),
  lineas: [
    { tipo: "repuesto", productoId, cantidad, precioUnitario },
    { tipo: "servicio", servicioId (opcional si es libre), descripcion, precio }
  ],
  subtotal, iva, total,
  estado: "borrador" | "aprobado" | "facturado"
}

factura: {
  id, presupuestoId, tipoComprobante,
  cae, fechaEmision, pdfUrl
}
```

---

## Funcionalidades

### P0 — Base (sin esto el sistema no es usable)

1. **Productos / Stock**
   - Alta manual: código, descripción, costo, % recargo → precio final calculado
   - Soporte para múltiples proveedores por producto, cada uno con su propio costo
   - Campo `stockMinimo` por producto
   - Importación de factura de proveedor (foto/PDF, formato variable entre proveedores) vía Claude Vision → extrae ítems propuestos → pantalla de revisión/confirmación antes de impactar stock

2. **Clientes**
   - ABM con razón social/nombre, CUIT o DNI, condición frente al IVA, email (requerido por ARCA)

3. **Servicios frecuentes**
   - Catálogo independiente (no afecta stock): descripción + precio
   - Editable/seleccionable al armar un presupuesto

4. **Presupuestos**
   - Líneas separadas: repuestos (buscados en stock, con precio y cantidad) + servicios (del catálogo o cargados libremente)
   - Campo "Trabajo/equipo" como contexto general (ej. tipo de máquina)
   - Campo "Válido hasta" (fecha de vencimiento)
   - Numeración correlativa y fecha de emisión automáticas
   - Cálculo de subtotal, IVA (pendiente de definición fiscal) y total
   - Estados: borrador → aprobado → facturado

5. **Facturación (ARCA vía Afip SDK)**
   - Conversión de presupuesto aprobado a factura real
   - Emisión vía Afip SDK: obtiene CAE, genera PDF y QR
   - *Bloqueado hasta definir condición de IVA de la tornería*

### P1 — Uso diario

6. **Descuento automático de stock al facturar**
   - Al facturar, las líneas tipo "repuesto" descuentan cantidad del stock; las líneas tipo "servicio" no afectan inventario

7. **Alertas de stock bajo + lista de pedido por proveedor**
   - Vista de productos por debajo de `stockMinimo`
   - Si el producto tiene más de un proveedor cargado, sugiere el de menor `precioCosto` (editable)
   - Selección múltiple (checkboxes) que arma una lista de pedido agrupada por proveedor elegido
   - Exportable / lista para enviar por WhatsApp

### P2 — Confort

8. **Escaneo de código de barras**
   - Búsqueda/carga de productos usando la cámara del dispositivo (ej. librería `html5-qrcode`)

9. **Impresión de etiquetas con código de barras**
   - Generación de etiqueta (código + descripción + precio) desde el sistema, usando librería tipo `JsBarcode`
   - Impresión vía navegador, compatible con impresora térmica o común
   - Selección múltiple de productos para impresión en lote

---

## Recursos de integración con ARCA

- Documentación oficial ARCA (WSFEv1 y otros): https://www.afip.gob.ar/ws/documentacion/ws-factura-electronica.asp
- Ayuda factura electrónica: https://www.afip.gob.ar/fe/ayuda/webservice.asp
- Docs Afip SDK: https://docs.afipsdk.com
- Referencia API Afip SDK: https://afipsdk.com/docs/api-reference/introduction
- Integración Node.js: https://docs.afipsdk.com/integracion/node.js
- Generación de certificado digital: https://afipsdk.com/generar-certificado-digital-arca
