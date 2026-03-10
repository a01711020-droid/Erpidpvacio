import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  onBack?: () => void;
}

export default function PersonalStateLoading({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Loading */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 border-b border-gray-800 shadow-lg">
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
                <Skeleton className="h-10 w-10 rounded-lg bg-gray-600" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 bg-gray-600" />
                  <Skeleton className="h-4 w-32 bg-gray-600" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-40 bg-gray-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tabs Loading */}
        <div className="w-full h-10 bg-gray-200 rounded-lg flex p-1 gap-2 mb-6">
          <Skeleton className="h-full w-1/2 rounded-md" />
          <Skeleton className="h-full w-1/2 rounded-md" />
        </div>

        {/* Card Content Loading */}
        <Card className="border-gray-300 bg-white">
          <div className="p-6 border-b border-gray-300 bg-gray-50">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-64" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 ml-auto" />
                <Skeleton className="h-3 w-48 ml-auto" />
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
              <Skeleton className="h-5 w-48" />
            </div>

            {/* Table Header */}
            <div className="border rounded-lg bg-white border-gray-300 overflow-hidden">
              <div className="bg-gray-800 p-4 grid grid-cols-12 gap-4">
                <Skeleton className="h-4 w-16 col-span-2 bg-gray-600" />
                <Skeleton className="h-4 w-32 col-span-3 bg-gray-600" />
                <Skeleton className="h-4 w-24 col-span-3 bg-gray-600" />
                <Skeleton className="h-4 w-16 col-span-2 bg-gray-600" />
                <Skeleton className="h-4 w-24 col-span-2 bg-gray-600" />
              </div>

              {/* Table Rows */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-4 grid grid-cols-12 gap-4 border-t border-gray-200">
                  <Skeleton className="h-6 w-20 rounded-full col-span-2" />
                  <Skeleton className="h-6 w-40 col-span-3" />
                  <Skeleton className="h-6 w-28 col-span-3" />
                  <Skeleton className="h-6 w-8 mx-auto col-span-2" />
                  <Skeleton className="h-6 w-24 ml-auto col-span-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
