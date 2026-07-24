import PDFDocument from 'pdfkit';
import {
  MARGIN, CONTENT, CONTENT_BOTTOM,
  fmt, fmtDate, fetchLogoBuffer,
  hRule, ensureSpace,
} from '../../shared/services/pdfKit.js';

const INK       = '#1a1a1a';
const INK_SOFT  = '#595959';
const INK_FAINT = '#8c8c8c';
const LINE      = '#1a1a1a';
const LINE_SOFT = '#d0d0d0';

const SANS    = 'Helvetica';
const SANS_B  = 'Helvetica-Bold';

const TITLE_SIZE  = 14;
const COL_GUTTER  = 18;
const SECTION_GAP = 22;
const SIGNATURE_BLOCK_H = 75;

const ITEM_COLS = [
  { key: 'commodity',   label: 'COMMODITY',   width: 75,  align: 'left'   },
  { key: 'hsnCode',     label: 'HSN CODE',    width: 48,  align: 'center' },
  { key: 'description', label: 'DESCRIPTION', width: 120, align: 'left'   },
  { key: 'quantity',    label: 'QTY',         width: 40,  align: 'right'  },
  { key: 'unit',        label: 'UNIT',        width: 38,  align: 'center' },
  { key: 'unitPrice',   label: 'UNIT PRICE',  width: 60,  align: 'right'  },
  { key: 'amount',      label: 'AMOUNT',      width: CONTENT - (75 + 48 + 120 + 40 + 38 + 60), align: 'right' },
];

function getItemCells(item) {
  return [
    item.commodity    || '—',
    item.hsnCode      || '—',
    item.description  || '—',
    fmt(item.quantity),
    item.unit         || '—',
    fmt(item.unitPrice),
    fmt(item.amount),
  ];
}

function vRule(doc, x, y1, y2, color = LINE_SOFT) {
  doc.save().strokeColor(color).lineWidth(0.5)
    .moveTo(x, y1).lineTo(x, y2).stroke().restore();
}

function ensureSectionSpace(doc, height) {
  if (doc.y + height > CONTENT_BOTTOM) doc.addPage();
}

function drawLetterhead(doc, { organization, logoBuf }) {
  const orgName  = organization?.organizationName || 'Organization';
  const orgLines = [
    organization?.contact?.address,
    organization?.kyc?.gst?.number ? `GSTIN: ${organization.kyc.gst.number}` : null,
    organization?.contact?.phone   ? `Ph: ${organization.contact.phone}`   : null,
    organization?.organizationEmail,
  ].filter(Boolean).join('   |   ');

  const HALF_W  = CONTENT / 2;
  const COL_GAP = 20;
  const LOGO_PAD = 10;

  const leftX  = MARGIN;
  const leftW  = HALF_W - COL_GAP / 2;
  const textX  = MARGIN + HALF_W + COL_GAP / 2;
  const textW  = HALF_W - COL_GAP / 2;

  const LOGO_MAX_W = leftW - LOGO_PAD * 2;
  const LOGO_MAX_H = 100;

  let logoW = 0, logoH = 0;
  if (logoBuf) {
    try {
      const img = doc.openImage(logoBuf);
      if (img?.width && img?.height) {
        const swapped  = img.orientation > 4;
        const naturalW = swapped ? img.height : img.width;
        const naturalH = swapped ? img.width  : img.height;
        const scale = Math.min(LOGO_MAX_W / naturalW, LOGO_MAX_H / naturalH, 1);
        logoW = naturalW * scale;
        logoH = naturalH * scale;
      }
    } catch (_) { logoW = 0; logoH = 0; }
  }

  doc.fontSize(13).font(SANS_B);
  const nameH = doc.heightOfString(orgName, { width: textW });

  doc.fontSize(7.5).font(SANS);
  const linesH = orgLines ? doc.heightOfString(orgLines, { width: textW, lineGap: 1 }) : 0;

  const textBlockH = nameH + (linesH ? linesH + 4 : 0);
  const blockH     = Math.max(textBlockH, logoH);

  const y = doc.y;

  if (logoBuf && logoW) {
    const logoX = leftX + (leftW - logoW) / 2;
    const logoY = y + (blockH - logoH) / 2;
    try { doc.image(logoBuf, logoX, logoY, { fit: [logoW, logoH] }); } catch (_) {}
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

function drawTitleBlock(doc, { title, invoiceNumber, date }) {
  const t = (title || 'COMMERCIAL INVOICE').toUpperCase();
  const titleOpts = { width: CONTENT, align: 'center', characterSpacing: 1.4 };

  doc.fontSize(TITLE_SIZE + 4).font(SANS_B);
  const titleH = doc.heightOfString(t, titleOpts);

  const y = doc.y;
  doc.fillColor(INK).text(t, MARGIN, y, titleOpts);
  doc.y = y + titleH + 6;

  const meta = [
    invoiceNumber ? `INVOICE NO. ${invoiceNumber}` : null,
    date          ? `DATE: ${date}`                : null,
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

function fmtVal(v) {
  return (v === undefined || v === null || v === '') ? '—' : v;
}

function sectionHeading(doc, title, contentH = 0) {
  const opts = { width: CONTENT, characterSpacing: 0.6 };

  doc.fontSize(9).font(SANS_B);
  const textH = doc.heightOfString(title.toUpperCase(), opts);

  ensureSectionSpace(doc, textH + 8 + contentH);
  const y = doc.y;

  doc.fillColor(INK).text(title.toUpperCase(), MARGIN, y, opts);

  doc.y = y + textH + 8;
}

function fieldRowHeight(doc, row, w) {
  doc.fontSize(8.5).font(SANS);
  const cellHeights = row.map((c) =>
    doc.heightOfString(fmtVal(c.v), { width: w, lineGap: 1 })
  );
  return Math.max(...cellHeights, 9) + 12;
}

function chunkRows(fields, size = 5) {
  const rows = [];
  for (let i = 0; i < fields.length; i += size) rows.push(fields.slice(i, i + size));
  return rows;
}

function measureFieldRows(doc, rows, cols = 5) {
  const w = (CONTENT - COL_GUTTER * (cols - 1)) / cols;
  let h = 0;
  rows.forEach((row, ri) => {
    h += fieldRowHeight(doc, row, w);
    if (ri < rows.length - 1) h += 5;
  });
  return h;
}

function fieldGrid(doc, rows, cols = 5) {
  const w = (CONTENT - COL_GUTTER * (cols - 1)) / cols;
  let y = doc.y;

  rows.forEach((row, ri) => {
    const rowH = fieldRowHeight(doc, row, w);

    row.forEach((c, ci) => {
      const x = MARGIN + ci * (w + COL_GUTTER);
      doc.fontSize(6.5).font(SANS).fillColor(INK_FAINT)
        .text(String(c.l).toUpperCase(), x, y, { width: w, lineBreak: false, characterSpacing: 0.3 });
      doc.fontSize(8.5).font(SANS).fillColor(INK)
        .text(fmtVal(c.v), x, y + 10, { width: w, lineGap: 1 });
    });

    y += rowH + (ri < rows.length - 1 ? 5 : 0);
  });

  doc.y = y + 8;
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

function measureAddressBlock(doc, value) {
  const text = (value || '').toString().trim();
  if (!text) return 0;
  doc.fontSize(8.5).font(SANS);
  const textH = doc.heightOfString(text, { width: CONTENT, lineGap: 1 });
  return 10 + textH + 8;
}

function addressBlock(doc, value) {
  const text = (value || '').toString().trim();
  if (!text) return;

  const innerW = CONTENT;
  doc.fontSize(8.5).font(SANS);
  const textH = doc.heightOfString(text, { width: innerW, lineGap: 1 });

  const y = doc.y;
  doc.fontSize(6.5).font(SANS_B).fillColor(INK_SOFT)
    .text('ADDRESS', MARGIN, y, { width: CONTENT, characterSpacing: 0.5, lineBreak: false });

  const textY = y + 10;

  doc.fontSize(8.5).font(SANS).fillColor(INK)
    .text(text, MARGIN, textY, { width: innerW, lineGap: 1 });

  doc.y = textY + textH + 8;
}

function measureTextBlock(doc, text) {
  const t = (text || '').toString().trim();
  if (!t) return 0;
  doc.fontSize(8.5).font(SANS);
  const textH = doc.heightOfString(t, { width: CONTENT, align: 'justify', lineGap: 2 });
  return textH;
}

function textBlock(doc, text) {
  const t = (text || '').toString().trim();
  if (!t) return;

  const innerW = CONTENT;
  doc.fontSize(8.5).font(SANS);
  const textH = doc.heightOfString(t, { width: innerW, align: 'justify', lineGap: 2 });

  const y = doc.y;
  doc.fontSize(8.5).font(SANS).fillColor(INK)
    .text(t, MARGIN, y, { width: innerW, align: 'justify', lineGap: 2 });

  doc.y = y + textH + 12;
}

function goodsTable(doc, items) {
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

  items.forEach((item) => {
    const cells = getItemCells(item);
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
  const valueText = `${r.currency} ${fmt(r.v)}`;
  doc.fontSize(r.highlight ? 9.5 : 8.5).font(r.highlight ? SANS_B : SANS);
  return Math.max(
    doc.heightOfString(r.l, { width: SUMMARY_LABEL_W - SUMMARY_PAD_X }),
    doc.heightOfString(valueText, { width: SUMMARY_TOTAL_W - SUMMARY_LABEL_W - SUMMARY_PAD_X }),
    9
  ) + SUMMARY_PAD_Y * 2;
}

function measureFinancialSummary(doc, rows, currency) {
  return rows.reduce((s, r) => s + summaryRowHeight(doc, { ...r, currency }), 0);
}

function financialSummary(doc, rows, currency) {
  const totalX = MARGIN + CONTENT - SUMMARY_TOTAL_W;
  const valueW = SUMMARY_TOTAL_W - SUMMARY_LABEL_W;

  const computed = rows.map((r) => ({ ...r, h: summaryRowHeight(doc, { ...r, currency }), valueText: `${currency} ${fmt(r.v)}` }));

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

export async function buildCommercialInvoicePdf(ci, organization, logoUrl) {
  const logoBuf = await fetchLogoBuffer(logoUrl);

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

    const ii        = ci.invoiceInfo     || {};
    const exp       = ci.exporterDetails || {};
    const buyer     = ci.buyerDetails    || {};
    const notify    = ci.notifyParty     || {};
    const consignee = ci.consignee       || {};
    const ship      = ci.shippingDetails || {};
    const fin       = ci.financial       || {};
    const bank      = ci.bankDetails     || {};
    const sig       = ci.signatory       || {};
    const items     = ci.goodsItems      || [];
    const currency  = fin.currency || 'USD';

    drawLetterhead(doc, { organization, logoBuf });
    drawTitleBlock(doc, {
      title:         'COMMERCIAL INVOICE',
      invoiceNumber: ci.commercialInvoiceNumber,
      date:          fmtDate(ii.date),
    });

    const infoRows = chunkRows([
      { l: 'Invoice Number',  v: ci.commercialInvoiceNumber },
      { l: 'Invoice Date',    v: fmtDate(ii.date) },
      { l: 'Currency',        v: currency },
      { l: 'Contract Number', v: ci.contractNumber },
    ]);
    sectionHeading(doc, 'Commercial Invoice Information', measureFieldRows(doc, infoRows));
    fieldGrid(doc, infoRows);

    const exporterRows = chunkRows([
      { l: 'Company Name', v: exp.companyName },
      { l: 'Country',      v: exp.country },
      { l: 'Tax Number',   v: exp.taxNumber },
      { l: 'Email',        v: exp.email },
      { l: 'Phone',        v: exp.phone },
    ]);
    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Exporter Details', measureFieldRows(doc, exporterRows) + measureAddressBlock(doc, exp.address));
    fieldGrid(doc, exporterRows);
    addressBlock(doc, exp.address);

    const buyerRows = chunkRows([
      { l: 'Company Name',   v: buyer.companyName },
      { l: 'Contact Person', v: buyer.contactPerson },
      { l: 'Country',        v: buyer.country },
      { l: 'Email',          v: buyer.email },
      { l: 'Phone',          v: buyer.phone },
      { l: 'Tax Number',     v: buyer.taxNumber },
    ]);
    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Buyer Details', measureFieldRows(doc, buyerRows) + measureAddressBlock(doc, buyer.address));
    fieldGrid(doc, buyerRows);
    addressBlock(doc, buyer.address);

    const notifyRows = chunkRows([
      { l: 'Name',    v: notify.name },
      { l: 'Country', v: notify.country },
      { l: 'Phone',   v: notify.phone },
      { l: 'Email',   v: notify.email },
    ]);
    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Notify Party', measureFieldRows(doc, notifyRows) + measureAddressBlock(doc, notify.address));
    fieldGrid(doc, notifyRows);
    addressBlock(doc, notify.address);

    const consigneeRows = chunkRows([
      { l: 'Name',    v: consignee.name },
      { l: 'Country', v: consignee.country },
      { l: 'Phone',   v: consignee.phone },
      { l: 'Email',   v: consignee.email },
    ]);
    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Consignee', measureFieldRows(doc, consigneeRows) + measureAddressBlock(doc, consignee.address));
    fieldGrid(doc, consigneeRows);
    addressBlock(doc, consignee.address);

    const shippingRows = chunkRows([
      { l: 'Vessel',            v: ship.vessel },
      { l: 'BL Number',         v: ship.blNumber },
      { l: 'Port of Loading',   v: ship.portOfLoading },
      { l: 'Port of Discharge', v: ship.portOfDischarge },
      { l: 'Final Destination', v: ship.finalDestination },
    ]);
    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Shipping Details', measureFieldRows(doc, shippingRows));
    fieldGrid(doc, shippingRows);

    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Goods Details', 40);
    goodsTable(doc, items);

    const summaryRows = [
      { l: 'Sub Total', v: fin.subTotal },
      { l: 'CGST',      v: fin.cgst },
      { l: 'SGST',      v: fin.sgst },
      { l: 'IGST',      v: fin.igst },
      { l: 'Freight',   v: fin.freight },
      { l: 'Insurance', v: fin.insurance },
      { l: 'Total',     v: fin.total, highlight: true },
    ];
    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Financial Information', measureFinancialSummary(doc, summaryRows, currency));
    financialSummary(doc, summaryRows, currency);

    const bankFields = [
      { l: 'Bank Name',      v: bank.bankName },
      { l: 'Account Number', v: bank.accountNumber },
      { l: 'IFSC',           v: bank.ifsc },
      { l: 'SWIFT',          v: bank.swift },
    ];
    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Bank Details', measureKeyValueList(doc, bankFields));
    keyValueList(doc, bankFields);

    if ((ci.declaration || '').toString().trim()) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, 'Declaration', measureTextBlock(doc, ci.declaration));
      textBlock(doc, ci.declaration);
    }

    if ((ci.termsAndConditions || '').toString().trim()) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, 'Terms & Conditions', measureTextBlock(doc, ci.termsAndConditions));
      textBlock(doc, ci.termsAndConditions);
    }

    doc.y += SECTION_GAP;
    sectionHeading(doc, 'Signature', SIGNATURE_BLOCK_H);
    signatureBlock(doc, sig.name, sig.designation);

    drawFooter(doc);
    doc.flushPages();
    doc.end();
  });
}
