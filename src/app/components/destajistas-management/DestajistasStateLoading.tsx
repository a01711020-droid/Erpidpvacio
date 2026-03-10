import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  onBack?: () => void;
}

export default function DestajistasStateLoading({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Skeleton className="h-9 w-80 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 pb-3 border-b-2">
              <Skeleton className="h-4 w-20 col-span-2" />
              <Skeleton className="h-4 w-24 col-span-3" />
              <Skeleton className="h-4 w-20 col-span-2" />
              <Skeleton className="h-4 w-24 col-span-3" />
              <Skeleton className="h-4 w-20 col-span-2" />
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 py-3">
                <Skeleton className="h-6 w-12 col-span-2" />
                <Skeleton className="h-6 w-32 col-span-3" />
                <Skeleton className="h-6 w-16 col-span-2" />
                <Skeleton className="h-6 w-24 col-span-3" />
                <Skeleton className="h-6 w-20 col-span-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
