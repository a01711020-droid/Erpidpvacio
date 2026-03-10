/**
 * Wrapper de PersonalManagement con manejo de estados
 * Cumple con las reglas: Loading, Empty, WithData
 */

import { ViewState } from "@/app/components/states";
import PersonalStateLoading from "@/app/components/personal-management/PersonalStateLoading";
import PersonalStateEmpty from "@/app/components/personal-management/PersonalStateEmpty";
import PersonalManagement from "@/app/PersonalManagement";
import { useState } from "react";

interface Props {
  viewState?: ViewState;
  onBack: () => void;
}

export default function PersonalManagementWithStates({
  viewState: initialViewState = "data",
  onBack,
}: Props) {
  // Estado local para permitir cambios de estado
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const [autoOpenDialog, setAutoOpenDialog] = useState(false);

  // Manejar transición de Empty a Data — abre el diálogo de nuevo empleado
  const handleAddFirstEmployee = () => {
    setAutoOpenDialog(true);
    setViewState("data");
  };

  // Estado Loading
  if (viewState === "loading") {
    return <PersonalStateLoading onBack={onBack} />;
  }

  // Estado Empty
  if (viewState === "empty") {
    return <PersonalStateEmpty onBack={onBack} onAdd={handleAddFirstEmployee} />;
  }

  // Estado WithData (por defecto)
  return <PersonalManagement onBack={onBack} autoOpenAddDialog={autoOpenDialog} />;
}
