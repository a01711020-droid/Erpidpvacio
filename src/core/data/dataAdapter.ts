/**
 * DATA ADAPTER INTERFACE
 * 
 * Interfaz unificada para acceso a datos
 * El frontend solo debe usar esta interfaz
 * La implementación puede ser Mock o API real
 */

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

// ============================================================================
// TIPOS DE RESPUESTA ESTÁNDAR
// ============================================================================

export type DataStatus = 'idle' | 'loading' | 'success' | 'error';

export interface DataResponse<T> {
  status: DataStatus;
  data: T | null;
  error: string | null;
}

export interface ListResponse<T> {
  status: DataStatus;
  data: T[];
  error: string | null;
  total?: number;
}

// ============================================================================
// INTERFAZ PRINCIPAL DEL DATA ADAPTER
// ============================================================================

export interface IDataAdapter {
  // ==========================================================================
  // OBRAS
  // ==========================================================================
  
  /**
   * Obtener todas las obras
   * @param filters - Filtros opcionales (estatus, etc.)
   */
  listObras(filters?: { estatus?: string }): Promise<ListResponse<Obra>>;
  
  /**
   * Obtener una obra por ID
   */
  getObra(obraId: string): Promise<DataResponse<Obra>>;
  
  /**
   * Crear nueva obra
   */
  createObra(data: CreateObraDTO): Promise<DataResponse<Obra>>;
  
  /**
   * Actualizar obra existente
   */
  updateObra(obraId: string, data: UpdateObraDTO): Promise<DataResponse<Obra>>;
  
  /**
   * Eliminar obra
   */
  deleteObra(obraId: string): Promise<DataResponse<void>>;

  // ==========================================================================
  // PROVEEDORES
  // ==========================================================================
  
  /**
   * Obtener todos los proveedores
   * @param filters - Filtros opcionales (activo, tipo, etc.)
   */
  listProveedores(filters?: { activo?: boolean; tipo?: string }): Promise<ListResponse<Proveedor>>;
  
  /**
   * Obtener un proveedor por ID
   */
  getProveedor(proveedorId: string): Promise<DataResponse<Proveedor>>;
  
  /**
   * Crear nuevo proveedor
   */
  createProveedor(data: CreateProveedorDTO): Promise<DataResponse<Proveedor>>;
  
  /**
   * Actualizar proveedor existente
   */
  updateProveedor(proveedorId: string, data: UpdateProveedorDTO): Promise<DataResponse<Proveedor>>;
  
  /**
   * Desactivar proveedor (soft delete)
   */
  deactivateProveedor(proveedorId: string): Promise<DataResponse<void>>;

  // ==========================================================================
  // REQUISICIONES
  // ==========================================================================
  
  /**
   * Listar requisiciones
   * @param filters - obra_id, estatus, urgencia
   */
  listRequisiciones(filters?: {
    obra_id?: string;
    estatus?: string;
    urgencia?: string;
  }): Promise<ListResponse<RequisicionMaterial>>;
  
  /**
   * Obtener requisición con sus items
   */
  getRequisicion(requisicionId: string): Promise<DataResponse<{
    requisicion: RequisicionMaterial;
    items: RequisicionMaterialItem[];
    comentarios: RequisicionComentario[];
  }>>;
  
  /**
   * Crear nueva requisición
   */
  createRequisicion(data: CreateRequisicionDTO): Promise<DataResponse<RequisicionMaterial>>;
  
  /**
   * Actualizar estatus de requisición
   */
  updateRequisicionEstatus(
    requisicionId: string,
    estatus: string
  ): Promise<DataResponse<RequisicionMaterial>>;
  
  /**
   * Agregar comentario a requisición
   */
  addComentarioRequisicion(
    requisicionId: string,
    autor: string,
    rol: string,
    mensaje: string
  ): Promise<DataResponse<RequisicionComentario>>;

  // ==========================================================================
  // ÓRDENES DE COMPRA
  // ==========================================================================
  
  /**
   * Listar órdenes de compra
   * @param filters - obra_id, proveedor_id, estatus
   */
  listOrdenesCompra(filters?: {
    obra_id?: string;
    proveedor_id?: string;
    estatus?: string;
  }): Promise<ListResponse<OrdenCompra>>;
  
  /**
   * Obtener orden de compra con sus items
   */
  getOrdenCompra(ocId: string): Promise<DataResponse<{
    orden: OrdenCompra;
    items: OrdenCompraItem[];
  }>>;
  
  /**
   * Crear nueva orden de compra
   */
  createOrdenCompra(data: CreateOrdenCompraDTO): Promise<DataResponse<OrdenCompra>>;
  
  /**
   * Actualizar estatus de OC
   */
  updateOrdenCompraEstatus(ocId: string, estatus: string): Promise<DataResponse<OrdenCompra>>;
  
  /**
   * Cancelar orden de compra
   */
  cancelOrdenCompra(ocId: string, motivo?: string): Promise<DataResponse<void>>;

  // ==========================================================================
  // PAGOS
  // ==========================================================================
  
  /**
   * Listar pagos
   * @param filters - obra_id, oc_id, proveedor_id
   */
  listPagos(filters?: {
    obra_id?: string;
    oc_id?: string;
    proveedor_id?: string;
  }): Promise<ListResponse<Pago>>;
  
  /**
   * Obtener pago por ID
   */
  getPago(pagoId: string): Promise<DataResponse<Pago>>;
  
  /**
   * Registrar nuevo pago
   */
  createPago(data: CreatePagoDTO): Promise<DataResponse<Pago>>;
  
  /**
   * Cancelar pago
   */
  cancelPago(pagoId: string, motivo?: string): Promise<DataResponse<void>>;

  // ==========================================================================
  // ENTREGAS (FUTURO)
  // ==========================================================================
  
  /**
   * Listar entregas
   */
  listEntregas(filters?: { obra_id?: string; oc_id?: string }): Promise<ListResponse<Entrega>>;
  
  /**
   * Obtener entrega con detalle
   */
  getEntrega(entregaId: string): Promise<DataResponse<{
    entrega: Entrega;
    items: EntregaItem[];
  }>>;

  // ==========================================================================
  // MÉTRICAS Y DASHBOARDS
  // ==========================================================================
  
  /**
   * Obtener métricas financieras de una obra
   */
  getMetricasObra(obraId: string): Promise<DataResponse<MetricasObra>>;
  
  /**
   * Obtener métricas de todas las obras
   */
  getAllMetricasObras(): Promise<ListResponse<MetricasObra>>;
  
  /**
   * Resumen de OCs por proveedor
   */
  getResumenProveedorOC(proveedorId: string): Promise<DataResponse<ResumenProveedorOC>>;
  
  /**
   * Estado de requisiciones por obra
   */
  getEstadoRequisiciones(obraId?: string): Promise<ListResponse<EstadoRequisiciones>>;
  
  /**
   * Dashboard global - métricas consolidadas
   */
  getDashboardGlobal(): Promise<DataResponse<{
    total_obras_activas: number;
    total_presupuesto: number;
    total_comprometido: number;
    total_pagado: number;
    total_por_pagar: number;
    requisiciones_pendientes: number;
    ordenes_pendientes: number;
  }>>;
}

// ============================================================================
// HELPER: Función para crear respuestas vacías/loading
// ============================================================================

export function createLoadingResponse<T>(): DataResponse<T> {
  return {
    status: 'loading',
    data: null,
    error: null,
  };
}

export function createSuccessResponse<T>(data: T): DataResponse<T> {
  return {
    status: 'success',
    data,
    error: null,
  };
}

export function createErrorResponse<T>(error: string): DataResponse<T> {
  return {
    status: 'error',
    data: null,
    error,
  };
}

export function createEmptyListResponse<T>(): ListResponse<T> {
  return {
    status: 'success',
    data: [],
    error: null,
    total: 0,
  };
}

export function createSuccessListResponse<T>(data: T[], total?: number): ListResponse<T> {
  return {
    status: 'success',
    data,
    error: null,
    total: total ?? data.length,
  };
}
