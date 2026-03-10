/**
 * GLOBAL DASHBOARD - Estado Error
 * Muestra mensaje de error con opción de reintentar
 */

import { ErrorState } from "@/app/components/states";

interface DashboardStateErrorProps {
  onRetry?: () => void;
}

export function DashboardStateError({ onRetry }: DashboardStateErrorProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          message="No se pudieron cargar las obras. Verifica tu conexión e intenta nuevamente."
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
