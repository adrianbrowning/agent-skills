---
name: tealium-branding
description: >
  Apply Tealium brand guidelines to documents and presentations. Use this skill whenever
  the user wants to brand, rebrand, or apply Tealium's visual identity to any document.
  Triggers include: "apply Tealium branding", "make this on-brand", "brand this document",
  "Tealium style", "rebrand this", "apply our brand guidelines", "update colors/fonts to
  match Tealium". Supports Word (.docx), PowerPoint (.pptx), and PDF files. Always use
  this skill when the user mentions Tealium brand, brand guidelines, or wants a document
  to look like Tealium's official materials.
---

# Tealium Branding Skill

Apply Tealium's official brand guidelines to Word, PowerPoint, and PDF documents.

## Quick Reference

| Task | Guide |
|------|-------|
| Brand a Word doc | Read [docx-branding.md](references/docx-branding.md) + use docx skill |
| Brand a PowerPoint | Read [pptx-branding.md](references/pptx-branding.md) + use pptx skill |
| Brand a PDF | Read [pdf-branding.md](references/pdf-branding.md) + use pdf skill |

---

## Tealium Brand Tokens

These are the canonical values to use across ALL document types.

### Primary Colors
| Name       | Hex       | RGB              | Use |
|------------|-----------|------------------|-----|
| Teal       | `#68D8D5` | 104, 216, 213    | Primary accent, highlights |
| Deep Teal  | `#006D80` | 0, 109, 128      | Headings, key UI elements |
| Midnight   | `#051838` | 5, 24, 56        | Backgrounds, dark sections |

### Accent Colors
| Name | Hex       | Use |
|------|-----------|-----|
| Mint | `#B0E2E2` | Light backgrounds, subtle highlights |
| Lime | `#B2F94B` | Strategic accent ONLY — never for backgrounds |

### Canvas / Neutral Colors
| Name   | Hex       | Use |
|--------|-----------|-----|
| Canvas | `#EDF1F4` | Light page/slide backgrounds |
| Stone  | `#BFBFBF` | Dividers, secondary UI elements |
| White  | `#FFFFFF` | Body content areas, card backgrounds |

### Approved Gradients (backgrounds and standalone elements only)
| Name              | Direction   | From      | To        |
|-------------------|-------------|-----------|-----------|
| Deep Teal & Midnight | Left → Right | `#006D80` | `#051838` |
| Teal & Midnight      | Left → Right | `#68D8D5` | `#051838` |

### Typography
| Role            | Font         | Weights Available |
|-----------------|--------------|-------------------|
| Primary         | Montserrat   | Thin (18px+ only), Extra Light (18px+ only), Light, Regular, Medium, Semi Bold, Bold |
| System Fallback | Open Sans    | Regular, Bold |

**Font loading (for programmatic use):**
```
https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700&display=swap
```

---

## General Branding Principles

1. **ADA Compliance**: Always use contrasting color combinations. Dark text on light backgrounds, white/light text on Midnight or Deep Teal backgrounds.
2. **Gradients**: Use two colors max. Limit to backgrounds or standalone design elements — never on body text.
3. **Lime accent**: Use sparingly for strategic highlights only. Never as a background color.
4. **Typography**: Default to Montserrat Bold/Semi Bold for headings, Montserrat Regular/Medium for body. Fall back to Open Sans if Montserrat is unavailable.
5. **White space**: Tealium's style is clean and spacious — avoid clutter.

---

## Workflow

### Step 1: Read the file-type-specific guide
Before making changes, read the reference file for the document type you're working with:
- Word → `references/docx-branding.md`
- PowerPoint → `references/pptx-branding.md`
- PDF → `references/pdf-branding.md`

### Step 2: Also use the base skill
This skill builds ON TOP of the existing docx / pptx / pdf skills. Always read the relevant base skill first for the technical how-to, then layer Tealium brand tokens on top.

### Step 3: Apply branding
Use the brand tokens above consistently. When in doubt, prefer:
- **Headings**: Deep Teal (`#006D80`) or Midnight (`#051838`) text, Montserrat Bold
- **Body**: Midnight (`#051838`) or dark gray text on white/canvas backgrounds
- **Accents/CTAs**: Teal (`#68D8D5`) or Deep Teal
- **Dark sections**: Midnight background with white text

### Step 4: Validate
Before delivering the file, confirm:
- [ ] Montserrat (or Open Sans) is used throughout
- [ ] Colors match the palette above — no off-brand colors
- [ ] Sufficient contrast for readability (ADA compliance)
- [ ] Lime (`#B2F94B`) not used as a background
- [ ] Gradients limited to backgrounds / standalone elements only
