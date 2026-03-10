/**
 * Wrapper de DestajistasManagement con manejo de estados
 * Cumple con las reglas: Loading, Empty, WithData
 */

import { useState } from "react";
import { ViewState } from "@/app/components/states";
import {
  DestajistasStateLoading,
  DestajistasStateEmpty,
} from "@/app/components/destajistas-management";
import DestajistasManagement from "@/app/DestajistasManagement";

interface Props {
  viewState?: ViewState;
  onBack: () => void;
}

export default function DestajistasManagementWithStates({
  viewState: initialViewState = "data",
  onBack,
}: Props) {
  // Estado local para permitir cambios de estado
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const [autoOpenForm, setAutoOpenForm] = useState(false);

  // Manejar transición de Empty a Data — abre el formulario de nuevo destajista
  const handleAddFirst = () => {
    setAutoOpenForm(true);
    setViewState("data");
  };

  // Estado Loading
  if (viewState === "loading") {
    return <DestajistasStateLoading onBack={onBack} />;
  }

  // Estado Empty
  if (viewState === "empty") {
    return <DestajistasStateEmpty onBack={onBack} onAdd={handleAddFirst} />;
  }

  // Estado WithData
  return <DestajistasManagement onBack={onBack} autoOpenForm={autoOpenForm} />;
}
