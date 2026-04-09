# Tealium Branding — Word (.docx)

Apply Tealium brand tokens to Word documents using the docx skill as the technical foundation.

## Prerequisites
Read the base `docx` SKILL.md first for the technical approach (docx-js for creation, unpack/repack XML for editing).

---

## Heading Styles

| Style      | Font       | Size  | Weight    | Color              |
|------------|------------|-------|-----------|--------------------|
| Heading 1  | Montserrat | 28px  | Bold      | Midnight `#051838` |
| Heading 2  | Montserrat | 22px  | Semi Bold | Deep Teal `#006D80`|
| Heading 3  | Montserrat | 16px  | Semi Bold | Deep Teal `#006D80`|
| Body       | Montserrat | 11px  | Regular   | Midnight `#051838` |
| Caption    | Montserrat | 9px   | Light     | Stone `#BFBFBF`    |

> If Montserrat is unavailable, substitute Open Sans.

---

## Page Layout

- **Background**: White `#FFFFFF` (default), or Canvas `#EDF1F4` for info sections
- **Margins**: 1 inch all sides (standard professional)
- **Accent bar**: Consider a left border in Deep Teal `#006D80` for pull quotes or callout boxes

## Callout / Info Boxes

Use a shaded background of Canvas (`#EDF1F4`) with a left border in Teal (`#68D8D5`) or Deep Teal (`#006D80`).

## Tables

| Element        | Style |
|----------------|-------|
| Header row bg  | Midnight `#051838` |
| Header text    | White `#FFFFFF`, Montserrat Semi Bold |
| Alt row bg     | Canvas `#EDF1F4` |
| Body text      | Midnight `#051838`, Montserrat Regular |
| Border color   | Stone `#BFBFBF` |

## Hyperlinks
Color: Deep Teal `#006D80`, underline on hover.

---

## docx-js Color Reference

```javascript
// In docx-js (HeadingLevel, Paragraph, etc.)
const TEALIUM = {
  midnight:  "051838",
  deepTeal:  "006D80",
  teal:      "68D8D5",
  mint:      "B0E2E2",
  lime:      "B2F94B",
  canvas:    "EDF1F4",
  stone:     "BFBFBF",
  white:     "FFFFFF",
};

// Example heading
new Paragraph({
  text: "Section Title",
  heading: HeadingLevel.HEADING_2,
  style: { run: { color: TEALIUM.deepTeal, font: "Montserrat", bold: true } }
})
```

---

## Quick Checklist
- [ ] Montserrat used for all text (Open Sans as fallback)
- [ ] Heading 1 in Midnight, Headings 2-3 in Deep Teal
- [ ] Tables use Midnight header rows with white text
- [ ] No off-brand colors introduced
- [ ] Lime not used as a background anywhere
