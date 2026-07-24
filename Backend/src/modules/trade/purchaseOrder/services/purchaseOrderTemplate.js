import PDFDocument from 'pdfkit';
import {
  MARGIN, CONTENT, CONTENT_BOTTOM,
  fmt, fmtDate, fetchLogoBuffer,
  hRule, ensureSpace,
} from '../../shared/services/pdfKit.js';
import { prepareLogoForPdf } from '../../contracts/services/logoProcessor.js';

const INK       = '#1a1a1a';
const INK_SOFT  = '#595959';
const INK_FAINT = '#8c8c8c';
const LINE      = '#1a1a1a';
const LINE_SOFT = '#d0d0d0';

const SANS   = 'Helvetica';
const SANS_B = 'Helvetica-Bold';

const COL_GUTTER = 18;
const SECTION_GAP = 14;
const SIGNATURE_BLOCK_H = 75;

function currencySymbol(currency) {
  return currency === 'USD' ? '$' : '₹';
}

function pdfSafeSymbol(symbol) {
  return symbol === '₹' ? 'Rs.' : symbol;
}

const PACKAGE_UNITS = ['BOX', 'BAG', 'ROLL', 'SET', 'PAIR'];

function getEffectiveQty(qty, unit, unitsPerPackage) {
  const q = parseFloat(qty) || 0;
  const upp = parseFloat(unitsPerPackage);
  if (PACKAGE_UNITS.includes(unit) && upp > 0) return q * upp;
  return q;
}

const ITEM_COLS = [
  { key: '#',           label: '#',          width: 20,  align: 'center' },
  { key: 'productName', label: 'PRODUCT',    width: 82,  align: 'left'   },
  { key: 'description', label: 'DESCRIPTION',width: 82,  align: 'left'   },
  { key: 'hsCode',      label: 'HS CODE',    width: 40,  align: 'center' },
  { key: 'quantity',    label: 'QTY',        width: 40,  align: 'right'  },
  { key: 'unit',        label: 'UNIT',       width: 34,  align: 'center' },
  { key: 'unitPrice',   label: 'UNIT PRICE', width: 55,  align: 'right'  },
  { key: 'taxPercent',  label: 'TAX %',      width: 32,  align: 'right'  },
  { key: 'taxAmount',   label: 'TAX AMT',    width: 58,  align: 'right'  },
  { key: 'total',       label: 'TOTAL',      width: CONTENT - (20 + 82 + 82 + 40 + 40 + 34 + 55 + 32 + 58), align: 'right' },
];

function getItemCells(item, idx) {
  const effQty    = getEffectiveQty(item.quantity, item.unit, item.unitsPerPackage);
  const base      = effQty * (parseFloat(item.unitPrice) || 0);
  const taxAmount = item.taxAmount ?? (base * ((parseFloat(item.taxPercent) || 0) / 100));
  const lineTotal = item.total ?? (base + taxAmount);
  let qtyLabel;
  if (PACKAGE_UNITS.includes(item.unit) && parseFloat(item.unitsPerPackage) > 0) {
    qtyLabel = `${fmt(item.quantity)} ${item.unit}\n(${effQty} PCS)`;
  } else {
    qtyLabel = fmt(item.quantity);
  }
  return [
    String(idx + 1),
    item.productName  || '—',
    item.description  || '—',
    item.hsCode       || '—',
    qtyLabel,
    item.unit         || '—',
    fmt(item.unitPrice),
    `${fmt(item.taxPercent)}%`,
    fmt(taxAmount),
    fmt(lineTotal),
  ];
}

function decodeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&#x2F;/g, '/')
    .replace(/&#x2f;/g, '/')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function fmtVal(v) {
  return (v === undefined || v === null || v === '') ? '—' : v;
}

const KV_LABEL_W = 160;

function measureKeyValueList(doc, fields) {
  const valueW = CONTENT - KV_LABEL_W;
  let h = 0;
  fields.forEach((f) => {
    doc.fontSize(8.5).font(SANS);
    const vH = doc.heightOfString(fmtVal(f.v), { width: valueW, lineGap: 1 });
    h += Math.max(vH, 11) + 8;
  });
  return h;
}

function keyValueList(doc, fields) {
  const valueW = CONTENT - KV_LABEL_W;
  let y = doc.y;

  fields.forEach((f) => {
    doc.fontSize(8.5).font(SANS);
    const vH = doc.heightOfString(fmtVal(f.v), { width: valueW, lineGap: 1 });
    const rowH = Math.max(vH, 11) + 8;

    doc.fontSize(8).font(SANS_B).fillColor(INK_SOFT)
      .text(String(f.l), MARGIN, y, { width: KV_LABEL_W, lineBreak: false });
    doc.fontSize(8.5).font(SANS).fillColor(INK)
      .text(fmtVal(f.v), MARGIN + KV_LABEL_W, y, { width: valueW, lineGap: 1 });

    y += rowH;
  });

  doc.y = y + 8;
}

function vRule(doc, x, y1, y2, color = LINE_SOFT) {
  doc.save().strokeColor(color).lineWidth(0.5)
    .moveTo(x, y1).lineTo(x, y2).stroke().restore();
}

function ensureSectionSpace(doc, height) {
  if (doc.y + height > CONTENT_BOTTOM) doc.addPage();
}

function drawLetterhead(doc, { organization, logoBuf }) {
  const orgName  = decodeHtml(organization?.organizationName || 'Organization');
  const rawAddr  = decodeHtml(organization?.contact?.address || '');
  const gstDisplay = organization?.gstNumber || organization?.kyc?.gst?.number;
  const gstNum   = decodeHtml(gstDisplay ? `GST: ${gstDisplay}` : '');
  const regionLine = [organization?.regionalInformation?.country, organization?.contact?.pinCode].filter(Boolean).join(', ');
  const phoneNum = decodeHtml(organization?.contact?.phone ? `Ph: ${organization.contact.phone}` : '');
  const emailAddr= decodeHtml(organization?.organizationEmail || '');

  const orgLines = [rawAddr, decodeHtml(regionLine), gstNum, phoneNum, emailAddr].filter(Boolean).join('   |   ');

  const HALF_W  = CONTENT / 2;
  const COL_GAP = 20;

  const leftX  = MARGIN;
  const leftW  = HALF_W - COL_GAP / 2;
  const textX  = MARGIN + HALF_W + COL_GAP / 2;
  const textW  = HALF_W - COL_GAP / 2;

  const LOGO_MAX_W = leftW;
  const LOGO_MAX_H = 60;

  let logoW = 0, logoH = 0;
  if (logoBuf) {
    try {
      const img = doc.openImage(logoBuf);
      if (img?.width && img?.height) {
        const scale = Math.min(LOGO_MAX_W / img.width, LOGO_MAX_H / img.height, 1);
        logoW = img.width  * scale;
        logoH = img.height * scale;
      }
    } catch (_) { logoW = 0; logoH = 0; }
  }

  doc.fontSize(13).font(SANS_B);
  const nameH = doc.heightOfString(orgName, { width: textW });

  doc.fontSize(7.5).font(SANS);
  const linesH = orgLines ? doc.heightOfString(orgLines, { width: textW, lineGap: 1 }) : 0;

  const textBlockH = nameH + (linesH ? linesH + 4 : 0);
  const blockH     = Math.max(textBlockH, logoH, 40);

  const y = doc.y;

  if (logoBuf) {
    try {
      doc.image(logoBuf, leftX, y, {
        fit: [leftW, blockH],
        align: 'left',
        valign: 'center',
      });
    } catch (_) {}
  }

  doc.fontSize(13).font(SANS_B).fillColor(INK)
    .text(orgName, textX, y, { width: textW });
  if (orgLines) {
    doc.fontSize(7.5).font(SANS).fillColor(INK_SOFT)
      .text(orgLines, textX, y + nameH + 4, { width: textW, lineGap: 1 });
  }

  doc.y = y + blockH + 14;
  hRule(doc, doc.y, LINE_SOFT);
  doc.y += 16;
}

function drawTitleBlock(doc, { title, docNumber, date }) {
  const t = (title || 'PURCHASE ORDER').toUpperCase();
  const titleOpts = { width: CONTENT, align: 'center', characterSpacing: 1.4 };

  doc.fontSize(18).font(SANS_B);
  const titleH = doc.heightOfString(t, titleOpts);

  const y = doc.y;
  doc.fillColor(INK).text(t, MARGIN, y, titleOpts);
  doc.y = y + titleH + 6;

  const meta = [
    docNumber ? `PO NO. ${docNumber}` : null,
    date      ? `DATE: ${date}`       : null,
  ].filter(Boolean).join('          ');

  if (meta) {
    doc.fontSize(8).font(SANS).fillColor(INK_SOFT)
      .text(meta, MARGIN, doc.y, { width: CONTENT, align: 'center', characterSpacing: 0.5 });
    doc.y += 14;
  }

  doc.y += 6;
  doc.save().strokeColor(LINE).lineWidth(1.25)
    .moveTo(MARGIN, doc.y).lineTo(MARGIN + CONTENT, doc.y).stroke().restore();
  hRule(doc, doc.y + 2.5, LINE_SOFT);
  doc.y += 18;
}

function sectionHeading(doc, number, title, contentH = 0) {
  const label = `${number}.  ${title.toUpperCase()}`;
  const opts  = { width: CONTENT, characterSpacing: 0.6 };

  doc.fontSize(9).font(SANS_B);
  const textH = doc.heightOfString(label, opts);

  ensureSectionSpace(doc, textH + 8 + contentH);
  const y = doc.y;

  doc.fillColor(INK).text(label, MARGIN, y, opts);

  doc.y = y + textH + 8;
}

function chunkRows(fields, size = 5) {
  const rows = [];
  for (let i = 0; i < fields.length; i += size) rows.push(fields.slice(i, i + size));
  return rows;
}

function fieldRowHeight(doc, row, w) {
  doc.fontSize(8.5).font(SANS);
  const cellHeights = row.map((c) =>
    doc.heightOfString(String(c.v ?? '—'), { width: w, lineGap: 1 })
  );
  return Math.max(...cellHeights, 9) + 15;
}

function measureFieldRows(doc, rows) {
  let h = 0;
  rows.forEach((row, ri) => {
    const w = (CONTENT - COL_GUTTER * (row.length - 1)) / row.length;
    h += fieldRowHeight(doc, row, w);
    if (ri < rows.length - 1) h += 8;
  });
  return h;
}

function fieldGrid(doc, rows) {
  let y = doc.y;

  rows.forEach((row, ri) => {
    const w = (CONTENT - COL_GUTTER * (row.length - 1)) / row.length;
    const rowH = fieldRowHeight(doc, row, w);

    row.forEach((c, ci) => {
      const x = MARGIN + ci * (w + COL_GUTTER);
      doc.fontSize(6.5).font(SANS).fillColor(INK_FAINT)
        .text(String(c.l).toUpperCase(), x, y, { width: w, lineBreak: false, characterSpacing: 0.3 });
      doc.fontSize(8.5).font(SANS).fillColor(INK)
        .text(String(c.v ?? '—'), x, y + 11, { width: w, lineGap: 1 });
    });

    y += rowH + (ri < rows.length - 1 ? 8 : 0);
  });

  doc.y = y + 12;
}

function itemsTable(doc, items) {
  const PAD_X = 6;
  const PAD_Y = 6;
  const xs = [];
  let acc = MARGIN;
  ITEM_COLS.forEach((c) => { xs.push(acc); acc += c.width; });
  xs.push(acc);

  function drawGridLines(y1, y2) {
    xs.forEach((x) => vRule(doc, x, y1, y2, LINE));
  }

  function drawHeader() {
    doc.fontSize(7.5).font(SANS_B);
    let headerH = 0;
    ITEM_COLS.forEach((c) => {
      const h = doc.heightOfString(c.label, { width: c.width - PAD_X * 2, align: c.align, lineGap: 1 });
      if (h > headerH) headerH = h;
    });
    headerH += PAD_Y * 2;

    ensureSpace(doc, headerH + 24);
    const y = doc.y;

    hRule(doc, y, LINE, MARGIN, MARGIN + CONTENT);
    let x = MARGIN;
    ITEM_COLS.forEach((c) => {
      doc.fontSize(7.5).font(SANS_B).fillColor(INK)
        .text(c.label, x + PAD_X, y + PAD_Y, { width: c.width - PAD_X * 2, align: c.align, lineGap: 1, characterSpacing: 0.3 });
      x += c.width;
    });
    drawGridLines(y, y + headerH);
    hRule(doc, y + headerH, LINE, MARGIN, MARGIN + CONTENT);

    doc.y = y + headerH;
  }

  ensureSectionSpace(doc, 60);
  drawHeader();

  items.forEach((item, idx) => {
    const cells = getItemCells(item, idx);
    doc.fontSize(8).font(SANS);
    let rowH = 0;
    cells.forEach((cell, ci) => {
      const h = doc.heightOfString(String(cell), { width: ITEM_COLS[ci].width - PAD_X * 2, lineGap: 1 });
      if (h > rowH) rowH = h;
    });
    rowH = Math.max(rowH, 9) + PAD_Y * 2;

    if (doc.y + rowH > CONTENT_BOTTOM) {
      doc.addPage();
      drawHeader();
    }

    const y = doc.y;
    let x = MARGIN;
    cells.forEach((cell, ci) => {
      doc.fontSize(8).font(SANS).fillColor(INK)
        .text(String(cell), x + PAD_X, y + PAD_Y, { width: ITEM_COLS[ci].width - PAD_X * 2, align: ITEM_COLS[ci].align, lineGap: 1 });
      x += ITEM_COLS[ci].width;
    });

    drawGridLines(y, y + rowH);
    doc.y = y + rowH;
    hRule(doc, doc.y, LINE_SOFT, MARGIN, MARGIN + CONTENT);
  });

  doc.y += 12;
}

const SUMMARY_TOTAL_W = 260;
const SUMMARY_LABEL_W = 140;
const SUMMARY_PAD_X   = 8;
const SUMMARY_PAD_Y   = 5;

function summaryRowHeight(doc, r) {
  const valueText = `${r.currSym} ${fmt(r.v)}`;
  doc.fontSize(r.highlight ? 9.5 : 8.5).font(r.highlight ? SANS_B : SANS);
  return Math.max(
    doc.heightOfString(r.l, { width: SUMMARY_LABEL_W - SUMMARY_PAD_X }),
    doc.heightOfString(valueText, { width: SUMMARY_TOTAL_W - SUMMARY_LABEL_W - SUMMARY_PAD_X }),
    9
  ) + SUMMARY_PAD_Y * 2;
}

function measureFinancialSummary(doc, rows, currSym) {
  return rows.reduce((s, r) => s + summaryRowHeight(doc, { ...r, currSym }), 0);
}

function financialSummary(doc, rows, currSym) {
  const totalX = MARGIN + CONTENT - SUMMARY_TOTAL_W;
  const valueW = SUMMARY_TOTAL_W - SUMMARY_LABEL_W;

  const computed = rows.map((r) => ({ ...r, h: summaryRowHeight(doc, { ...r, currSym }), valueText: `${currSym} ${fmt(r.v)}` }));

  const top = doc.y;
  let y = top;

  hRule(doc, y, LINE, totalX, totalX + SUMMARY_TOTAL_W);
  computed.forEach((r) => {
    doc.fontSize(r.highlight ? 9.5 : 8.5).font(r.highlight ? SANS_B : SANS).fillColor(r.highlight ? INK : INK_SOFT)
      .text(r.l, totalX + SUMMARY_PAD_X, y + SUMMARY_PAD_Y, { width: SUMMARY_LABEL_W - SUMMARY_PAD_X });
    doc.fontSize(r.highlight ? 9.5 : 8.5).font(r.highlight ? SANS_B : SANS).fillColor(INK)
      .text(r.valueText, totalX + SUMMARY_LABEL_W, y + SUMMARY_PAD_Y, { width: valueW - SUMMARY_PAD_X, align: 'right' });
    y += r.h;
    hRule(doc, y, r.highlight ? LINE : LINE_SOFT, totalX, totalX + SUMMARY_TOTAL_W);
  });

  vRule(doc, totalX, top, y, LINE);
  vRule(doc, totalX + SUMMARY_LABEL_W, top, y, LINE_SOFT);
  vRule(doc, totalX + SUMMARY_TOTAL_W, top, y, LINE);

  doc.y = y + 14;
}

function measureTextBlock(doc, text) {
  const t = (text || '').toString().trim();
  if (!t) return 0;
  doc.fontSize(8.5).font(SANS);
  return doc.heightOfString(t, { width: CONTENT, align: 'justify', lineGap: 2 });
}

function textBlock(doc, text) {
  const t = (text || '').toString().trim();
  if (!t) return;

  doc.fontSize(8.5).font(SANS);
  const textH = doc.heightOfString(t, { width: CONTENT, align: 'justify', lineGap: 2 });

  const y = doc.y;
  doc.fontSize(8.5).font(SANS).fillColor(INK)
    .text(t, MARGIN, y, { width: CONTENT, align: 'justify', lineGap: 2 });

  doc.y = y + textH + 12;
}

function signatureBlock(doc, name, designation) {
  const y = doc.y;
  const colW = 220;
  const lineY = y + 34;

  hRule(doc, lineY, LINE, MARGIN, MARGIN + colW);

  doc.fontSize(6.5).font(SANS).fillColor(INK_FAINT)
    .text('AUTHORIZED SIGNATORY', MARGIN, lineY + 6, { width: colW, lineBreak: false, characterSpacing: 0.3 });
  doc.fontSize(8.5).font(SANS).fillColor(INK)
    .text(fmtVal(name), MARGIN, lineY + 17, { width: colW, lineGap: 1 });

  doc.fontSize(6.5).font(SANS).fillColor(INK_FAINT)
    .text('DESIGNATION', MARGIN + colW + COL_GUTTER, lineY + 6, { width: colW, lineBreak: false, characterSpacing: 0.3 });
  doc.fontSize(8.5).font(SANS).fillColor(INK)
    .text(fmtVal(designation), MARGIN + colW + COL_GUTTER, lineY + 17, { width: colW, lineGap: 1 });

  doc.y = y + SIGNATURE_BLOCK_H;
}

function drawFooter(doc) {
  const range = doc.bufferedPageRange();
  const total = range.count;
  const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  for (let i = range.start; i < range.start + total; i++) {
    doc.switchToPage(i);

    hRule(doc, CONTENT_BOTTOM + 3, LINE_SOFT);

    doc.fontSize(7).font(SANS).fillColor(INK_FAINT)
      .text('Generated by Blinkus.AI', MARGIN, CONTENT_BOTTOM + 8, { width: CONTENT / 3, lineBreak: false });

    doc.fontSize(7).font(SANS).fillColor(INK_FAINT)
      .text(`Generated on ${timestamp}`, MARGIN, CONTENT_BOTTOM + 8, { width: CONTENT, align: 'center', lineBreak: false });

    doc.fontSize(7).font(SANS).fillColor(INK_FAINT)
      .text(`Page ${i - range.start + 1} of ${total}`, MARGIN, CONTENT_BOTTOM + 8, { width: CONTENT, align: 'right', lineBreak: false });
  }
}

export async function buildPurchaseOrderPdf(po, organization, logoUrl) {
  const logoBuf = await prepareLogoForPdf(await fetchLogoBuffer(logoUrl));

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
    });
    const chunks = [];
    doc.on('data',  (c) => chunks.push(c));
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const od    = po.orderDetails  || {};
    const bd    = po.buyerDetails  || {};
    const st    = po.shipToDetails || {};
    const bank  = po.bankDetails   || {};
    const notes = po.notes         || {};
    const items   = po.items    || [];
    const summary = po.summary  || {};
    const currency = od.currency || 'INR';
    const currSym  = pdfSafeSymbol(currencySymbol(currency));

    drawLetterhead(doc, { organization, logoBuf });
    drawTitleBlock(doc, {
      title:     'PURCHASE ORDER',
      docNumber: po.purchaseOrderNumber,
      date:      fmtDate(od.poDate),
    });

    let n = 0;
    const nextNum = () => ++n;

    const infoFields = [
      { l: 'PO Number', v: po.purchaseOrderNumber },
      { l: 'PO Date',   v: fmtDate(od.poDate) },
    ];
    if (od.expectedDelivery) infoFields.push({ l: 'Expected Delivery', v: fmtDate(od.expectedDelivery) });
    const infoRows = chunkRows(infoFields);
    sectionHeading(doc, nextNum(), 'Purchase Order Information', measureFieldRows(doc, infoRows));
    fieldGrid(doc, infoRows);

    const buyerFields = [
      { l: 'Company',     v: bd.buyerCompany },
      { l: 'Contact',     v: bd.buyerName    },
      { l: 'Address',     v: [bd.buyerAddress, bd.buyerCity, bd.buyerState, bd.buyerCountry].filter(Boolean).join(', ') },
      { l: 'Postal Code', v: bd.buyerPostalCode },
      { l: 'GST',         v: bd.buyerGstNumber  },
      { l: 'Email',       v: bd.buyerEmail      },
      { l: 'Phone',       v: bd.buyerPhone      },
    ].filter((f) => f.v);
    const buyerRows = chunkRows(buyerFields);
    doc.y += SECTION_GAP;
    sectionHeading(doc, nextNum(), 'Buyer Details', measureFieldRows(doc, buyerRows));
    fieldGrid(doc, buyerRows);

    const shipFields = [
      { l: 'Company',     v: st.companyName   },
      { l: 'Contact',     v: st.contactPerson },
      { l: 'Address',     v: [st.address, st.city, st.state, st.country].filter(Boolean).join(', ') },
      { l: 'Postal Code', v: st.postalCode    },
      { l: 'Email',       v: st.email         },
      { l: 'Phone',       v: st.phone         },
    ].filter((f) => f.v);
    const shipRows = chunkRows(shipFields);
    doc.y += SECTION_GAP;
    sectionHeading(doc, nextNum(), 'Delivery Information', measureFieldRows(doc, shipRows));
    fieldGrid(doc, shipRows);

    const orderFields = [
      { l: 'Currency',          v: `${currSym} ${currency}` },
      { l: 'Payment Terms',     v: od.paymentTerms          },
      { l: 'Incoterms',         v: od.incoterms              },
      { l: 'Port of Loading',   v: od.portOfLoading         },
      { l: 'Port of Discharge', v: od.portOfDischarge       },
      { l: 'Shipment Mode',     v: od.shipmentMode          },
    ].filter((f) => f.v);
    const orderRows = chunkRows(orderFields);
    doc.y += SECTION_GAP;
    sectionHeading(doc, nextNum(), 'Order Details', measureFieldRows(doc, orderRows));
    fieldGrid(doc, orderRows);

    doc.y += SECTION_GAP;
    sectionHeading(doc, nextNum(), 'Items', 40);
    itemsTable(doc, items);

    const summaryRows = [
      { l: 'Subtotal',    v: summary.subtotal },
      { l: 'CGST',        v: summary.cgst },
      { l: 'SGST',        v: summary.sgst },
      { l: 'IGST',        v: summary.igst },
      { l: 'Grand Total', v: summary.grandTotal, highlight: true },
    ];
    doc.y += SECTION_GAP;
    sectionHeading(doc, nextNum(), 'Financial Information', measureFinancialSummary(doc, summaryRows, currSym));
    financialSummary(doc, summaryRows, currSym);

    const hasBankData = Object.values(bank).some((v) => v && String(v).trim());
    if (hasBankData) {
      const bankFields = [
        { l: 'Bank Name',      v: bank.bankName      },
        { l: 'Account Name',   v: bank.accountName   },
        { l: 'Account Number', v: bank.accountNumber },
        { l: 'IFSC Code',      v: bank.ifsc           },
        { l: 'SWIFT Code',     v: bank.swift          },
        { l: 'Branch',         v: bank.branch         },
      ].filter((f) => f.v);
      doc.y += SECTION_GAP;
      sectionHeading(doc, nextNum(), 'Bank Details', measureKeyValueList(doc, bankFields));
      keyValueList(doc, bankFields);
    }

    if ((notes.termsAndConditions || '').toString().trim()) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, nextNum(), 'Terms & Conditions', measureTextBlock(doc, notes.termsAndConditions));
      textBlock(doc, notes.termsAndConditions);
    }

    if ((notes.additionalNotes || '').toString().trim()) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, nextNum(), 'Additional Notes', measureTextBlock(doc, notes.additionalNotes));
      textBlock(doc, notes.additionalNotes);
    }

    doc.y += SECTION_GAP;
    sectionHeading(doc, nextNum(), 'Authorization', SIGNATURE_BLOCK_H);
    signatureBlock(doc, notes.signatory, notes.signatoryDesignation);

    drawFooter(doc);
    doc.flushPages();
    doc.end();
  });
}
