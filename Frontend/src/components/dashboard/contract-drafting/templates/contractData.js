export const CONTRACT = {
  header: {
    number:        'BLK-2026-TRD-00847',
    agreementDate: '15 May 2026',
    effectiveDate: '01 June 2026',
  },
  exporter: {
    name:    'Meridian Agro Industries Ltd.',
    address: '14-B, Industrial Estate, Andheri East, Mumbai — 400093',
    country: 'India',
    contact: 'Mr. Rajesh Kumar, Director — Trade Operations',
  },
  importer: {
    name:    'Gulf Fresh Trading LLC',
    address: 'Building 7, Zone 4, Dubai Industrial City, Dubai — 121212',
    country: 'United Arab Emirates',
    contact: 'Mr. Khalid Al-Rashidi, Chief Procurement Officer',
  },
  product: {
    name:       'Basmati Rice — Long Grain, Premium Grade',
    hsCode:     '1006.30.10',
    quantity:   '500 MT (Five Hundred Metric Tonnes)',
    unitPrice:  'USD 1,200.00 per MT',
    totalValue: 'USD 600,000.00',
    currency:   'United States Dollar (USD)',
  },
  trade: {
    incoterm:         'CIF — Cost, Insurance & Freight (Incoterms 2020)',
    portOfLoading:    'JNPT — Jawaharlal Nehru Port, Mumbai, India',
    portOfDischarge:  'Port of Jebel Ali, Dubai, UAE',
    deliveryTimeline: 'Within 45 days from receipt of confirmed Letter of Credit',
  },
  payment: {
    advance:    '20% — USD 120,000.00 within 7 working days of contract signing',
    lc:         'Irrevocable, confirmed LC for balance 80% — USD 480,000.00',
    bank:       'HDFC Bank Ltd., Fort Branch, Mumbai · SWIFT: HDFCINBB',
    milestones: 'Advance on signing · 80% against Bill of Lading presentation',
  },
  quality: {
    inspection:  'SGS Third-Party Inspection at Port of Loading — Certificate required',
    standards:   'AGMARK Grade A · FSSAI Certified · Phytosanitary Certificate',
    acceptance:  'Max 5% broken grains · Moisture below 14% · Zero pesticide residue',
  },
  risk: {
    forceMajeure: 'War, civil unrest, government embargo, natural disaster, pandemic declaration',
    delays:       '0.5% of shipment value per week, capped at 5% of total contract value',
    damages:      'Liability limited to FOB value of goods in dispute',
    insurance:    '110% CIF value · Marine Open Policy · All-risks cover',
  },
  dispute: {
    arbitration:  'Singapore International Arbitration Centre (SIAC), Singapore',
    governingLaw: 'Laws of England and Wales',
    jurisdiction: 'Courts of Singapore — Exclusive Jurisdiction',
  },
};
