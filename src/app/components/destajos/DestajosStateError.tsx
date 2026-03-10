import { ErrorState } from "@/app/components/states";
import { HardHat } from "lucide-react";

interface Props {
  onRetry?: () => void;
}

export function DestajosStateError({ onRetry }: Props) {
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)'
    }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b-4 border-teal-600 shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <HardHat className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Control de Destajos</h1>
              <p className="text-teal-100 text-lg">
                Gestión de destajos por obra y captura semanal de avances
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState onRetry={onRetry} />
      </div>
    </div>
  );
}