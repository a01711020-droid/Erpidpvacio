/**
 * MATERIAL REQUISITIONS - Estado Loading
 */

import { LoadingState } from "@/app/components/states";

export function MaterialRequisitionsStateLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState type="cards" rows={6} />
      </div>
    </div>
  );
}
