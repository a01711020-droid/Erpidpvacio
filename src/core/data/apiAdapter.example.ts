/**
 * API ADAPTER - EJEMPLO DE IMPLEMENTACIÓN
 * 
 * Este archivo muestra cómo implementar el apiAdapter real
 * Renombrar a apiAdapter.ts cuando el backend esté listo
 */

import type {
  IDataAdapter,
  DataResponse,
  ListResponse,
} from './dataAdapter';
import {
  createSuccessResponse,
  createErrorResponse,
  createSuccessListResponse,
} from './dataAdapter';
import type {
  Obra,
  Proveedor,
  RequisicionMaterial,
  RequisicionMaterialItem,
  RequisicionComentario,
  OrdenCompra,
  OrdenCompraItem,
  Pago,
  Entrega,
  EntregaItem,
  MetricasObra,
  ResumenProveedorOC,
  EstadoRequisiciones,
  CreateObraDTO,
  UpdateObraDTO,
  CreateProveedorDTO,
  UpdateProveedorDTO,
  CreateRequisicionDTO,
  CreateOrdenCompraDTO,
  CreatePagoDTO,
} from './types';
import { API_BASE_URL, API_TIMEOUT } from '../config';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper para hacer requests HTTP
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ status: string; data: T | null; error: string | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          status: 'error',
          data: null,
          error: 'Request timeout - el servidor tardó demasiado en responder',
        };
      }
      return {
        status: 'error',
        data: null,
        error: error.message,
      };
    }
    
    return {
      status: 'error',
      data: null,
      error: 'Error desconocido al conectar con el servidor',
    };
  }
}

// ============================================================================
// API ADAPTER IMPLEMENTATION
// ============================================================================

export class ApiDataAdapter implements IDataAdapter {
  // ==========================================================================
  // OBRAS
  // ==========================================================================

  async listObras(filters?: { estatus?: string }): Promise<ListResponse<Obra>> {
    const params = new URLSearchParams();
    if (filters?.estatus) params.set('estatus', filters.estatus);
    
    const result = await fetchAPI<Obra[]>(`/obras?${params}`);
    
    if (result.status === 'error') {
      return {
        status: 'error',
        data: [],
        error: result.error,
      };
    }
    
    return createSuccessListResponse(result.data || []);
  }

  async getObra(obraId: string): Promise<DataResponse<Obra>> {
    const result = await fetchAPI<Obra>(`/obras/${obraId}`);
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener obra');
    }
    
    return createSuccessResponse(result.data!);
  }

  async createObra(data: CreateObraDTO): Promise<DataResponse<Obra>> {
    const result = await fetchAPI<Obra>('/obras', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al crear obra');
    }
    
    return createSuccessResponse(result.data!);
  }

  async updateObra(obraId: string, data: UpdateObraDTO): Promise<DataResponse<Obra>> {
    const result = await fetchAPI<Obra>(`/obras/${obraId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al actualizar obra');
    }
    
    return createSuccessResponse(result.data!);
  }

  async deleteObra(obraId: string): Promise<DataResponse<void>> {
    const result = await fetchAPI<void>(`/obras/${obraId}`, {
      method: 'DELETE',
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al eliminar obra');
    }
    
    return createSuccessResponse(undefined as void);
  }

  // ==========================================================================
  // PROVEEDORES
  // ==========================================================================

  async listProveedores(filters?: {
    activo?: boolean;
    tipo?: string;
  }): Promise<ListResponse<Proveedor>> {
    const params = new URLSearchParams();
    if (filters?.activo !== undefined) params.set('activo', String(filters.activo));
    if (filters?.tipo) params.set('tipo', filters.tipo);
    
    const result = await fetchAPI<Proveedor[]>(`/proveedores?${params}`);
    
    if (result.status === 'error') {
      return {
        status: 'error',
        data: [],
        error: result.error,
      };
    }
    
    return createSuccessListResponse(result.data || []);
  }

  async getProveedor(proveedorId: string): Promise<DataResponse<Proveedor>> {
    const result = await fetchAPI<Proveedor>(`/proveedores/${proveedorId}`);
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener proveedor');
    }
    
    return createSuccessResponse(result.data!);
  }

  async createProveedor(data: CreateProveedorDTO): Promise<DataResponse<Proveedor>> {
    const result = await fetchAPI<Proveedor>('/proveedores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al crear proveedor');
    }
    
    return createSuccessResponse(result.data!);
  }

  async updateProveedor(
    proveedorId: string,
    data: UpdateProveedorDTO
  ): Promise<DataResponse<Proveedor>> {
    const result = await fetchAPI<Proveedor>(`/proveedores/${proveedorId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al actualizar proveedor');
    }
    
    return createSuccessResponse(result.data!);
  }

  async deactivateProveedor(proveedorId: string): Promise<DataResponse<void>> {
    const result = await fetchAPI<void>(`/proveedores/${proveedorId}/deactivate`, {
      method: 'POST',
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al desactivar proveedor');
    }
    
    return createSuccessResponse(undefined as void);
  }

  // ==========================================================================
  // REQUISICIONES
  // ==========================================================================

  async listRequisiciones(filters?: {
    obra_id?: string;
    estatus?: string;
    urgencia?: string;
  }): Promise<ListResponse<RequisicionMaterial>> {
    const params = new URLSearchParams();
    if (filters?.obra_id) params.set('obra_id', filters.obra_id);
    if (filters?.estatus) params.set('estatus', filters.estatus);
    if (filters?.urgencia) params.set('urgencia', filters.urgencia);
    
    const result = await fetchAPI<RequisicionMaterial[]>(`/requisiciones?${params}`);
    
    if (result.status === 'error') {
      return {
        status: 'error',
        data: [],
        error: result.error,
      };
    }
    
    return createSuccessListResponse(result.data || []);
  }

  async getRequisicion(requisicionId: string): Promise<DataResponse<{
    requisicion: RequisicionMaterial;
    items: RequisicionMaterialItem[];
    comentarios: RequisicionComentario[];
  }>> {
    const result = await fetchAPI<{
      requisicion: RequisicionMaterial;
      items: RequisicionMaterialItem[];
      comentarios: RequisicionComentario[];
    }>(`/requisiciones/${requisicionId}`);
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener requisición');
    }
    
    return createSuccessResponse(result.data!);
  }

  async createRequisicion(data: CreateRequisicionDTO): Promise<DataResponse<RequisicionMaterial>> {
    const result = await fetchAPI<RequisicionMaterial>('/requisiciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al crear requisición');
    }
    
    return createSuccessResponse(result.data!);
  }

  async updateRequisicionEstatus(
    requisicionId: string,
    estatus: string
  ): Promise<DataResponse<RequisicionMaterial>> {
    const result = await fetchAPI<RequisicionMaterial>(
      `/requisiciones/${requisicionId}/estatus`,
      {
        method: 'PUT',
        body: JSON.stringify({ estatus }),
      }
    );
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al actualizar estatus');
    }
    
    return createSuccessResponse(result.data!);
  }

  async addComentarioRequisicion(
    requisicionId: string,
    autor: string,
    rol: string,
    mensaje: string
  ): Promise<DataResponse<RequisicionComentario>> {
    const result = await fetchAPI<RequisicionComentario>(
      `/requisiciones/${requisicionId}/comentarios`,
      {
        method: 'POST',
        body: JSON.stringify({ autor, rol, mensaje }),
      }
    );
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al agregar comentario');
    }
    
    return createSuccessResponse(result.data!);
  }

  // ==========================================================================
  // ÓRDENES DE COMPRA
  // ==========================================================================

  async listOrdenesCompra(filters?: {
    obra_id?: string;
    proveedor_id?: string;
    estatus?: string;
  }): Promise<ListResponse<OrdenCompra>> {
    const params = new URLSearchParams();
    if (filters?.obra_id) params.set('obra_id', filters.obra_id);
    if (filters?.proveedor_id) params.set('proveedor_id', filters.proveedor_id);
    if (filters?.estatus) params.set('estatus', filters.estatus);
    
    const result = await fetchAPI<OrdenCompra[]>(`/ordenes-compra?${params}`);
    
    if (result.status === 'error') {
      return {
        status: 'error',
        data: [],
        error: result.error,
      };
    }
    
    return createSuccessListResponse(result.data || []);
  }

  async getOrdenCompra(ocId: string): Promise<DataResponse<{
    orden: OrdenCompra;
    items: OrdenCompraItem[];
  }>> {
    const result = await fetchAPI<{
      orden: OrdenCompra;
      items: OrdenCompraItem[];
    }>(`/ordenes-compra/${ocId}`);
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener orden de compra');
    }
    
    return createSuccessResponse(result.data!);
  }

  async createOrdenCompra(data: CreateOrdenCompraDTO): Promise<DataResponse<OrdenCompra>> {
    const result = await fetchAPI<OrdenCompra>('/ordenes-compra', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al crear orden de compra');
    }
    
    return createSuccessResponse(result.data!);
  }

  async updateOrdenCompraEstatus(ocId: string, estatus: string): Promise<DataResponse<OrdenCompra>> {
    const result = await fetchAPI<OrdenCompra>(`/ordenes-compra/${ocId}/estatus`, {
      method: 'PUT',
      body: JSON.stringify({ estatus }),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al actualizar estatus');
    }
    
    return createSuccessResponse(result.data!);
  }

  async cancelOrdenCompra(ocId: string, motivo?: string): Promise<DataResponse<void>> {
    const result = await fetchAPI<void>(`/ordenes-compra/${ocId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ motivo }),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al cancelar orden');
    }
    
    return createSuccessResponse(undefined as void);
  }

  // ==========================================================================
  // PAGOS
  // ==========================================================================

  async listPagos(filters?: {
    obra_id?: string;
    oc_id?: string;
    proveedor_id?: string;
  }): Promise<ListResponse<Pago>> {
    const params = new URLSearchParams();
    if (filters?.obra_id) params.set('obra_id', filters.obra_id);
    if (filters?.oc_id) params.set('oc_id', filters.oc_id);
    if (filters?.proveedor_id) params.set('proveedor_id', filters.proveedor_id);
    
    const result = await fetchAPI<Pago[]>(`/pagos?${params}`);
    
    if (result.status === 'error') {
      return {
        status: 'error',
        data: [],
        error: result.error,
      };
    }
    
    return createSuccessListResponse(result.data || []);
  }

  async getPago(pagoId: string): Promise<DataResponse<Pago>> {
    const result = await fetchAPI<Pago>(`/pagos/${pagoId}`);
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener pago');
    }
    
    return createSuccessResponse(result.data!);
  }

  async createPago(data: CreatePagoDTO): Promise<DataResponse<Pago>> {
    const result = await fetchAPI<Pago>('/pagos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al crear pago');
    }
    
    return createSuccessResponse(result.data!);
  }

  async cancelPago(pagoId: string, motivo?: string): Promise<DataResponse<void>> {
    const result = await fetchAPI<void>(`/pagos/${pagoId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ motivo }),
    });
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al cancelar pago');
    }
    
    return createSuccessResponse(undefined as void);
  }

  // ==========================================================================
  // ENTREGAS
  // ==========================================================================

  async listEntregas(filters?: {
    obra_id?: string;
    oc_id?: string;
  }): Promise<ListResponse<Entrega>> {
    const params = new URLSearchParams();
    if (filters?.obra_id) params.set('obra_id', filters.obra_id);
    if (filters?.oc_id) params.set('oc_id', filters.oc_id);
    
    const result = await fetchAPI<Entrega[]>(`/entregas?${params}`);
    
    if (result.status === 'error') {
      return {
        status: 'error',
        data: [],
        error: result.error,
      };
    }
    
    return createSuccessListResponse(result.data || []);
  }

  async getEntrega(entregaId: string): Promise<DataResponse<{
    entrega: Entrega;
    items: EntregaItem[];
  }>> {
    const result = await fetchAPI<{
      entrega: Entrega;
      items: EntregaItem[];
    }>(`/entregas/${entregaId}`);
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener entrega');
    }
    
    return createSuccessResponse(result.data!);
  }

  // ==========================================================================
  // MÉTRICAS Y DASHBOARDS
  // ==========================================================================

  async getMetricasObra(obraId: string): Promise<DataResponse<MetricasObra>> {
    const result = await fetchAPI<MetricasObra>(`/metricas/obras/${obraId}`);
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener métricas');
    }
    
    return createSuccessResponse(result.data!);
  }

  async getAllMetricasObras(): Promise<ListResponse<MetricasObra>> {
    const result = await fetchAPI<MetricasObra[]>('/metricas/obras');
    
    if (result.status === 'error') {
      return {
        status: 'error',
        data: [],
        error: result.error,
      };
    }
    
    return createSuccessListResponse(result.data || []);
  }

  async getResumenProveedorOC(proveedorId: string): Promise<DataResponse<ResumenProveedorOC>> {
    const result = await fetchAPI<ResumenProveedorOC>(`/metricas/proveedores/${proveedorId}`);
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener resumen');
    }
    
    return createSuccessResponse(result.data!);
  }

  async getEstadoRequisiciones(obraId?: string): Promise<ListResponse<EstadoRequisiciones>> {
    const params = new URLSearchParams();
    if (obraId) params.set('obra_id', obraId);
    
    const result = await fetchAPI<EstadoRequisiciones[]>(`/metricas/requisiciones?${params}`);
    
    if (result.status === 'error') {
      return {
        status: 'error',
        data: [],
        error: result.error,
      };
    }
    
    return createSuccessListResponse(result.data || []);
  }

  async getDashboardGlobal(): Promise<DataResponse<{
    total_obras_activas: number;
    total_presupuesto: number;
    total_comprometido: number;
    total_pagado: number;
    total_por_pagar: number;
    requisiciones_pendientes: number;
    ordenes_pendientes: number;
  }>> {
    const result = await fetchAPI<{
      total_obras_activas: number;
      total_presupuesto: number;
      total_comprometido: number;
      total_pagado: number;
      total_por_pagar: number;
      requisiciones_pendientes: number;
      ordenes_pendientes: number;
    }>('/dashboard/global');
    
    if (result.status === 'error') {
      return createErrorResponse(result.error || 'Error al obtener dashboard');
    }
    
    return createSuccessResponse(result.data!);
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const apiAdapter = new ApiDataAdapter();
