/**
 * USE DATA HOOK
 * 
 * Hook React personalizado para consumir datos del adapter
 * Maneja automáticamente: loading, error, retry, refresh
 */

import { useState, useEffect, useCallback } from 'react';
import type { ViewState } from '../ui/StatePanel';

// ============================================================================
// TYPES
// ============================================================================

export interface UseDataOptions<T> {
  /**
   * Función async que retorna los datos
   */
  fetcher: () => Promise<{ status: string; data: T | T[] | null; error: string | null }>;
  
  /**
   * Cargar automáticamente al montar
   * @default true
   */
  autoLoad?: boolean;
  
  /**
   * Callback cuando carga exitosa
   */
  onSuccess?: (data: T | T[]) => void;
  
  /**
   * Callback cuando hay error
   */
  onError?: (error: string) => void;
  
  /**
   * Dependencias para recargar
   */
  deps?: any[];
}

export interface UseDataReturn<T> {
  data: T | T[] | null;
  state: ViewState;
  error: string | null;
  isLoading: boolean;
  isEmpty: boolean;
  reload: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | T[] | null>>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useData<T>({
  fetcher,
  autoLoad = true,
  onSuccess,
  onError,
  deps = [],
}: UseDataOptions<T>): UseDataReturn<T> {
  const [data, setData] = useState<T | T[] | null>(null);
  const [state, setState] = useState<ViewState>('idle');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setState('loading');
    setError(null);
    
    try {
      const result = await fetcher();
      
      if (result.status === 'error') {
        setError(result.error);
        setState('error');
        if (onError) {
          onError(result.error || 'Error desconocido');
        }
        return;
      }
      
      setData(result.data);
      
      // Determinar si está vacío
      const isEmpty = Array.isArray(result.data)
        ? result.data.length === 0
        : !result.data;
      
      setState(isEmpty ? 'empty' : 'success');
      
      if (onSuccess && result.data) {
        onSuccess(result.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setState('error');
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    if (autoLoad) {
      load();
    }
  }, [autoLoad, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;

  return {
    data,
    state,
    error,
    isLoading: state === 'loading',
    isEmpty,
    reload: load,
    setData,
  };
}

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

/*
import { useData } from '@/core/hooks/useData';
import { dataAdapter } from '@/core/data';
import { StatePanel, TableSkeleton } from '@/core/ui/StatePanel';

function ObrasPage() {
  const { data, state, error, isEmpty, reload } = useData({
    fetcher: () => dataAdapter.listObras({ estatus: 'activa' }),
    autoLoad: true,
    onSuccess: (obras) => {
      console.log(`Cargadas ${obras.length} obras`);
    },
  });

  return (
    <StatePanel
      state={state}
      error={error}
      isEmpty={isEmpty}
      loadingSkeleton={<TableSkeleton />}
      emptyTitle="No hay obras activas"
      emptyAction={{
        label: "Crear Obra",
        onClick: () => console.log("crear")
      }}
      onRetry={reload}
    >
      <div className="grid grid-cols-3 gap-4">
        {(data as Obra[])?.map(obra => (
          <ObraCard key={obra.obra_id} obra={obra} />
        ))}
      </div>
    </StatePanel>
  );
}
*/
