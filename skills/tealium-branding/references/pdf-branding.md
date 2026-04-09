# Tealium Branding — PDF

Apply Tealium brand tokens to PDFs. Because PDFs are generally not editable after export, the primary strategy is to brand the *source* document first (Word or PowerPoint), then export to PDF. Direct PDF editing is a fallback for cases where the source is unavailable.

## Prerequisites
Read the base `pdf` SKILL.md first for technical tooling (WeasyPrint, reportlab, PyMuPDF, etc.).

---

## Recommended Approach

### Option A: Brand source → Export to PDF (preferred)
1. If user has a .docx source → apply `docx-branding.md` guidelines, then export via LibreOffice:
   ```bash
   python scripts/office/soffice.py --headless --convert-to pdf branded.docx
   ```
2. If user has a .pptx source → apply `pptx-branding.md` guidelines, then export via LibreOffice:
   ```bash
   python scripts/office/soffice.py --headless --convert-to pdf branded.pptx
   ```

### Option B: Generate PDF directly (HTML → PDF via WeasyPrint)
Use WeasyPrint for new documents. Apply the CSS below.

### Option C: Overlay/patch existing PDF
Use PyMuPDF (`fitz`) to add branded headers, footers, or overlays onto an existing PDF. Limited — cannot restyle embedded fonts.

---

## CSS / WeasyPrint Brand Styles

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

:root {
  --midnight:  #051838;
  --deep-teal: #006D80;
  --teal:      #68D8D5;
  --mint:      #B0E2E2;
  --lime:      #B2F94B;
  --canvas:    #EDF1F4;
  --stone:     #BFBFBF;
  --white:     #FFFFFF;
}

body {
  font-family: 'Montserrat', 'Open Sans', sans-serif;
  color: var(--midnight);
  background: var(--white);
  margin: 72px;  /* ~1 inch */
}

h1 { font-size: 28px; font-weight: 700; color: var(--midnight); }
h2 { font-size: 22px; font-weight: 600; color: var(--deep-teal); }
h3 { font-size: 16px; font-weight: 600; color: var(--deep-teal); }
p  { font-size: 11px; font-weight: 400; line-height: 1.6; }

/* Cover / hero page */
.cover {
  background: var(--midnight);
  color: var(--white);
  padding: 72px;
}
.cover h1 { color: var(--white); }
.cover .subtitle { color: var(--teal); }

/* Callout box */
.callout {
  background: var(--canvas);
  border-left: 4px solid var(--teal);
  padding: 12px 16px;
  margin: 16px 0;
}

/* Table */
table { width: 100%; border-collapse: collapse; }
thead { background: var(--midnight); color: var(--white); }
thead th { font-weight: 600; padding: 8px 12px; }
tbody tr:nth-child(even) { background: var(--canvas); }
tbody td { padding: 8px 12px; border-bottom: 1px solid var(--stone); }

/* Page header/footer */
@page {
  margin: 72px;
  @top-right {
    content: "TEALIUM CONFIDENTIAL";
    font-family: 'Montserrat', sans-serif;
    font-size: 8px;
    color: var(--stone);
  }
  @bottom-right {
    content: counter(page);
    font-family: 'Montserrat', sans-serif;
    font-size: 9px;
    color: var(--deep-teal);
  }
}
```

---

## PyMuPDF Header/Footer Overlay (Option C)

```python
import fitz  # pip install pymupdf

DEEP_TEAL = (0/255, 109/255, 128/255)
MIDNIGHT  = (5/255, 24/255, 56/255)
TEAL      = (104/255, 216/255, 213/255)

doc = fitz.open("input.pdf")
for page in doc:
    w, h = page.rect.width, page.rect.height
    # Header bar
    page.draw_rect(fitz.Rect(0, 0, w, 36), color=MIDNIGHT, fill=MIDNIGHT)
    # Footer line
    page.draw_line(fitz.Point(36, h-36), fitz.Point(w-36, h-36), color=TEAL, width=1)
    # Page number
    page.insert_text((w-72, h-20), str(page.number+1),
                     fontsize=9, color=DEEP_TEAL)
doc.save("branded_output.pdf")
```

---

## Quick Checklist
- [ ] Montserrat used (or Open Sans fallback in CSS)
- [ ] Cover/hero uses Midnight background
- [ ] Headings: Midnight (H1) or Deep Teal (H2/H3)
- [ ] Tables: Midnight header row, Canvas alternating rows
- [ ] No Lime backgrounds
- [ ] ADA contrast maintained throughout
