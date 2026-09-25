#!/usr/bin/env bash
# Setup inicial de GitHub para Tornería Nano: labels + milestones + issues esqueleto.
# Requiere GitHub CLI (`gh`) instalado y autenticado: gh auth login
#
# Uso:
#   chmod +x setup-github-torneria-nano.sh
#   ./setup-github-torneria-nano.sh

set -e

REPO="erickadade/torneria-nano"

echo "== Repo: $REPO =="
echo

# ---------------------------------------------------------------------------
# LABELS
# ---------------------------------------------------------------------------
echo "-- Creando labels --"

gh label create "P0"  --color "d73a4a" --description "Bloqueante — base del sistema"        --repo "$REPO" --force
gh label create "P1"  --color "fbca04" --description "Uso diario"                            --repo "$REPO" --force
gh label create "P2"  --color "0e8a16" --description "Confort"                               --repo "$REPO" --force
gh label create "futuro" --color "c5def5" --description "Fuera de alcance actual"            --repo "$REPO" --force

gh label create "modulo:clientes"     --color "bfdadc" --repo "$REPO" --force
gh label create "modulo:servicios"    --color "bfdadc" --repo "$REPO" --force
gh label create "modulo:stock"        --color "bfdadc" --repo "$REPO" --force
gh label create "modulo:presupuestos" --color "bfdadc" --repo "$REPO" --force
gh label create "modulo:facturas"     --color "bfdadc" --repo "$REPO" --force
gh label create "modulo:arca"         --color "bfdadc" --repo "$REPO" --force

echo
echo "-- Creando milestones --"

# gh api devuelve el milestone creado; si ya existe, lo ignoramos (|| true)
gh api repos/$REPO/milestones -f title="P0 — Base"          -f description="Stock, clientes, servicios, presupuestos y registro de facturas/cobros. Sin esto el sistema no es usable." --silent || true
gh api repos/$REPO/milestones -f title="P1 — Uso diario"    -f description="Descuento automático de stock y alertas de stock bajo."                                                    --silent || true
gh api repos/$REPO/milestones -f title="P2 — Confort"       -f description="Escaneo de código de barras e impresión de etiquetas."                                                      --silent || true
gh api repos/$REPO/milestones -f title="Futuro — fuera de alcance" -f description="Emisión electrónica ARCA e importación de facturas de proveedor. No implementar todavía."             --silent || true

echo
echo "-- Creando issues (esqueleto, sin detalle P0/P1 interno todavía) --"

# --- Milestone 1: P0 — Base ---------------------------------------------
# Orden de desarrollo acordado: Clientes → Servicios → Stock → Presupuestos → Facturas

gh issue create --repo "$REPO" \
  --title "ABM de Clientes" \
  --body "Alta, edición, baja y listado de clientes: razón social/nombre, CUIT o DNI, condición frente al IVA, email, teléfono. Ver colección \`clientes\` en REQUIREMENTS.md." \
  --label "P0,modulo:clientes" \
  --milestone "P0 — Base"

gh issue create --repo "$REPO" \
  --title "Catálogo de Servicios frecuentes" \
  --body "ABM del catálogo de servicios (descripción, precio, categoría opcional), independiente de productos/stock. Seleccionable/editable al armar un presupuesto." \
  --label "P0,modulo:servicios" \
  --milestone "P0 — Base"

gh issue create --repo "$REPO" \
  --title "ABM de Productos/Stock con múltiples proveedores" \
  --body "Alta y edición de productos: código, descripción, costo, % recargo → precio final calculado, stockActual, stockMinimo. Soporte para múltiples proveedores por producto, cada uno con su propio costo (no simplificar a 1:1)." \
  --label "P0,modulo:stock" \
  --milestone "P0 — Base"

gh issue create --repo "$REPO" \
  --title "Presupuestos con líneas separadas (repuesto/servicio)" \
  --body "Armado de presupuestos: líneas separadas para repuestos (buscados en stock) y servicios (del catálogo o libres), campo trabajo/equipo, válido hasta, numeración y fecha automáticas, cálculo de subtotal/IVA/total, estados borrador → aprobado → facturado." \
  --label "P0,modulo:presupuestos" \
  --milestone "P0 — Base"

gh issue create --repo "$REPO" \
  --title "Registro de facturas y cobros (interno, sin ARCA)" \
  --body "Creación de factura a partir de un presupuesto aprobado (copia líneas automáticamente) o carga directa sin presupuesto. Registra medio de pago, estado de pago (pendiente/cobrado) y fecha de cobro para cheque/cheque digital. Independiente de la emisión fiscal ante ARCA." \
  --label "P0,modulo:facturas" \
  --milestone "P0 — Base"

# --- Milestone 2: P1 — Uso diario ---------------------------------------

gh issue create --repo "$REPO" \
  --title "Descuento automático de stock al facturar" \
  --body "Al facturar, las líneas tipo repuesto descuentan cantidad del stock; las líneas tipo servicio no afectan inventario." \
  --label "P1,modulo:stock" \
  --milestone "P1 — Uso diario"

gh issue create --repo "$REPO" \
  --title "Alertas de stock bajo + lista de pedido por proveedor" \
  --body "Vista de productos por debajo de stockMinimo. Si el producto tiene más de un proveedor, sugiere el de menor precioCosto (editable). Selección múltiple que arma lista de pedido agrupada por proveedor, exportable." \
  --label "P1,modulo:stock" \
  --milestone "P1 — Uso diario"

# --- Milestone 3: P2 — Confort -------------------------------------------

gh issue create --repo "$REPO" \
  --title "Escaneo de código de barras" \
  --body "Búsqueda/carga de productos usando la cámara del dispositivo (ej. html5-qrcode)." \
  --label "P2,modulo:stock" \
  --milestone "P2 — Confort"

gh issue create --repo "$REPO" \
  --title "Impresión de etiquetas con código de barras" \
  --body "Generación de etiqueta (código + descripción + precio) con librería tipo JsBarcode, impresión vía navegador compatible con impresora térmica o común. Selección múltiple para impresión en lote." \
  --label "P2,modulo:stock" \
  --milestone "P2 — Confort"

# --- Milestone 4: Futuro --------------------------------------------------

gh issue create --repo "$REPO" \
  --title "[Futuro] Emisión electrónica ante ARCA (Afip SDK)" \
  --body "Conecta el registro interno de facturas con la emisión real: obtiene CAE, genera PDF y QR. Bloqueado hasta definir condición de IVA (monotributista vs. responsable inscripto) y hasta sumar Cloud Functions. No implementar todavía." \
  --label "futuro,modulo:arca" \
  --milestone "Futuro — fuera de alcance"

gh issue create --repo "$REPO" \
  --title "[Futuro] Importación de factura de proveedor vía Claude Vision" \
  --body "Extracción de ítems desde foto/PDF de factura de proveedor (formato variable), con pantalla de revisión/confirmación antes de impactar stock. Requiere Cloud Functions. No implementar todavía." \
  --label "futuro,modulo:stock" \
  --milestone "Futuro — fuera de alcance"

echo
echo "== Listo. Revisá los issues creados en: https://github.com/$REPO/issues =="
