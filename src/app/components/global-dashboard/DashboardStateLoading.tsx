/**
 * GLOBAL DASHBOARD - Estado Loading
 * Muestra skeletons mientras cargan los datos
 */

import { LoadingState } from "@/app/components/states";

export function DashboardStateLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState type="dashboard" rows={7} />
      </div>
    </div>
  );
}
