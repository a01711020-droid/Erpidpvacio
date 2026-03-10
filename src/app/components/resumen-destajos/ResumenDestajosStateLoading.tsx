import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface Props {
  onBack?: () => void;
}

export default function ResumenDestajosStateLoading({ onBack }: Props) {
  return (
    <div className="space-y-8">
      {/* Título */}
      <div>
        <Button variant="outline" onClick={onBack} className="mb-4" disabled>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Obras
        </Button>
        <Skeleton className="h-8 w-96 mb-2" />
        <Skeleton className="h-5 w-[500px]" />
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-50 border-gray-200">
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-16" />
            </div>
          </Card>
        ))}
      </div>

      {/* Tabla Consolidada */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-96" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-300">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-40" />
            </div>
          </div>
        </div>
      </Card>

      {/* Obras Individuales */}
      <div>
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden border-2">
              <div className="p-4 bg-gradient-to-r from-teal-600 to-teal-700">
                <Skeleton className="h-6 w-64 mb-2 bg-teal-400" />
                <Skeleton className="h-4 w-32 bg-teal-400" />
              </div>
              <div className="p-4 space-y-2">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
