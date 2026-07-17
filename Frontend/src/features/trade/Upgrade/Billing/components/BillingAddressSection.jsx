import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import BillingAddressCard from './BillingAddressCard';
import BillingAddressForm from './BillingAddressForm';

export default function BillingAddressSection({ addresses, selected, loading, error, onSelect, onCreate, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (payload) => {
    await onCreate(payload);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-black/25" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (addresses.length === 0 && !showForm) {
    return (
      <div className="flex flex-col gap-4">
        <BillingAddressForm onSubmit={handleCreate} submitLabel="Save Address" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.length > 0 && (
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <BillingAddressCard
              key={address._id}
              address={address}
              isSelected={selected?._id === address._id}
              onSelect={onSelect}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-black/8 p-5 shadow-sm"
          >
            <p className="text-xs font-bold text-black/40 uppercase tracking-wide mb-4">New Billing Address</p>
            <BillingAddressForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              submitLabel="Save Address"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-accent border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 self-start"
        >
          <Plus size={14} />
          Add New Address
        </button>
      )}
    </div>
  );
}
