import { useState } from 'react';
import { Check, Pencil, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils.js';
import BillingAddressForm from './BillingAddressForm';

export default function BillingAddressCard({ address, isSelected, onSelect, onUpdate, onDelete }) {
  const [editing,  setEditing]  = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleUpdate = async (payload) => {
    await onUpdate(address._id, payload);
    setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(address._id);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete. Please try again.');
      setDeleting(false);
    }
  };

  if (editing) {
    return (
      <div className="bg-white rounded-2xl border border-accent/30 p-5 shadow-sm">
        <p className="text-xs font-bold text-black/40 uppercase tracking-wide mb-4">Edit Address</p>
        <BillingAddressForm
          initialValues={address}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          submitLabel="Update Address"
        />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(address)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(address)}
      className={cn(
        'relative bg-white rounded-2xl border p-4 cursor-pointer transition-all outline-none',
        'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        isSelected
          ? 'border-accent shadow-md shadow-accent/10'
          : 'border-black/8 hover:border-black/15 shadow-sm'
      )}
    >
      {isSelected && (
        <span
          className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: '#6495ED' }}
          aria-hidden="true"
        >
          <Check size={10} className="text-white" strokeWidth={3} />
        </span>
      )}

      {address.isDefault && (
        <span className="inline-flex items-center px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded-full uppercase tracking-wide mb-2">
          Default
        </span>
      )}

      <p className="text-sm font-semibold text-black leading-tight">{address.fullName}</p>
      {address.companyName && (
        <p className="text-xs text-black/40 mt-0.5">{address.companyName}</p>
      )}
      <p className="text-xs text-black/50 mt-1.5 leading-relaxed">
        {address.addressLine1}
        {address.addressLine2 && `, ${address.addressLine2}`}
      </p>
      <p className="text-xs text-black/50">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-xs text-black/50">{address.country}</p>
      <p className="text-xs text-black/40 mt-1">{address.phone}</p>

      {deleteError && (
        <p className="text-xs text-red-500 mt-2">{deleteError}</p>
      )}

      <div className="flex items-center gap-1 mt-3" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit address"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-black/40 hover:text-black/70 hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Pencil size={11} />
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete address"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
        >
          {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
          Delete
        </button>
      </div>
    </div>
  );
}
