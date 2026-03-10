/**
 * DEV MODE CONTEXT
 * 
 * Contexto global para controlar el modo de visualización de datos
 * Permite cambiar entre:
 * - withData: Datos mock completos
 * - empty: Sin datos (empty states)
 * - loading: Estado de carga permanente
 * - error: Simular error de red
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

export type DevMode = 'withData' | 'empty' | 'loading' | 'error';

interface DevModeContextValue {
  mode: DevMode;
  setMode: (mode: DevMode) => void;
  networkDelay: boolean;
  setNetworkDelay: (enabled: boolean) => void;
}

const DevModeContext = createContext<DevModeContextValue | undefined>(undefined);

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DevMode>('withData');
  const [networkDelay, setNetworkDelay] = useState(true);

  const setMode = useCallback((newMode: DevMode) => {
    setModeState(newMode);
    console.log(`🎨 Dev Mode cambiado a: ${newMode}`);
  }, []);

  return (
    <DevModeContext.Provider
      value={{
        mode,
        setMode,
        networkDelay,
        setNetworkDelay,
      }}
    >
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode debe usarse dentro de DevModeProvider');
  }
  return context;
}
