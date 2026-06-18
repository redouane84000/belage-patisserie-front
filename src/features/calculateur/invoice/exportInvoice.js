const PRINT_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #2c2419;
    background: #fff;
    padding: 16px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .invoice-sheet {
    position: relative;
    background: #fff;
    max-width: 800px;
    margin: 0 auto;
    padding: 28px 32px 32px;
    font-size: 13px;
    line-height: 1.5;
  }
  .invoice-sheet__accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #c4a062, #dfc188, #c4a062);
  }
  .invoice-sheet__head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebe4da;
  }
  .invoice-sheet__brand { display: flex; gap: 14px; align-items: flex-start; }
  .invoice-sheet__logo { width: 64px; height: 64px; object-fit: contain; border-radius: 8px; }
  .invoice-sheet__logo-fallback {
    width: 64px; height: 64px;
    background: #faf7f2; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 600; color: #9a7b42;
  }
  .invoice-sheet__company { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
  .invoice-sheet__meta { font-size: 12px; color: #6b5d4f; }
  .invoice-sheet__title-block { text-align: right; font-size: 12px; color: #6b5d4f; }
  .invoice-sheet__doc-title { font-size: 28px; font-weight: 700; color: #2c2419; margin-bottom: 6px; }
  .invoice-sheet__ref { line-height: 1.6; }
  .invoice-sheet__client {
    margin-bottom: 20px; padding: 12px 14px;
    background: #faf7f2; border-radius: 8px; border-left: 3px solid #c4a062;
  }
  .invoice-sheet__client-label {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: #9a8b7a; margin-bottom: 4px;
  }
  .invoice-sheet__client-name { font-weight: 600; font-size: 15px; }
  .invoice-sheet__client-addr { font-size: 12px; color: #6b5d4f; margin-top: 4px; }
  .invoice-sheet__table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
  .invoice-sheet__table th {
    text-align: left; padding: 8px; border-bottom: 2px solid #e8e2da;
    font-size: 9px; text-transform: uppercase; color: #9a8b7a; background: #fdfbf8;
  }
  .invoice-sheet__table th:nth-child(n+2), .invoice-sheet__table td:nth-child(n+2) { text-align: right; }
  .invoice-sheet__table td { padding: 9px 8px; border-bottom: 1px solid #f0ebe4; }
  .invoice-sheet__totals {
    margin-left: auto; width: 260px;
    padding: 12px 14px; background: #fdfbf8;
    border-radius: 8px; border: 1px solid #ebe4da;
  }
  .invoice-sheet__total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
  .invoice-sheet__total-row--grand {
    border-top: 2px solid #2c2419; margin-top: 6px; padding-top: 8px;
    font-weight: 700; font-size: 15px;
  }
  .invoice-sheet__notes {
    margin-top: 18px; padding-top: 12px; border-top: 1px solid #e8e2da;
    font-size: 11px; color: #6b5d4f; white-space: pre-wrap;
  }
  @media print {
    body { padding: 0; }
    .invoice-sheet { max-width: none; padding: 0; }
  }
`

function safeFilename(base) {
  const cleaned = String(base || 'facture')
    .replace(/[^\w\s-àâäéèêëïîôùûüç]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
  return cleaned || 'facture'
}

/** Télécharge la facture en fichier PDF */
export async function downloadInvoicePdf(element, filenameBase = 'facture') {
  if (!element) throw new Error('Aperçu facture introuvable')

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 15000,
  })

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 10
  const contentW = pageW - margin * 2
  const contentH = (canvas.height * contentW) / canvas.width
  const pageContentH = pageH - margin * 2

  let y = margin
  let remaining = contentH
  let srcY = 0

  while (remaining > 0) {
    const sliceH = Math.min(remaining, pageContentH)
    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = (sliceH / contentH) * canvas.height
    const ctx = sliceCanvas.getContext('2d')
    ctx.drawImage(
      canvas,
      0,
      (srcY / contentH) * canvas.height,
      canvas.width,
      sliceCanvas.height,
      0,
      0,
      canvas.width,
      sliceCanvas.height,
    )
    const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.92)
    const sliceHmm = (sliceCanvas.height * contentW) / canvas.width
    pdf.addImage(sliceData, 'JPEG', margin, y, contentW, sliceHmm)
    remaining -= sliceH
    srcY += sliceH
    if (remaining > 0) {
      pdf.addPage()
      y = margin
    }
  }

  pdf.save(`${safeFilename(filenameBase)}.pdf`)
}

/** Ouvre la boîte de dialogue d'impression (facture seule) */
export function printInvoice(element) {
  if (!element) throw new Error('Aperçu facture introuvable')

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  Object.assign(iframe.style, {
    position: 'fixed',
    width: '0',
    height: '0',
    border: 'none',
    opacity: '0',
    pointerEvents: 'none',
  })
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) {
    document.body.removeChild(iframe)
    throw new Error("Impossible d'ouvrir l'impression")
  }

  doc.open()
  doc.write(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Facture</title><style>${PRINT_CSS}</style></head><body>${element.outerHTML}</body></html>`,
  )
  doc.close()

  const runPrint = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) document.body.removeChild(iframe)
      }, 1500)
    }
  }

  if (iframe.contentWindow?.document.readyState === 'complete') {
    setTimeout(runPrint, 300)
  } else {
    iframe.onload = () => setTimeout(runPrint, 300)
  }
}
