/**
 * HOOK: useDevModeSync
 * 
 * Sincroniza el contexto DevMode con el mockAdapter
 * Debe llamarse desde el componente raíz de la app
 */

import { useEffect } from 'react';
import { useDevMode } from '../contexts/DevModeContext';
import { setDevModeConfig } from '../data/mockAdapterWithDevMode';

export function useDevModeSync() {
  const { mode, networkDelay } = useDevMode();

  useEffect(() => {
    setDevModeConfig(mode, networkDelay);
    console.log(`🔄 DevMode actualizado: ${mode} | Network Delay: ${networkDelay}`);
  }, [mode, networkDelay]);
}
