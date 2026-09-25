---
name: torneria-issues
description: "Genera issues para GitHub del proyecto Tornería Nano (sistema de gestión de stock, presupuestos y facturación para la tornería de Vale — React/Vite/Firebase) en formato estándar, y los guarda como archivo .md descargable con el número de issue en el nombre. Usar este skill siempre que Dany quiera documentar, redactar, armar o generar un issue, bug, feature, mejora o tarea técnica para Tornería Nano, sin importar cómo lo pida (ej: \"creame el issue del módulo de stock\", \"documentá esto para Claude Code\", \"armá el .md del issue 5\", \"necesito el archivo del issue de presupuestos\"). El archivo SIEMPRE debe entregarse como .md descargable, nunca solo como bloque de código en el chat."
---

# Skill: Issues Tornería Nano

Genera issues para GitHub del proyecto **Tornería Nano** en formato estándar, pensado para ser implementado por Claude Code (VS Code), y los entrega como archivo `.md` descargable.

---

## Contexto del proyecto

- **Proyecto**: Tornería Nano — sistema de gestión para el negocio de tornería/mecánica general de Vale (sobrina de Dany): stock de repuestos, proveedores, catálogo de servicios, clientes, presupuestos y (a futuro) facturación electrónica ARCA.
- **Stack**: React + Vite + Firebase (Firestore + Authentication). JavaScript plano, sin TypeScript. Routing con `react-router-dom`.
- **Dev**: VS Code con extensión Claude Code. Claude (claude.ai) documenta el issue → Dany lo crea en GitHub con número asignado → Claude Code lo implementa en VS Code.
- **Hosting**: Firebase Hosting. Proyecto Firebase: `torneria-nano`.
- **Contexto en el repo**: `CLAUDE.md` y `REQUIREMENTS.md` viven en la raíz — Claude Code arranca cada sesión con ese contexto. Si un issue contradice algo de esos documentos, señalarlo antes de redactar.
- **Restricciones fijas**:
  - **Sin TypeScript** — no sugerir tipados ni archivos `.ts`/`.tsx`.
  - **Sin Cloud Functions por ahora** — esa capa quedó diferida a una fase futura. Todo se resuelve client-side contra Firestore. Si un requerimiento realmente necesita Cloud Functions, marcarlo como bloqueado y consultarlo con Dany, no incluirlo como implementación.
  - **Facturación bloqueada** — el módulo de facturación (ARCA vía Afip SDK) está pendiente de la definición de condición de IVA de Vale (monotributista vs. responsable inscripto). No redactar issues de facturación sin que Dany confirme que se destrabó.
  - Firestore (no Realtime Database).
  - Autenticación con email/password de Firebase Auth; vistas protegidas con `ProtectedRoute`.
- **Modelo de datos (conceptual)**:
  - **Productos/Stock**: cada producto puede tener **múltiples proveedores, cada uno con su propio costo** (Vale compra la misma pieza a distintos proveedores según precio). Cualquier issue que toque productos debe respetar este modelo multi-proveedor.
  - **Servicios**: catálogo **separado** de productos (colección propia), no fusionar con stock.
  - **Presupuestos**: ítems de repuestos y de servicios como **líneas separadas**, cada una con su precio — esto es lo que habilita el descuento automático de stock al facturar (P1).
  - **Clientes** y **Proveedores**: colecciones propias.
  - Los nombres exactos de las colecciones están en `REQUIREMENTS.md` del repo — en "Notas para la IA" referir a ese documento en vez de inventar nombres si hay dudas.
- **Prioridades del proyecto** (para ubicar cada issue):
  - **P0**: productos/stock multi-proveedor, clientes, catálogo de servicios, presupuestos con líneas separadas.
  - **P1**: descuento automático de stock al facturar, alertas de stock bajo con listas de pedido agrupadas por proveedor (sugiere el más barato, permite override manual).
  - **P2**: escaneo de códigos de barras con cámara del dispositivo, impresión de etiquetas desde el navegador.
- **Identidad visual** (industrial, derivada del logo):
  - Naranja/terracota — primario
  - Gris metálico — acento (bordes, íconos, elementos secundarios)
  - Grises neutros para texto y fondos (interfaz clara, de uso diario)
  - Tokens en `src/styles/tokens.css` (design system generado con Claude Design). No hardcodear hex codes fuera de los tokens.
  - UI pensada para **carga rápida**: tablas de productos, montos y formularios ágiles. Priorizar legibilidad sobre decoración.
- **Estructura de carpetas relevante**:
  ```
  src/
    views/         # Login, Stock, Proveedores, Servicios, Clientes, Presupuestos
    components/    # Header, ProtectedRoute (y los que se sumen)
    styles/        # tokens.css, global.css, components.css
    lib/           # firebase.js
    hooks/         # useAuth.jsx
  issues/          # donde viven los .md de issues en el repo
  CLAUDE.md
  REQUIREMENTS.md
  ```

---

## Flujo de trabajo

1. **El issue ya existe en GitHub** (Dany lo crea ahí primero) y tiene un número asignado. Si Dany no dio el número todavía, **preguntale antes de generar el archivo** — el nombre del archivo lo necesita.
2. Redactar el contenido siguiendo el formato estándar (abajo).
3. Si el cambio toca el mapeo de algo existente en el código (por ejemplo, todos los usos de un campo que se va a migrar), incluir ese mapeo como parte de los Requisitos P0 — no como un paso aparte fuera del formato issue.
4. Guardar como archivo `.md` en `/mnt/user-data/outputs/`.
5. Entregar el archivo con `present_files` para que Dany lo descargue y lo mueva a `issues/` en su repo local.

No mostrar el issue como bloque de código en el chat para copiar/pegar — el pedido explícito es que sea un archivo descargable real.

---

## Nomenclatura del archivo

```
{numero}-{slug-del-titulo}.md
```

- `numero`: número de issue de GitHub, sin ceros a la izquierda salvo que Dany use ese formato (si ya hay convención visible en archivos anteriores, seguirla).
- `slug-del-titulo`: título corto en minúsculas, en español, separado por guiones, sin tildes ni caracteres especiales.

**Ejemplos:**
- `3-abm-productos-multiproveedor.md`
- `4-catalogo-de-servicios.md`
- `7-alertas-stock-bajo.md`

Si Dany no da el número de issue, preguntar antes de nombrar el archivo. No inventar ni asumir un número.

---

## Formato estándar del issue

El contenido del archivo (no solo lo que se muestra en chat) sigue esta estructura, **en español**:

```markdown
# [Número] - [Título corto y descriptivo]

## Problema
[Qué está roto, qué falta, o qué necesidad motiva el issue. Concreto y breve — 2-4 oraciones. Si es un bug, incluir cómo se manifiesta y en qué contexto (ej: "al cargar un producto desde la vista de Stock", "al armar un presupuesto con servicios").]

## Objetivo
[Qué se va a lograr al resolver este issue. Una o dos oraciones, en términos de resultado, no de implementación.]

## Fuera de alcance
- [Qué NO incluye este issue, para que Claude Code no se exceda]
- [Otra cosa explícitamente excluida, si aplica]

## Requisitos

### P0 (bloqueante)
- [Si el issue implica migrar o tocar un campo/patrón ya usado en el código, el primer requisito P0 es mapear el impacto con grep antes de tocar nada — ver "Mapeo de impacto" abajo]
- [Requisito imprescindible para considerar el issue resuelto]
- [Otro requisito P0]

### P1 (deseable)
- [Mejora que suma pero no bloquea el cierre del issue]

## Criterios de aceptación
- [ ] [Condición verificable — si se puede probar manualmente o convertir en test, mejor]
- [ ] [Otra condición verificable]
- [ ] [Caso borde o de error relevante]

## Notas para la IA
- [Archivos exactos a tocar — nombres reales, no genéricos: `Stock.jsx`, `Presupuestos.jsx`, no "una vista"]
- [Convenciones o restricciones del proyecto que aplican a este issue específico (multi-proveedor, sin Cloud Functions, tokens.css, etc.)]
- [Lógica existente que NO debe modificarse]
- [Cualquier dependencia con otro issue, si aplica — aclarar si es dependencia técnica real o solo de orden de revisión]
```

---

## Mapeo de impacto (cuando aplica)

Si el issue implica cambiar un campo, patrón o convención que ya se usa en varios lugares del código (ej: cambiar la forma del array de proveedores por producto, renombrar un campo de Firestore, cambiar la forma de un componente compartido), el primer requisito P0 debe pedir explícitamente un mapeo antes de modificar nada:

```markdown
- Antes de tocar código, correr y reportar:
  ```bash
  grep -rn "<patrón>" src/ --include="*.jsx" --include="*.js" -l
  grep -rn "<patrón>" src/ --include="*.jsx" --include="*.js"
  ```
  Si aparecen usos en archivos no anticipados en este issue, reportarlo como bloqueante antes de continuar — no migrar esos casos sin confirmación.
```

Esto no es una sección aparte del formato — vive dentro de Requisitos P0, como el primer ítem.

---

## Reglas de generación

1. **Título**: descriptivo y concreto. Puede usar verbo en infinitivo o forma directa ("ABM de productos con múltiples proveedores", "Bug: el total del presupuesto no suma servicios") — lo que comunique mejor el cambio.
2. **Problema antes que Objetivo**: siempre arrancar describiendo el problema/necesidad actual, no la solución.
3. **Fuera de alcance**: incluir siempre, aunque sea una sola línea. Ayuda a que Claude Code no bundlee cosas no pedidas — preferencia consistente de Dany de separar por responsabilidad distinta (ej: separar "ABM de productos" de "alertas de stock bajo" aunque toquen la misma vista).
4. **P0 vs P1**: si todo el issue es bloqueante, está bien que P1 quede vacío o se omita — no forzar contenido ahí.
5. **Nombres explícitos en Notas para la IA**: siempre nombres reales de archivos/componentes del proyecto (`Stock.jsx`, `Presupuestos.jsx`, `firebase.js`, `useAuth.jsx`, etc.), nunca genéricos. Para nombres de colecciones o campos de Firestore que no estén confirmados, referir a `REQUIREMENTS.md` en vez de inventar.
6. **Criterios de aceptación verificables**: redactarlos como checklist, no como prosa — que se puedan tickear. No mezclar con formato Given/When/Then dentro del mismo issue.
7. **Respetar el modelo multi-proveedor**: cualquier issue que toque productos, costos o pedidos debe asumir que un producto tiene N proveedores con costo propio. Nunca simplificar a "un proveedor por producto".
8. **Servicios y productos no se mezclan**: son colecciones y catálogos separados. Un issue que los toque a ambos probablemente deba dividirse.
9. **Sin Cloud Functions ni TypeScript**: no incluir requisitos que dependan de Cloud Functions (diferidas) ni sugerir tipados. Si algo lo requiere de verdad, marcarlo como bloqueado y consultar.
10. **Facturación no se toca** hasta que Dany confirme la definición de IVA. Si un issue roza facturación (ej. descuento de stock "al facturar"), acotar el alcance a lo que sí está habilitado (ej. descuento al confirmar presupuesto) o dejar la parte de facturación explícitamente fuera de alcance.
11. **Design system**: los issues de UI deben indicar el uso de los tokens de `src/styles/tokens.css` — nada de hex codes hardcodeados.
12. **Ambigüedades como pregunta, no como asunción**: si algo del alcance no está claro, no resolverlo por cuenta propia en el issue — preguntarle a Dany antes de redactarlo, o dejarlo marcado explícitamente como pendiente de confirmar dentro de "Notas para la IA" si es menor.
13. **Issues grandes se dividen**: si un pedido junta cambios de responsabilidad distinta (ej. cambiar el modelo de datos + agregar alertas en la misma vista), proponerle a Dany separarlos en issues independientes antes de redactar, en vez de meter todo en uno solo.

---

## Checklist antes de entregar

- [ ] Número de issue confirmado por Dany (no asumido)
- [ ] Nombre de archivo en formato `{numero}-{slug}.md`
- [ ] Problema descrito antes que Objetivo
- [ ] Fuera de alcance presente
- [ ] Requisitos separados en P0/P1 (con mapeo de impacto como primer P0 si el issue migra o renombra algo existente)
- [ ] Criterios de aceptación como checklist verificable, un solo formato
- [ ] Notas para la IA con nombres de archivo reales (o referencia a `REQUIREMENTS.md` si el dato no está confirmado)
- [ ] Se respeta: multi-proveedor, servicios separados, sin TypeScript, sin Cloud Functions, facturación bloqueada, tokens del design system
- [ ] Archivo guardado en `/mnt/user-data/outputs/` y entregado con `present_files`
- [ ] Recordarle a Dany que debe mover el archivo a `issues/` en su repo local
