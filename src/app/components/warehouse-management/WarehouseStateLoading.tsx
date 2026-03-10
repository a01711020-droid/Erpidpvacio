import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Warehouse } from "lucide-react";

interface Props {
  onBack?: () => void;
}

export default function WarehouseStateLoading({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header Loading */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-800 border-b-4 border-orange-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                disabled
                className="gap-2 bg-white/10 text-white border-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-orange-600/50 p-2 rounded-lg">
                  <Warehouse className="h-10 w-10 text-white/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48 bg-orange-600/50" />
                  <Skeleton className="h-4 w-32 bg-orange-600/50" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-40 bg-orange-600/50" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters Loading */}
        <Card className="mb-6 border-orange-200">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 w-full sm:w-1/2" />
              <Skeleton className="h-10 w-full sm:w-[220px]" />
            </div>
          </div>
        </Card>

        {/* Tabs Loading */}
        <div className="w-full h-10 bg-orange-200/50 rounded-lg flex p-1 gap-2 mb-6">
          <Skeleton className="h-full w-1/3 rounded-md bg-orange-300/50" />
          <Skeleton className="h-full w-1/3 rounded-md bg-orange-300/50" />
          <Skeleton className="h-full w-1/3 rounded-md bg-orange-300/50" />
        </div>

        {/* Content Loading */}
        <Card className="border-orange-200 bg-white">
          <div className="p-0">
            {/* Header Table */}
            <div className="grid grid-cols-10 gap-4 p-4 bg-gray-50 border-b">
              <Skeleton className="h-4 w-24 col-span-3" />
              <Skeleton className="h-4 w-16 col-span-2" />
              <Skeleton className="h-4 w-32 col-span-2" />
              <Skeleton className="h-4 w-16 col-span-2 mx-auto" />
              <Skeleton className="h-4 w-8 col-span-1 ml-auto" />
            </div>

            {/* Rows */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-10 gap-4 p-4 border-b last:border-0 hover:bg-orange-50/50">
                <div className="col-span-3 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="col-span-2 flex justify-center">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="col-span-1 flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
