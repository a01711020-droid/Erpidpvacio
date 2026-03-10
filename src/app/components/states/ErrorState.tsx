/**
 * ErrorState - Componente reutilizable para estado de error
 * Muestra mensaje de error y opción de reintentar
 */

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({
  title = "Ocurrió un error",
  message,
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <Card className="border-2 border-red-200 bg-red-50/50">
      <CardContent className="p-12">
        <div className="text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="inline-flex p-6 bg-red-100 rounded-full mb-6">
            <AlertCircle className="h-16 w-16 text-red-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>

          {/* Message */}
          <p className="text-gray-600 mb-8">{message}</p>

          {/* Retry Button */}
          {showRetry && onRetry && (
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={onRetry}
            >
              <RefreshCw className="h-5 w-5" />
              Reintentar
            </Button>
          )}

          {/* Error Details */}
          <div className="mt-8 p-4 bg-red-100 border border-red-200 rounded-lg text-left">
            <h4 className="font-semibold text-red-900 mb-2 text-sm">
              Posibles soluciones:
            </h4>
            <ul className="text-xs text-red-800 space-y-1">
              <li>• Verifica tu conexión a internet</li>
              <li>• Recarga la página</li>
              <li>• Contacta al administrador si el problema persiste</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
