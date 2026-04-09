# Tealium Branding — PowerPoint (.pptx)

Apply Tealium brand tokens to presentations using the pptx skill as the technical foundation.

## Prerequisites
Read the base `pptx` SKILL.md first (pptxgenjs.md for creation, editing.md for editing).

---

## Slide Layout System

### Title / Hero Slide
- **Background**: Midnight `#051838` solid, OR Deep Teal → Midnight gradient (left to right)
- **Title**: Montserrat Bold, 40–48pt, White `#FFFFFF`
- **Subtitle**: Montserrat Light, 20–24pt, Teal `#68D8D5` or White

### Section Divider Slide
- **Background**: Deep Teal `#006D80` solid, OR Teal → Midnight gradient
- **Text**: White `#FFFFFF`, Montserrat Bold

### Content Slide (standard)
- **Background**: White `#FFFFFF` or Canvas `#EDF1F4`
- **Title**: Montserrat Semi Bold, 24–28pt, Midnight `#051838` or Deep Teal `#006D80`
- **Body text**: Montserrat Regular, 14–16pt, Midnight `#051838`
- **Accent stripe**: Thin bar (4–6pt) in Teal `#68D8D5` below title

### Dark Content Slide
- **Background**: Midnight `#051838`
- **Title**: Montserrat Bold, white
- **Body**: Montserrat Regular, white or Mint `#B0E2E2`

---

## Typography Scale

| Element        | Font       | Size  | Weight    |
|----------------|------------|-------|-----------|
| Slide title    | Montserrat | 28pt  | Bold      |
| Section header | Montserrat | 22pt  | Semi Bold |
| Body text      | Montserrat | 14pt  | Regular   |
| Bullet text    | Montserrat | 13pt  | Regular   |
| Caption/label  | Montserrat | 10pt  | Light     |

---

## Bullet Points & Lists
- Use Deep Teal `#006D80` or Teal `#68D8D5` for bullet markers
- Body text: Midnight `#051838` on light slides, White on dark slides

## Charts & Data Visualizations
| Series | Color |
|--------|-------|
| Primary | Deep Teal `#006D80` |
| Secondary | Teal `#68D8D5` |
| Tertiary | Mint `#B0E2E2` |
| Highlight | Lime `#B2F94B` (use sparingly) |
| Background | Canvas `#EDF1F4` |
| Grid lines | Stone `#BFBFBF` |

## Dividers / Rules
Use Teal `#68D8D5` or Deep Teal `#006D80`, 1–2pt weight.

---

## pptxgenjs Color Reference

```javascript
const TEALIUM = {
  midnight: "051838",
  deepTeal: "006D80",
  teal:     "68D8D5",
  mint:     "B0E2E2",
  lime:     "B2F94B",
  canvas:   "EDF1F4",
  stone:    "BFBFBF",
  white:    "FFFFFF",
};

// Title slide example
slide.addText("Presentation Title", {
  x: 0.5, y: 1.5, w: 9, h: 1.5,
  fontSize: 44, bold: true,
  fontFace: "Montserrat",
  color: TEALIUM.white,
});
slide.background = { color: TEALIUM.midnight };

// Gradient background
slide.background = {
  type: "gradient",
  gradientType: "linear",
  angle: 0,
  stops: [
    { color: TEALIUM.deepTeal, position: 0 },
    { color: TEALIUM.midnight, position: 100 }
  ]
};
```

---

## Quick Checklist
- [ ] Title slide uses Midnight background or approved gradient
- [ ] Content slides use White or Canvas background
- [ ] All fonts are Montserrat (or Open Sans fallback)
- [ ] No gradients on body text
- [ ] Lime used for highlights only, not backgrounds
- [ ] Chart colors follow the Tealium data palette
