/**
 * GLOBAL DASHBOARD - Con estados (loading, empty, error, data)
 * Sistema consolidado con estado real
 */

import { useState } from "react";
import { ViewState } from "@/app/components/states";
import {
  DashboardStateLoading,
  DashboardStateError,
  DashboardStateEmpty,
  DashboardStateData,
} from "@/app/components/global-dashboard";
import { WorkForm } from "@/app/components/WorkForm";

interface GlobalDashboardProps {
  onSelectProject?: (projectId: string) => void;
  initialState?: ViewState;
}

export default function GlobalDashboard({
  onSelectProject,
  initialState = "data",
}: GlobalDashboardProps) {
  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Handler para abrir modal de crear obra
  const handleCreateWork = () => {
    setShowModal(true);
  };

  // Handler para cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handler cuando se crea la obra exitosamente
  const handleObraCreada = () => {
    setShowModal(false);
    // Forzar re-render del dashboard
    setRefreshKey(prev => prev + 1);
    console.log("Obra creada exitosamente");
  };

  const handleRetry = () => {
    console.log("Reintentar carga");
    setViewState("loading");
    // Simular carga
    setTimeout(() => setViewState("data"), 1000);
  };

  // ESTADO: LOADING
  if (viewState === "loading") {
    return <DashboardStateLoading />;
  }

  // ESTADO: ERROR
  if (viewState === "error") {
    return <DashboardStateError onRetry={handleRetry} />;
  }

  // ESTADO: EMPTY
  if (viewState === "empty") {
    return (
      <>
        <DashboardStateEmpty onCreateWork={handleCreateWork} />
        {showModal && (
          <WorkForm
            onClose={handleCloseModal}
            onSuccess={handleObraCreada}
          />
        )}
      </>
    );
  }

  // ESTADO: DATA
  return (
    <>
      <DashboardStateData
        onSelectProject={onSelectProject}
        onCreateWork={handleCreateWork}
      />
      {showModal && (
        <WorkForm
          onClose={handleCloseModal}
          onSuccess={handleObraCreada}
        />
      )}
    </>
  );
}