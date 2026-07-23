import PDFDocument from 'pdfkit';
import {
  MARGIN, CONTENT, CONTENT_BOTTOM,
  fmt, fmtDate, fetchLogoBuffer,
  hRule, ensureSpace,
} from '../../shared/services/pdfKit.js';
import { prepareLogoForPdf } from './logoProcessor.js';

const INK       = '#1a1a1a';
const INK_SOFT  = '#595959';
const INK_FAINT = '#8c8c8c';
const LINE      = '#1a1a1a';
const LINE_SOFT = '#d0d0d0';

const SERIF   = 'Times-Roman';
const SERIF_B = 'Times-Bold';
const SANS    = 'Helvetica';
const SANS_B  = 'Helvetica-Bold';

const COL_GUTTER = 18;
const SIGNATURE_BLOCK_H = 70;
const SECTION_GAP = 14;

function ensureSectionSpace(doc, height) {
  if (doc.y + height > CONTENT_BOTTOM) doc.addPage();
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

function drawLetterhead(doc, { organization, logoBuf }) {
  const orgName  = decodeHtml(organization?.organizationName || 'Organization');
  const rawAddr  = decodeHtml(organization?.contact?.address || '');
  const gstNum   = decodeHtml(organization?.kyc?.gst?.number ? `GSTIN: ${organization.kyc.gst.number}` : '');
  const phoneNum = decodeHtml(organization?.contact?.phone ? `Tel: ${organization.contact.phone}` : '');
  const emailAddr= decodeHtml(organization?.organizationEmail || '');

  const orgLines = [rawAddr, gstNum, phoneNum, emailAddr].filter(Boolean).join('   |   ');

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

function drawTitleBlock(doc, { title, contractNumber, date }) {
  const t = (title || 'TRADE CONTRACT').toUpperCase();
  const titleOpts = { width: CONTENT, align: 'center', characterSpacing: 1.4 };

  doc.fontSize(18).font(SERIF_B);
  const titleH = doc.heightOfString(t, titleOpts);

  const y = doc.y;
  doc.fillColor(INK).text(t, MARGIN, y, titleOpts);
  doc.y = y + titleH + 6;

  const meta = [
    contractNumber ? `CONTRACT NO. ${contractNumber}` : null,
    date           ? `DATE: ${date}`                  : null,
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
      doc.fontSize(8.5).font(SERIF).fillColor(INK)
        .text(String(c.v ?? '—'), x, y + 11, { width: w, lineGap: 1 });
    });

    y += rowH + (ri < rows.length - 1 ? 8 : 0);
  });

  doc.y = y + 12;
}

function measureCommodityDetailsBlock(doc, comRow, noteText) {
  let h = 0;
  if (comRow.length) {
    const w = (CONTENT - COL_GUTTER * (comRow.length - 1)) / comRow.length;
    h += fieldRowHeight(doc, comRow, w);
  }

  const text = (noteText || '').toString().trim();
  if (text) {
    if (comRow.length) h += 12;
    const innerW = CONTENT - 14;
    doc.fontSize(8.5).font(SERIF);
    const textH = doc.heightOfString(text, { width: innerW, align: 'justify', lineGap: 2 });
    h += 12 + textH + 4;
  }

  return h;
}

function commodityDetailsBlock(doc, comRow, noteLabel, noteText) {
  let y = doc.y;

  if (comRow.length) {
    const w = (CONTENT - COL_GUTTER * (comRow.length - 1)) / comRow.length;
    const rowH = fieldRowHeight(doc, comRow, w);

    comRow.forEach((c, ci) => {
      const x = MARGIN + ci * (w + COL_GUTTER);
      doc.fontSize(6.5).font(SANS).fillColor(INK_FAINT)
        .text(String(c.l).toUpperCase(), x, y, { width: w, lineBreak: false, characterSpacing: 0.3 });
      doc.fontSize(8.5).font(SERIF).fillColor(INK)
        .text(String(c.v ?? '—'), x, y + 11, { width: w, lineGap: 1 });
    });

    y += rowH + 12;
  }

  const text = (noteText || '').toString().trim();
  if (text) {
    const innerW = CONTENT - 14;
    doc.fontSize(8.5).font(SERIF);
    const textH = doc.heightOfString(text, { width: innerW, align: 'justify', lineGap: 2 });

    doc.fontSize(7).font(SANS_B).fillColor(INK_SOFT)
      .text(noteLabel.toUpperCase(), MARGIN, y, { width: CONTENT, characterSpacing: 0.5, lineBreak: false });

    const textY = y + 12;
    doc.save().strokeColor(LINE_SOFT).lineWidth(1.5)
      .moveTo(MARGIN, textY).lineTo(MARGIN, textY + textH + 4).stroke().restore();

    doc.fontSize(8.5).font(SERIF).fillColor(INK)
      .text(text, MARGIN + 14, textY, { width: innerW, align: 'justify', lineGap: 2 });

    y = textY + textH + 4;
  }

  doc.y = y + 12;
}

function measurePartyBoxes(doc, boxes) {
  const colW = (CONTENT - COL_GUTTER) / 2;
  let maxH = 0;

  boxes.forEach((box) => {
    const fields = (box.fields || []).filter((f) => f.v);
    let h = 15;
    fields.forEach((f) => {
      doc.fontSize(8.5).font(SERIF);
      const vH = doc.heightOfString(String(f.v), { width: colW, lineGap: 1 });
      h += Math.max(vH + 11, 18) + 5;
    });
    maxH = Math.max(maxH, h);
  });

  return maxH;
}

function partyBoxes(doc, boxes) {
  const colW = (CONTENT - COL_GUTTER) / 2;
  const y = doc.y;
  let maxBottom = y;

  boxes.forEach((box, bi) => {
    const x = bi === 0 ? MARGIN : MARGIN + colW + COL_GUTTER;

    doc.fontSize(8.5).font(SANS_B).fillColor(INK)
      .text(box.title.toUpperCase(), x, y, { width: colW, characterSpacing: 0.6, lineBreak: false });

    let fy = y + 15;
    const fields = (box.fields || []).filter((f) => f.v);
    fields.forEach((f) => {
      doc.fontSize(6.5).font(SANS).fillColor(INK_FAINT)
        .text(String(f.l).toUpperCase(), x, fy, { width: colW, lineBreak: false, characterSpacing: 0.3 });
      doc.fontSize(8.5).font(SERIF).fillColor(INK);
      const vH = doc.heightOfString(String(f.v), { width: colW, lineGap: 1 });
      doc.text(String(f.v), x, fy + 10, { width: colW, lineGap: 1 });
      fy += Math.max(vH + 11, 18) + 5;
    });

    maxBottom = Math.max(maxBottom, fy);
  });

  doc.y = maxBottom + 6;
}

function noteBlock(doc, label, content) {
  const text = (content || '').toString().trim();
  if (!text) return;

  const padL = 14;
  const innerW = CONTENT - padL;

  doc.fontSize(8.5).font(SERIF);
  const textH = doc.heightOfString(text, { width: innerW, align: 'justify', lineGap: 2 });
  const labelH = 12;
  const blockH = labelH + textH + 10;

  ensureSpace(doc, blockH);
  const y = doc.y;

  doc.fontSize(7).font(SANS_B).fillColor(INK_SOFT)
    .text(label.toUpperCase(), MARGIN, y, { width: CONTENT, characterSpacing: 0.5, lineBreak: false });

  const textY = y + labelH;
  doc.save().strokeColor(LINE_SOFT).lineWidth(1.5)
    .moveTo(MARGIN, textY).lineTo(MARGIN, textY + textH + 4).stroke().restore();

  doc.fontSize(8.5).font(SERIF).fillColor(INK)
    .text(text, MARGIN + padL, textY, { width: innerW, align: 'justify', lineGap: 2 });

  doc.y = textY + textH + 14;
}

function clauseBlockHeight(doc, content) {
  const text = (content || '').toString().trim();
  if (!text) return 0;

  const innerW = CONTENT - 30;
  doc.fontSize(8.5).font(SERIF);
  const textH = doc.heightOfString(text, { width: innerW, align: 'justify', lineGap: 2 });
  return 13 + textH + 10;
}

function clauseItem(doc, sectionNumber, index, title, content) {
  const text = (content || '').toString().trim();
  if (!text) return;

  const number = `${sectionNumber}.${index}`;
  const indent = 30;
  const innerW = CONTENT - indent;
  const blockH = clauseBlockHeight(doc, content);

  ensureSpace(doc, blockH);
  const y = doc.y;

  doc.fontSize(8.5).font(SERIF_B).fillColor(INK)
    .text(number, MARGIN, y, { width: indent - 6, lineBreak: false });
  doc.fontSize(8.5).font(SERIF_B).fillColor(INK)
    .text(title, MARGIN + indent, y, { width: innerW });

  doc.fontSize(8.5).font(SERIF).fillColor(INK)
    .text(text, MARGIN + indent, y + 13, { width: innerW, align: 'justify', lineGap: 2 });

  doc.y = y + blockH;
}

function signatureBlock(doc, buyerName, sellerName) {
  const colW = (CONTENT - COL_GUTTER) / 2;
  const y = doc.y;

  const drawSig = (x, partyLabel) => {
    doc.fontSize(7.5).font(SANS_B).fillColor(INK)
      .text(`FOR ${String(partyLabel || '').toUpperCase()}`, x, y, { width: colW, characterSpacing: 0.4 });

    const lineY = y + 40;
    hRule(doc, lineY, LINE, x, x + colW * 0.65);

    doc.fontSize(6.5).font(SANS).fillColor(INK_SOFT)
      .text('Authorized Signatory', x, lineY + 6, { width: colW });
    doc.fontSize(6.5).font(SANS).fillColor(INK_SOFT)
      .text('Date: ________________', x, lineY + 17, { width: colW });
  };

  drawSig(MARGIN, buyerName || 'Buyer');
  drawSig(MARGIN + colW + COL_GUTTER, sellerName || 'Seller');

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

export async function buildContractPdf(contract, organization, logoUrl) {
  const logoBuf = await prepareLogoForPdf(await fetchLogoBuffer(logoUrl));

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
      autoFirstPage: false,
    });
    const chunks = [];
    doc.on('data',  (c) => chunks.push(c));
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.addPage();

    drawLetterhead(doc, { organization, logoBuf });
    drawTitleBlock(doc, {
      title:          contract.contractType || 'TRADE CONTRACT',
      contractNumber: contract.contractNumber,
      date:           fmtDate(contract.contractDate),
    });

    // ── 1. Parties ────────────────────────────────────────────────────────
    const buyer  = contract.buyer  || {};
    const seller = contract.seller || {};

    const buyerFields = [
      { l: 'Company',        v: decodeHtml(buyer.companyName)   },
      { l: 'Address',        v: decodeHtml(buyer.address)       },
      { l: 'Country',        v: decodeHtml(buyer.country)       },
      { l: 'Contact Person', v: decodeHtml(buyer.contactPerson) },
      { l: 'Phone',          v: decodeHtml(buyer.phone)         },
      { l: 'Email',          v: decodeHtml(buyer.email)         },
      { l: 'Tax / VAT No.',  v: decodeHtml(buyer.taxNumber)     },
    ];

    const sellerFields = [
      { l: 'Company',        v: decodeHtml(seller.companyName)   },
      { l: 'Address',        v: decodeHtml(seller.address)       },
      { l: 'Country',        v: decodeHtml(seller.country)       },
      { l: 'Contact Person', v: decodeHtml(seller.contactPerson) },
      { l: 'Phone',          v: decodeHtml(seller.phone)         },
      { l: 'Email',          v: decodeHtml(seller.email)         },
      { l: 'Tax / VAT No.',  v: decodeHtml(seller.taxNumber)     },
    ];

    const partyEntries = [
      { title: 'Buyer',  fields: buyerFields  },
      { title: 'Seller', fields: sellerFields },
    ];

    sectionHeading(doc, 1, 'Parties to the Contract', measurePartyBoxes(doc, partyEntries));
    partyBoxes(doc, partyEntries);

    // ── 2. Commodity ─────────────────────────────────────────────────────
    const com = contract.commodity || {};
    const comRow = [
      { l: 'Commodity',         v: com.commodity     },
      { l: 'HS Code',           v: com.hsCode        },
      { l: 'Country of Origin', v: com.originCountry },
    ].filter((c) => c.v);

    const hasQualitySpec = !!(com.qualitySpecification || '').toString().trim();
    if (comRow.length || hasQualitySpec) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, 2, 'Commodity Details', measureCommodityDetailsBlock(doc, comRow, com.qualitySpecification));
      commodityDetailsBlock(doc, comRow, 'Quality Specification', com.qualitySpecification);
    }

    // ── 3. Shipment ──────────────────────────────────────────────────────
    const ship = contract.shipment || {};
    const shipRow1 = [
      { l: 'Incoterm',         v: ship.incoterm        },
      { l: 'Loading Port',     v: ship.loadingPort     },
      { l: 'Destination Port', v: ship.destinationPort },
      { l: 'Quantity',         v: ship.quantity != null ? `${ship.quantity} ${ship.unit}` : null },
    ].filter((c) => c.v);

    const shipRow2 = [
      { l: 'Partial Shipment', v: ship.partialShipment },
      { l: 'Transshipment',    v: ship.transshipment   },
    ].filter((c) => c.v);

    const shipRows = [shipRow1, shipRow2].filter((r) => r.length);
    if (shipRows.length) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, 3, 'Shipment Terms', measureFieldRows(doc, shipRows));
      fieldGrid(doc, shipRows);
    }

    // ── 4. Price & Payment ───────────────────────────────────────────────
    const price = contract.price        || {};
    const pmt   = contract.paymentTerms || {};

    const priceRow1 = [
      { l: 'Currency',             v: price.currency },
      { l: 'Unit Price',           v: price.unitPrice          != null ? `${price.currency} ${fmt(price.unitPrice)}`          : null },
      { l: 'Total Contract Value', v: price.totalContractValue != null ? `${price.currency} ${fmt(price.totalContractValue)}` : null },
    ].filter((c) => c.v);

    const priceRow2 = [
      { l: 'Advance %',      v: pmt.advancePercent != null ? `${pmt.advancePercent}%` : null },
      { l: 'Balance %',      v: pmt.balancePercent != null ? `${pmt.balancePercent}%` : null },
      { l: 'Payment Method', v: pmt.paymentMethod },
    ].filter((c) => c.v);

    const priceRows = [priceRow1, priceRow2].filter((r) => r.length);
    if (priceRows.length) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, 4, 'Price & Payment Terms', measureFieldRows(doc, priceRows));
      fieldGrid(doc, priceRows);
    }

    // ── 5. Packing, Inspection & Insurance ───────────────────────────────
    const pack = contract.packing    || {};
    const ins  = contract.inspection || {};
    const insu = contract.insurance  || {};

    const piRow = [
      { l: 'Packaging Type',           v: pack.packagingType   },
      { l: 'Bag Marking',              v: pack.bagMarking      },
      { l: 'Inspection Agency',        v: ins.inspectionAgency },
      { l: 'Insurance Responsibility', v: insu.responsibility  },
    ].filter((c) => c.v);

    if (piRow.length) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, 5, 'Packing, Inspection & Insurance', measureFieldRows(doc, [piRow]));
      fieldGrid(doc, [piRow]);
    }
    noteBlock(doc, 'Inspection Requirement', ins.inspectionRequirement);

    // ── 6. Clauses ────────────────────────────────────────────────────────
    const stdMap = [
      { key: 'forceMajeure',      label: 'Force Majeure'      },
      { key: 'arbitration',       label: 'Arbitration'        },
      { key: 'qualityClaims',     label: 'Quality Claims'     },
      { key: 'insurance',         label: 'Insurance'          },
      { key: 'inspection',        label: 'Inspection'         },
      { key: 'paymentDefault',    label: 'Payment Default'    },
      { key: 'disputeResolution', label: 'Dispute Resolution' },
    ];

    const stdClauses = contract.standardClauses || {};
    const clauseEntries = [];

    stdMap.forEach(({ key, label }) => {
      const sc = stdClauses[key];
      if (sc?.enabled && sc?.content) clauseEntries.push({ label, content: sc.content });
    });

    if (contract.forceMajeure) clauseEntries.push({ label: 'Force Majeure', content: contract.forceMajeure });
    if (contract.arbitration)  clauseEntries.push({ label: 'Arbitration',   content: contract.arbitration  });
    if (contract.governingLaw) clauseEntries.push({ label: 'Governing Law', content: contract.governingLaw });

    const customClauses = (contract.clauses || []).slice().sort((a, b) => a.order - b.order);
    customClauses.forEach((cl) => {
      if (cl.title && cl.content) clauseEntries.push({ label: cl.title, content: cl.content });
    });

    if (clauseEntries.length) {
      doc.y += SECTION_GAP;
      sectionHeading(doc, 6, 'Terms & Conditions', clauseBlockHeight(doc, clauseEntries[0].content));
      clauseEntries.forEach((entry, idx) => {
        clauseItem(doc, 6, idx + 1, entry.label, entry.content);
      });
      doc.y += 4;
    }

    // ── 7. Signatures ─────────────────────────────────────────────────────
    doc.y += SECTION_GAP;
    sectionHeading(doc, 7, 'Signatures', SIGNATURE_BLOCK_H);
    signatureBlock(doc, contract.buyerName, contract.sellerName);

    drawFooter(doc);
    doc.flushPages();
    doc.end();
  });
}
