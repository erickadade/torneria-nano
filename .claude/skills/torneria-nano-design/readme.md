# Tornería Nano — Design System

## Brand context
Tornería Nano is a general-mechanics, lathing/turning ("torneado") and repair business: it sells spare parts (rodamientos, retenes, correas, etc.) and offers technical services (hidráulica, asesoramiento técnico, reparación de piezas). This design system is the visual foundation for a **daily-use internal app**: stock management, presupuestos (quotes) and facturación (invoicing). It is a work tool, not a marketing site — legibility on a shop-floor/counter screen and fast data entry matter more than decoration.

**Source provided:** `uploads/logo original.jpeg` — the only brand asset supplied. No codebase, Figma file, or existing app was attached. Colors, type, spacing and components below are therefore derived from the logo and from the stated functional brief (stock/budget/invoicing app, quick-entry forms, tables of products and amounts), not copied from an existing product. If a real codebase or Figma file exists, attach it and this system should be reconciled against it.

## Content fundamentals
- **Language:** Spanish (Argentina/rioplatense conventions — "vos" register is acceptable in UI copy, e.g. "Cargá un producto" rather than "Carga un producto" or "Cargue un producto").
- **Tone:** direct, workshop-plain. No marketing flourish, no exclamation points for routine confirmations. Short imperative verbs for actions: "Guardar", "Agregar ítem", "Emitir factura", "Anular".
- **Casing:** sentence case for buttons/labels/messages ("Nuevo presupuesto", not "NUEVO PRESUPUESTO" or "Nuevo Presupuesto"). ALL CAPS is reserved for the wordmark/brand lockup and section eyebrows only, never for body copy or buttons.
- **Numbers & money:** always formatted with thousands separator `.` and decimal `,` (es-AR): `$ 145.300,00`. Quantities show unit when relevant ("12 u.", "3,5 m").
- **Errors/empty states:** plain and specific ("No hay stock cargado para este repuesto" rather than a generic "Algo salió mal"). No blame language.
- **Emoji:** not used anywhere in the product. The brand voice is industrial/technical, not playful.
- **Terms of art:** keep the trade vocabulary as-is (repuesto, rodamiento, retén, presupuesto, remito, factura A/B/C) — do not translate or soften into generic SaaS words like "item" or "order".

## Visual foundations
- **Color:** primary is the terracotta/burnt-orange from the logo gear (`--color-primary-500 #bb4c1f`), used for primary actions, active states, and key numbers/totals. Secondary/accent is a metallic steel gray (`--color-steel-500 #82888a`), used for icons, secondary buttons, and structural borders — it stands in for the logo's chrome bearing/piston without trying to reproduce a metallic gradient in UI (gradients don't hold up at small sizes or in dense tables). Neutrals are a warm off-black/off-white gray ramp (`--gray-0…900`), not cool blue-grays — this keeps the app feeling industrial rather than "generic SaaS." The dark charcoal background of the logo is used only in brand contexts (the logo itself, the app icon, maybe a header strip) — the working app surface is light for all-day legibility on shop screens.
- **Semantic colors:** success is a clear green, error a red pulled toward crimson/magenta (not orange-red) so it never gets confused with the primary brand color at a glance, warning is a gold/amber shifted well away from the primary hue for the same reason.
- **Type:** display/headings use **Oswald**, a condensed, bold, technical-feeling sans that echoes the logo's condensed industrial lockup without the metallic-engraved effect (which doesn't survive at UI sizes). Body copy, labels, and form fields use **IBM Plex Sans** — a highly legible, engineered-feeling sans built for dense interfaces. Monetary and quantity values in tables use **IBM Plex Mono** (tabular figures) so columns of numbers align cleanly — important with lots of stock/price tables.
- **Spacing & density:** 4px base unit. Controls default to 40px height (comfortable single-hand tapping/clicking during fast counter-side entry), with a 32px compact size for dense tables and a 48px size for primary CTAs. Table rows default to 44px (36px compact mode) — enough room for scanning a stock list quickly without excessive scrolling.
- **Backgrounds:** flat only. No gradients, no photographic hero imagery, no illustrations, no textures/patterns in the working app. The only place a gradient/metallic effect belongs is the historical logo lockup itself (kept as reference asset), never reproduced in UI.
- **Radius:** small and consistent — 6px for controls (inputs, buttons, tags), 8px for cards/panels, 999px (pill) for status badges only. Nothing is fully rounded/"bubbly"; the brand is mechanical, not soft.
- **Borders & shadows:** 1px hairline borders (`--border-default`) are the primary way to separate cards/table rows — shadows are used sparingly and only to lift transient surfaces (dropdowns, dialogs, toasts) off the page, never as a decorative default on every card. Elevation scale: xs/sm/md/lg, all a warm near-black at low opacity (not cool black or brand-colored shadows).
- **Hover/press states:** hover darkens by one step on the color ramp (primary-500 → primary-600); press/active darkens one step further (→ primary-700) with no scale/shrink transform — this is a data-entry tool, not a playful consumer app, so motion stays subtle. Disabled controls drop to 40% opacity with no color change.
- **Motion:** minimal. 120–180ms ease-out for hover/focus/opening panels. No bounce, no spring, no page-transition choreography — quick, utilitarian, gets out of the way.
- **Transparency/blur:** none in the base UI. Dialog/modal scrims use a flat dark overlay at low opacity (no backdrop-blur) — keeps rendering cheap on lower-end shop-floor hardware.
- **Imagery:** no photography or illustration system defined yet (none was supplied). Any product photos (parts/repuestos) would be neutral, well-lit product shots — not stylized or filtered — but this system ships no stock imagery; use plain gray placeholders until real product photography exists.

## Iconography
No icon library was supplied with the brand. This system uses **Lucide** icons (CDN, MIT-licensed, geometric/technical stroke style that pairs well with the condensed industrial type) at 1.75px stroke, sized 16/20/24px. Do not mix in emoji or a second icon set. The only bespoke mark is the isotype derived from the real logo (see below) — never hand-draw new "brand" icons from scratch; if the shop needs a bespoke pictogram (e.g. a lathe glyph), source or commission it rather than approximating it freehand.

## Logo & isotype
- `assets/logo-full.jpeg` — the original provided lockup (gear + piston + bearing, metallic/3D, on charcoal), for brand/marketing contexts only (letterhead, invoice header, van signage reference). Do not shrink this below ~200px wide; the metallic detail and wordmark disappear.
- `assets/isotype.svg` — a flat, single-color-per-shape derivative built from the same two recognizable elements (the gear + the ball-bearing ring), redrawn without the chrome/3D effect, in the app's primary orange and steel-gray on a dark chip. Legible down to 16×16px; use as favicon/app icon and anywhere the full lockup won't fit.

## Intentional additions
- **Table / DataTable** — not in the source (there is no source component library), but explicitly required by the brief (stock lists, budget line items, invoice line items are the core of daily use).
- **StatusBadge** — quote/invoice states (Borrador, Enviado, Pagado, Vencido) need a compact status pill; built as a constrained variant of Badge.

## Components
- **Core:** Button, IconButton
- **Forms:** Input, Select, Checkbox, Radio, Switch
- **Feedback:** Badge, StatusBadge (intentional addition), Tag, Toast, Tooltip
- **Overlay:** Dialog
- **Navigation:** Tabs
- **Data:** Table (intentional addition)
- **Surfaces:** Card

## Index
- `styles.css` — root stylesheet, imports everything below.
- `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — design tokens.
- `assets/` — logo, isotype, favicon.
- `guidelines/` — foundation specimen cards (Design System tab).
- `components/` — reusable primitives, grouped by concern.
- `ui_kits/app/` — Tornería Nano stock/presupuestos/facturación app screens.
- `SKILL.md` — portable skill for using this system elsewhere.
