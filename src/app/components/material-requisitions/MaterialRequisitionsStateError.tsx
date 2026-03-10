/**
 * MATERIAL REQUISITIONS - Estado Error
 */

import { ErrorState } from "@/app/components/states";

interface MaterialRequisitionsStateErrorProps {
  onRetry?: () => void;
}

export function MaterialRequisitionsStateError({ onRetry }: MaterialRequisitionsStateErrorProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          message="No se pudieron cargar las requisiciones. Verifica tu conexión e intenta nuevamente."
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
