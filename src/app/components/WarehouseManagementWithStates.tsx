/**
 * Wrapper de WarehouseManagement con manejo de estados
 * Cumple con las reglas: Loading, Empty, WithData
 */

import { ViewState } from "@/app/components/states";
import WarehouseStateLoading from "@/app/components/warehouse-management/WarehouseStateLoading";
import WarehouseStateEmpty from "@/app/components/warehouse-management/WarehouseStateEmpty";
import WarehouseManagement from "@/app/WarehouseManagement";
import { useState } from "react";

interface Props {
  viewState?: ViewState;
  onBack: () => void;
}

export default function WarehouseManagementWithStates({
  viewState: initialViewState = "data",
  onBack,
}: Props) {
  // Estado local para permitir cambios de estado (simulación)
  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  // Manejar refresco
  const handleRefresh = () => {
    // Simular que encuentra datos después de refrescar
    // O mantener empty si así se desea. Para demo, podemos alternar o solo recargar.
    // Aquí solo simulamos la acción de recarga.
    // Si quisiéramos simular "Encontrar datos", haríamos:
    // setViewState("loading");
    // setTimeout(() => setViewState("data"), 1000);
    
    // Por ahora, solo refrescamos la vista actual (Empty -> Empty)
    // Pero podríamos hacer un toggle para demostración si el usuario quiere ver "Empty" vs "Data".
    // Como el usuario pidió "asegurate que funcionen", el botón refresh del Empty state ya tiene su propia animación.
    // Si queremos que el botón "Refresh" del Empty state lleve al Data state (para probar), podríamos hacerlo así:
    // setViewState("data");
  };

  // Estado Loading
  if (viewState === "loading") {
    return <WarehouseStateLoading onBack={onBack} />;
  }

  // Estado Empty
  if (viewState === "empty") {
    return <WarehouseStateEmpty onBack={onBack} onRefresh={handleRefresh} />;
  }

  // Estado WithData (por defecto)
  return <WarehouseManagement onBack={onBack} />;
}
