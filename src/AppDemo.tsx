/**
 * APP DEMO - Entry Point para UI Demo
 * 
 * DEPRECATED: Este archivo es obsoleto.
 * Usa MainApp directamente desde /src/app/MainApp.tsx
 * 
 * Mantiene compatibilidad temporal pero redirige al nuevo sistema.
 */

import MainApp from "./app/MainApp";

export default function AppDemo() {
  console.warn("⚠️ AppDemo is deprecated. Use MainApp directly.");
  return <MainApp />;
}
