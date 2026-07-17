import { CONTRACT as C } from '../templates/contractData';
import ContractSection from '../components/ContractSection';

function Field({ label, value }) {
  return (
    <div className="flex gap-3 mb-2 min-w-0">
      <span className="text-[11px] text-black/40 w-28 sm:w-36 shrink-0 font-medium leading-snug">
        {label}
      </span>
      <span className="text-[11px] text-black/80 font-semibold flex-1 leading-snug break-words">
        {value}
      </span>
    </div>
  );
}

function PartyBlock({ role, data }) {
  return (
    <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-black/5 min-w-0">
      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-accent mb-2">{role}</div>
      <div className="text-[12px] font-bold text-black mb-1 leading-snug">{data.name}</div>
      <div className="text-[11px] text-black/55 mb-0.5 leading-snug">{data.address}</div>
      <div className="text-[11px] text-black/55 mb-1 font-medium">{data.country}</div>
      <div className="text-[10px] text-black/35 leading-snug">{data.contact}</div>
    </div>
  );
}

function SignatureBox({ role }) {
  return (
    <div className="flex-1 border border-black/10 rounded-lg p-4 min-w-0">
      <div className="h-10 border-b border-dashed border-black/15 mb-3" />
      <div className="text-[9px] font-bold uppercase tracking-widest text-black/30 mb-0.5">{role}</div>
      <div className="text-[10px] text-black/25">Signature · Date · Seal</div>
    </div>
  );
}

export default function ContractDocument() {
  return (
    <div className="bg-white px-5 sm:px-8 md:px-10 py-8 text-black">
      <div className="text-center mb-8 pb-6 border-b-2 border-black/8">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-black/35 mb-2">
          Blinkus Global Trade Solutions — AI Trade Intelligence
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-black uppercase mb-1">
          International Trade Agreement
        </div>
        <div className="text-[11px] font-semibold text-black/40">
          Commercial Export-Import Contract
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 p-4 bg-gray-50 rounded-xl border border-black/5">
        {[
          ['Contract No.',    C.header.number],
          ['Agreement Date',  C.header.agreementDate],
          ['Effective Date',  C.header.effectiveDate],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30 mb-1">
              {label}
            </div>
            <div className="text-xs font-bold text-black">{value}</div>
          </div>
        ))}
      </div>

      <ContractSection number="A" title="Parties to the Agreement">
        <div className="flex flex-col sm:flex-row gap-3">
          <PartyBlock role="Exporter / Seller" data={C.exporter} />
          <PartyBlock role="Importer / Buyer"  data={C.importer} />
        </div>
      </ContractSection>

      <ContractSection number="B" title="Product Information">
        <div className="space-y-1">
          <Field label="Product Name"   value={C.product.name} />
          <Field label="HS Code"        value={C.product.hsCode} />
          <Field label="Quantity"       value={C.product.quantity} />
          <Field label="Unit Price"     value={C.product.unitPrice} />
          <Field label="Total Value"    value={C.product.totalValue} />
          <Field label="Currency"       value={C.product.currency} />
        </div>
      </ContractSection>

      <ContractSection number="C" title="Trade Terms & Incoterms 2020">
        <div className="space-y-1">
          <Field label="Incoterm"          value={C.trade.incoterm} />
          <Field label="Port of Loading"   value={C.trade.portOfLoading} />
          <Field label="Port of Discharge" value={C.trade.portOfDischarge} />
          <Field label="Delivery"          value={C.trade.deliveryTimeline} />
        </div>
      </ContractSection>

      <ContractSection number="D" title="Payment Terms">
        <div className="space-y-1">
          <Field label="Advance"          value={C.payment.advance} />
          <Field label="Letter of Credit" value={C.payment.lc} />
          <Field label="Bank Details"     value={C.payment.bank} />
          <Field label="Milestones"       value={C.payment.milestones} />
        </div>
      </ContractSection>

      <ContractSection number="E" title="Quality & Inspection">
        <div className="space-y-1">
          <Field label="Inspection"         value={C.quality.inspection} />
          <Field label="Standards"          value={C.quality.standards} />
          <Field label="Acceptance"         value={C.quality.acceptance} />
        </div>
      </ContractSection>

      <ContractSection number="F" title="Risk & Liability">
        <div className="space-y-1">
          <Field label="Force Majeure"  value={C.risk.forceMajeure} />
          <Field label="Delay Penalty"  value={C.risk.delays} />
          <Field label="Damages Cap"    value={C.risk.damages} />
          <Field label="Insurance"      value={C.risk.insurance} />
        </div>
      </ContractSection>

      <ContractSection number="G" title="Dispute Resolution">
        <div className="space-y-1">
          <Field label="Arbitration"    value={C.dispute.arbitration} />
          <Field label="Governing Law"  value={C.dispute.governingLaw} />
          <Field label="Jurisdiction"   value={C.dispute.jurisdiction} />
        </div>
      </ContractSection>

      <ContractSection number="H" title="Authorized Signatures">
        <div className="flex flex-col sm:flex-row gap-3">
          <SignatureBox role="Exporter / Seller" />
          <SignatureBox role="Importer / Buyer" />
          <SignatureBox role="Witness / Notary" />
        </div>
      </ContractSection>
    </div>
  );
}
