---
name: torneria-nano-design
description: Use this skill to generate well-branded interfaces and assets for Tornería Nano (mecánica general, torneado y reparaciones — stock, presupuestos y facturación), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Full project

This skill mirrors a subset of the Claude Design project `e2735b0d-d860-4ffc-8ef9-3a6ef5351ba2` ("Tornería Nano Design System"). The files here (readme.md, styles.css, thumbnail.html, the bundle/manifest, and the lint adherence rules) are the portable core. The full project also has per-component `.jsx` + `.prompt.md` sources, token CSS (`tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`), brand assets, and guideline specimen cards — fetch those via the DesignSync tool (`get_project`/`list_files`/`get_file` against that projectId) when a task needs them; don't assume they're duplicated on disk here.
