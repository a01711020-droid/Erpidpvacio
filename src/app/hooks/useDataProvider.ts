/**
 * HOOKS PERSONALIZADOS PARA EL DATA PROVIDER
 * Facilita el uso del dataProvider en componentes React
 */

import { useState, useEffect, useCallback } from "react";
import { dataProvider } from "@/app/providers";
import type {
  Obra,
  Proveedor,
  Requisicion,
  OrdenCompra,
  Pago,
  Destajo,
  Usuario,
  PaginatedResponse,
  ListParams,
  ObraFinancialSummary,
  ExpenseByCategory,
  WeeklyExpense,
} from "@/app/providers";

// ============================================================================
// TIPOS DE ESTADO GENÉRICO
// ============================================================================

interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface ListState<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: Error | null;
}

// ============================================================================
// HOOK GENÉRICO PARA OBTENER UN ITEM POR ID
// ============================================================================

export function useDataItem<T>(
  fetcher: (id: string) => Promise<T>,
  id: string | null
): DataState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<DataState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!id) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetcher(id);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      console.error("Error fetching data:", error);
    }
  }, [id, fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// ============================================================================
// HOOK GENÉRICO PARA LISTAR ITEMS
// ============================================================================

export function useDataList<T>(
  fetcher: (params?: ListParams) => Promise<PaginatedResponse<T>>,
  params?: ListParams
): ListState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ListState<T>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetcher(params);
      setState({
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error as Error }));
      console.error("Error fetching list:", error);
    }
  }, [fetcher, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// ============================================================================
// HOOKS ESPECÍFICOS POR ENTIDAD
// ============================================================================

// ---------- OBRAS ----------

export function useObra(id: string | null) {
  return useDataItem(dataProvider.obras.getById, id);
}

export function useObras(params?: ListParams) {
  return useDataList(dataProvider.obras.list, params);
}

export function useObraFinancialSummary(id: string | null): DataState<ObraFinancialSummary> & { refetch: () => Promise<void> } {
  return useDataItem(dataProvider.obras.getFinancialSummary, id);
}

export function useObraExpensesByCategory(id: string | null): DataState<ExpenseByCategory[]> & { refetch: () => Promise<void> } {
  return useDataItem(dataProvider.obras.getExpensesByCategory, id);
}

export function useObraWeeklyExpenses(id: string | null): DataState<WeeklyExpense[]> & { refetch: () => Promise<void> } {
  return useDataItem(dataProvider.obras.getWeeklyExpenses, id);
}

// ---------- PROVEEDORES ----------

export function useProveedor(id: string | null) {
  return useDataItem(dataProvider.proveedores.getById, id);
}

export function useProveedores(params?: ListParams) {
  return useDataList(dataProvider.proveedores.list, params);
}

// ---------- REQUISICIONES ----------

export function useRequisicion(id: string | null) {
  return useDataItem(dataProvider.requisiciones.getById, id);
}

export function useRequisiciones(params?: ListParams) {
  return useDataList(dataProvider.requisiciones.list, params);
}

// ---------- ÓRDENES DE COMPRA ----------

export function useOrdenCompra(id: string | null) {
  return useDataItem(dataProvider.ordenesCompra.getById, id);
}

export function useOrdenesCompra(params?: ListParams) {
  return useDataList(dataProvider.ordenesCompra.list, params);
}

// ---------- PAGOS ----------

export function usePago(id: string | null) {
  return useDataItem(dataProvider.pagos.getById, id);
}

export function usePagos(params?: ListParams) {
  return useDataList(dataProvider.pagos.list, params);
}

// ---------- DESTAJOS ----------

export function useDestajo(id: string | null) {
  return useDataItem(dataProvider.destajos.getById, id);
}

export function useDestajos(params?: ListParams) {
  return useDataList(dataProvider.destajos.list, params);
}

// ---------- USUARIOS ----------

export function useUsuario(id: string | null) {
  return useDataItem(dataProvider.usuarios.getById, id);
}

export function useUsuarios(params?: ListParams) {
  return useDataList(dataProvider.usuarios.list, params);
}

// ============================================================================
// HOOK PARA MUTACIONES (CREATE, UPDATE, DELETE)
// ============================================================================

interface MutationState {
  loading: boolean;
  error: Error | null;
}

export function useMutation<TInput, TOutput>(
  mutator: (input: TInput) => Promise<TOutput>
) {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      setState({ loading: true, error: null });
      try {
        const result = await mutator(input);
        setState({ loading: false, error: null });
        return result;
      } catch (error) {
        setState({ loading: false, error: error as Error });
        console.error("Mutation error:", error);
        return null;
      }
    },
    [mutator]
  );

  return { ...state, mutate };
}

// ============================================================================
// EJEMPLOS DE USO DE MUTACIONES
// ============================================================================

// Crear obra
export function useCreateObra() {
  return useMutation(dataProvider.obras.create);
}

// Actualizar obra
export function useUpdateObra() {
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Obra> }) =>
      dataProvider.obras.update(id, data)
  );
}

// Crear requisición
export function useCreateRequisicion() {
  return useMutation(dataProvider.requisiciones.create);
}

// Aprobar requisición
export function useApproveRequisicion() {
  return useMutation(
    ({ id, approvedBy }: { id: string; approvedBy: string }) =>
      dataProvider.requisiciones.approve(id, approvedBy)
  );
}

// Crear orden de compra
export function useCreateOrdenCompra() {
  return useMutation(dataProvider.ordenesCompra.create);
}

// Crear pago
export function useCreatePago() {
  return useMutation(dataProvider.pagos.create);
}

// Procesar pago
export function useProcessPago() {
  return useMutation(
    ({ id, processedBy }: { id: string; processedBy: string }) =>
      dataProvider.pagos.process(id, processedBy)
  );
}
