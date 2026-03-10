/**
 * PURCHASE ORDER MANAGEMENT - Estado Error
 */

import { ErrorState } from "@/app/components/states";

interface PurchaseOrderStateErrorProps {
  onRetry?: () => void;
}

export function PurchaseOrderStateError({ onRetry }: PurchaseOrderStateErrorProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          message="No se pudieron cargar las órdenes de compra. Verifica tu conexión e intenta nuevamente."
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
