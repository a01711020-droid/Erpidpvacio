/**
 * LoadingState - Componente reutilizable para estado de carga
 * Muestra skeletons con animación shimmer
 */

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";

interface LoadingStateProps {
  type?: "dashboard" | "table" | "cards" | "form";
  rows?: number;
}

export function LoadingState({ type = "table", rows = 5 }: LoadingStateProps) {
  if (type === "dashboard") {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(rows)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(rows)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-8 w-24 bg-gray-200 rounded mt-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <Card className="max-w-2xl mx-auto animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          ))}
          <div className="flex gap-2 pt-4">
            <div className="h-10 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-32 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default: table skeleton
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="flex gap-4 pb-2 border-b">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          {/* Table Rows */}
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center py-2">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-28 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
