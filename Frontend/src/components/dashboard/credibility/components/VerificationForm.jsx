import ComingSoonBanner from './ComingSoonBanner';

const BUYER_SELLER_TYPES = [
  'Importer',
  'Exporter',
  'Importer & Exporter',
  'Manufacturer',
  'Trading House',
];

const PRODUCT_CATEGORIES = [
  'Agriculture',
  'Chemicals',
  'Electronics',
  'Engineering Goods',
  'Gems & Jewellery',
  'Pharmaceuticals',
  'Textiles',
  'Other',
];

const input =
  'w-full px-3.5 py-2.5 text-sm border border-black/10 rounded-xl bg-white text-black/55 placeholder-black/30 focus:outline-none cursor-not-allowed';

const label = 'block text-[10px] font-bold text-black/50 mb-1.5 uppercase tracking-wider';

export default function VerificationForm() {
  return (
    <div className="relative">
      <ComingSoonBanner />

      <fieldset disabled className="pointer-events-none space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className={label}>Company Name</label>
            <input
              type="text"
              placeholder="e.g. Acme Exports Pvt. Ltd."
              className={input}
            />
          </div>

          <div>
            <label className={label}>Buyer / Seller Type</label>
            <select className={input}>
              <option value="">Select type</option>
              {BUYER_SELLER_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>Country</label>
            <input type="text" placeholder="e.g. India" className={input} />
          </div>

          <div>
            <label className={label}>Registration Number</label>
            <input type="text" placeholder="CIN / BRN / Company ID" className={input} />
          </div>

          <div>
            <label className={label}>IEC Number</label>
            <input type="text" placeholder="Import Export Code" className={input} />
          </div>

          <div>
            <label className={label}>GST Number</label>
            <input type="text" placeholder="e.g. 27AAAPL1234C1Z5" className={input} />
          </div>

          <div>
            <label className={label}>Website</label>
            <input type="url" placeholder="https://yourcompany.com" className={input} />
          </div>

          <div>
            <label className={label}>Contact Email</label>
            <input type="email" placeholder="trade@yourcompany.com" className={input} />
          </div>

          <div>
            <label className={label}>Trade Country</label>
            <input type="text" placeholder="Country of primary trade activity" className={input} />
          </div>

          <div>
            <label className={label}>Shipment Value (USD)</label>
            <input type="text" placeholder="e.g. $250,000" className={input} />
          </div>

          <div>
            <label className={label}>Product Category</label>
            <select className={input}>
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>HS Code</label>
            <input type="text" placeholder="e.g. 8471.30" className={input} />
          </div>

          <div>
            <label className={label}>Annual Trade Volume (USD)</label>
            <input type="text" placeholder="e.g. $2,000,000" className={input} />
          </div>

          <div>
            <label className={label}>Years in Business</label>
            <input type="number" placeholder="e.g. 8" className={input} />
          </div>
        </div>

        <button
          type="button"
          disabled
          className="w-full sm:w-auto px-6 py-2.5 bg-accent text-white font-semibold text-sm rounded-xl opacity-40 cursor-not-allowed"
        >
          Submit Verification Request
        </button>
      </fieldset>
    </div>
  );
}
