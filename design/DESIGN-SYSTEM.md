# Design System Specification: The Mediterranean Editorial Aesthetic

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Archivist"**
This design system rejects the sterile, "app-like" feel of contemporary software in favor of a tactile, editorial experience. It is designed to feel like a premium, limited-run travel zine—something you would find in a boutique hotel in Jaffa or a high-end kitchen in the Galilee. 

The system moves beyond the standard grid through **Intentional Asymmetry**. By utilizing generous white space (using the `24` and `20` spacing tokens) and overlapping typography over imagery, we create a sense of rhythmic pacing. It is built for a Right-to-Left (RTL) Hebrew context, where the eye travels from the top-right, guided by bold, serif anchors and grounded by earthy, organic surfaces.

---

## 2. Colors & Surface Logic
The palette is a celebration of the Levantine landscape. We avoid pure white (#FFFFFF) entirely to prevent digital eye strain and maintain the "printed paper" warmth.

### Surface Hierarchy & The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders are strictly prohibited** for sectioning content. Boundaries are defined through background shifts and tonal nesting.

*   **The Layering Principle:** Treat the UI as stacked sheets of fine paper. 
    *   **Base:** `surface` (#fbf9f4) serves as the primary canvas.
    *   **Sections:** Use `surface-container-low` (#f5f3ee) for large background blocks that need to house multiple elements.
    *   **Elevated Content:** Place cards using `surface-container-lowest` (#ffffff - *used only as a tonal contrast*) on top of `surface-container` to create a soft, natural lift.
*   **The Signature Palette:**
    *   **Primary (`primary` - #9d3d2e):** Terracotta. Used for high-intent actions and brand moments.
    *   **Secondary (`secondary` - #56642b):** Deep Herb Green. Used for navigation and secondary interactive elements.
    *   **Tertiary (`tertiary` - #51652a):** Olive. Used for specialized labels and accents.

---

## 3. Typography
Typography is the voice of this system. We pair a high-contrast Serif with a functional Sans-Serif to balance storytelling with utility.

*   **Display & Headlines (`newsreader` / Frank Ruhl Libre):** 
    *   These are "confident" elements. Use `display-lg` and `headline-lg` for article titles and region names. 
    *   *Editorial Note:* Allow headlines to slightly overlap image containers (e.g., -12px margin) to break the boxy feel of mobile layouts.
*   **Titles & Body (`workSans` / Heebo):** 
    *   Optimized for Hebrew RTL legibility. Use `body-lg` for narrative descriptions and `title-md` for interactive UI labels.
    *   Line heights should be generous (1.5x - 1.6x) to mimic the airy feel of a lifestyle magazine.

---

## 4. Elevation & Depth
We eschew "material" depth for **Ambient Tonalism**.

*   **The Layering Rule:** Instead of shadows, use `surface-container-high` (#eae8e3) to nested elements within a `surface` background.
*   **Ambient Shadows:** When an element must float (e.g., a Bottom Sheet or a Floating Action Button), use a shadow tinted with `surface-tint` (#a03f30) at 4% opacity. 
    *   *Spec:* `0px 12px 32px rgba(160, 63, 48, 0.06)`
*   **The Ghost Border:** If contrast is required for accessibility, use `outline-variant` (#ddc0bb) at **20% opacity**. Never use a fully opaque outline.

---

## 5. Components

### Editorial Cards
Cards are the heart of the "zine" experience. 
*   **Radius:** `md` (0.75rem / 12px).
*   **Structure:** No borders. Use `surface-container-low` as the card base. 
*   **Imagery:** Images should feature a "Natural Film" grain overlay. Captions should use `label-md` in `on-surface-variant`.

### Buttons (The Primary Action)
*   **Style:** Large, pill-shaped (`full` roundedness).
*   **Color:** `primary` (#9d3d2e) with `on-primary` (#ffffff) text.
*   **Interaction:** On tap, the color shifts to `primary-container` (#bd5444). No heavy shadows; use a subtle scale-down effect (98%) to indicate tactility.

### Tappable Chips (Regions & Flavors)
*   **Style:** Pill-shaped (`full`).
*   **Unselected:** `surface-container-highest` (#e4e2dd) background with `on-surface` text.
*   **Selected:** `secondary` (#56642b) background with `on-secondary` (#ffffff) text.

### Discrete Circular Selectors (Day Picker)
*   **Geometry:** Perfect circles.
*   **States:** Use `outline` (#89726d) for inactive days and `primary` for the active day. This mimics the "circling a date in a physical planner" aesthetic.

### Inputs & Fields
*   **Design:** Forgo the "box" look. Use a `surface-container-low` background with a `3px` bottom-only stroke in `secondary` when focused.
*   **Spacing:** Use `spacing-4` (1.4rem) for internal padding to maintain the "generous editorial" feel.

---

## 6. Do's and Don'ts

### Do:
*   **Do** embrace RTL-specific asymmetry. A large headline should sit at the top-right, with the body text slightly indented from the left.
*   **Do** use the `surface-container` tiers to separate content. A "Chef's Tip" box should be `surface-container-highest` to differentiate it from the recipe body.
*   **Do** apply a subtle paper grain texture (2-3% opacity) to the `background` layer to enhance the tactile feel.

### Don't:
*   **Don't** use 1px dividers. Use `spacing-10` or `spacing-12` to create "white space" divisions between articles.
*   **Don't** use pure black (#000000). Use `on-surface` (#1b1c19) for all text to keep the look "printed."
*   **Don't** use gradients. This system relies on flat, sophisticated tonal shifts to convey quality.
*   **Don't** use standard iconography. Icons should be "Hand-Drawn Editorial" style or thin-stroke (1.5pt) to match the serif typography.