/**
 * MAIN APP - Sistema unificado con estados reales
 * Sin toggle, con estados integrados en cada módulo
 */

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Módulos con estados integrados
import GlobalDashboard from "@/app/GlobalDashboard";
import Home from "@/app/Home";
import ContractTracking from "@/app/ContractTracking";
import ExpenseDetails from "@/app/ExpenseDetails";
import SupplierManagement from "@/app/SupplierManagement";
import PurchaseOrderManagement from "@/app/PurchaseOrderManagement";
import MaterialRequisitions from "@/app/MaterialRequisitions";
import PaymentManagement from "@/app/PaymentManagement";
import Destajos from "@/app/Destajos";
import DestajistasManagementWithStates from "@/app/components/DestajistasManagementWithStates";
import WarehouseManagementWithStates from "@/app/components/WarehouseManagementWithStates";
import PersonalManagementWithStates from "@/app/components/PersonalManagementWithStates";

type Module =
  | "home"
  | "dashboard"
  | "purchases"
  | "requisitions"
  | "payments"
  | "contract-tracking"
  | "expense-details"
  | "supplier-management"
  | "destajos"
  | "destajistas-management"
  | "warehouse"
  | "personal";

export default function MainApp() {
  const [activeModule, setActiveModule] = useState<Module>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [previousModule, setPreviousModule] = useState<Module | null>(null);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveModule("contract-tracking");
  };

  const handleBackToHome = () => {
    setActiveModule("home");
    setSelectedProjectId(null);
  };

  const handleBackToDashboard = () => {
    setActiveModule("dashboard");
    setSelectedProjectId(null);
  };

  const handleViewExpenseDetails = () => {
    setActiveModule("expense-details");
  };

  const handleBackToContractTracking = () => {
    setActiveModule("contract-tracking");
  };

  const renderModule = () => {
    // Home
    if (activeModule === "home") {
      return (
        <Home
          onSelectModule={(mod) => {
            const moduleMap: Record<string, Module> = {
              dashboard: "dashboard",
              requisitions: "requisitions",
              purchases: "purchases",
              payments: "payments",
              destajos: "destajos",
              warehouse: "warehouse",
              personal: "personal",
            };
            const mappedModule = moduleMap[mod];
            if (mappedModule) {
              setActiveModule(mappedModule);
            }
          }}
          userRole="admin"
          userName="Sistema de Gestión"
        />
      );
    }

    // Dashboard Global
    if (activeModule === "dashboard") {
      return (
        <div>
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToHome}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </div>
          </div>
          <GlobalDashboard
            onSelectProject={handleSelectProject}
            initialState="empty"
          />
        </div>
      );
    }

    // Contract Tracking
    if (activeModule === "contract-tracking") {
      return (
        <div>
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToDashboard}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </div>
          </div>
          <ContractTracking
            projectId={selectedProjectId}
            initialState="empty"
          />
        </div>
      );
    }

    // Expense Details
    if (activeModule === "expense-details") {
      return (
        <div>
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToContractTracking}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Seguimiento
              </Button>
            </div>
          </div>
          <ExpenseDetails />
        </div>
      );
    }

    // Supplier Management
    if (activeModule === "supplier-management") {
      return (
        <SupplierManagement
          onBack={() => {
            if (previousModule === "purchases") {
              setActiveModule("purchases");
              setPreviousModule(null);
            } else {
              handleBackToHome();
            }
          }}
          viewState="empty"
        />
      );
    }

    // Purchases (Órdenes de Compra)
    if (activeModule === "purchases") {
      return (
        <div>
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToHome}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </div>
          </div>
          <PurchaseOrderManagement
            onNavigateToSuppliers={() => {
              setPreviousModule("purchases");
              setActiveModule("supplier-management");
            }}
            initialState="empty"
          />
        </div>
      );
    }

    // Requisitions (Requisiciones)
    if (activeModule === "requisitions") {
      return (
        <div>
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToHome}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </div>
          </div>
          <MaterialRequisitions initialState="empty" />
        </div>
      );
    }

    // Payments (Pagos)
    if (activeModule === "payments") {
      return (
        <div>
          <div className="bg-white border-b shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToHome}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </div>
          </div>
          <PaymentManagement initialState="empty" />
        </div>
      );
    }

    // Destajos
    if (activeModule === "destajos") {
      return (
        <Destajos
          initialState="empty"
          onBack={handleBackToHome}
          onManageDestajistas={() => setActiveModule("destajistas-management")}
        />
      );
    }

    // Destajistas Management
    if (activeModule === "destajistas-management") {
      return (
        <DestajistasManagementWithStates
          viewState="empty"
          onBack={() => setActiveModule("destajos")}
        />
      );
    }

    // Warehouse (Almacén)
    if (activeModule === "warehouse") {
      return <WarehouseManagementWithStates onBack={handleBackToHome} viewState="empty" />;
    }

    // Personal
    if (activeModule === "personal") {
      return <PersonalManagementWithStates onBack={handleBackToHome} viewState="empty" />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {renderModule()}
    </div>
  );
}