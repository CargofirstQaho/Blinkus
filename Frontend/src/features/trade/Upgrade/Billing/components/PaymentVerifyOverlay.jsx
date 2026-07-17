import { Loader2 } from 'lucide-react';

export default function PaymentVerifyOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        <div className="mb-6 p-5 rounded-full bg-[#6495ED]/10">
          <Loader2 size={40} className="animate-spin text-[#6495ED]" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-display font-bold text-black mb-3">
          Verifying your payment...
        </h2>
        <p className="text-sm text-black/50 leading-relaxed max-w-sm">
          Please do not close this page, refresh, or click Back while your payment is being verified.
        </p>
      </div>
    </div>
  );
}
