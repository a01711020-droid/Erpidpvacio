/**
 * INTERFAZ ÚNICA DEL DATA PROVIDER
 * Define el contrato para todos los providers (API y Mock)
 * 
 * REGLAS:
 * - Usa el modelo unificado de entities.ts
 * - Métodos CRUD estándar (list, get, create, update, delete)
 * - Respuestas paginadas
 * - Sin traducciones, sin conversiones
 */

import type {
  Obra,
  ObraCreate,
  ObraUpdate,
  Proveedor,
  ProveedorCreate,
  ProveedorUpdate,
  Requisicion,
  RequisicionCreate,
  RequisicionUpdate,
  OrdenCompra,
  OrdenCompraCreate,
  OrdenCompraUpdate,
  Pago,
  PagoCreate,
  PagoUpdate,
  PaginatedResponse,
  ListParams,
} from '../types/entities';

/**
 * Interfaz principal del Data Provider
 * Implementada por ApiProvider y MockProvider
 */
export interface IDataProvider {
  // ===== OBRAS =====
  listObras(params?: ListParams): Promise<PaginatedResponse<Obra>>;
  getObra(id: string): Promise<Obra>;
  createObra(data: ObraCreate): Promise<Obra>;
  updateObra(id: string, data: ObraUpdate): Promise<Obra>;
  deleteObra(id: string): Promise<void>;

  // ===== PROVEEDORES =====
  listProveedores(params?: ListParams): Promise<PaginatedResponse<Proveedor>>;
  getProveedor(id: string): Promise<Proveedor>;
  createProveedor(data: ProveedorCreate): Promise<Proveedor>;
  updateProveedor(id: string, data: ProveedorUpdate): Promise<Proveedor>;
  deleteProveedor(id: string): Promise<void>;

  // ===== REQUISICIONES =====
  listRequisiciones(params?: ListParams): Promise<PaginatedResponse<Requisicion>>;
  getRequisicion(id: string): Promise<Requisicion>;
  createRequisicion(data: RequisicionCreate): Promise<Requisicion>;
  updateRequisicion(id: string, data: RequisicionUpdate): Promise<Requisicion>;
  deleteRequisicion(id: string): Promise<void>;

  // ===== ÓRDENES DE COMPRA =====
  listOrdenesCompra(params?: ListParams): Promise<PaginatedResponse<OrdenCompra>>;
  getOrdenCompra(id: string): Promise<OrdenCompra>;
  createOrdenCompra(data: OrdenCompraCreate): Promise<OrdenCompra>;
  updateOrdenCompra(id: string, data: OrdenCompraUpdate): Promise<OrdenCompra>;
  deleteOrdenCompra(id: string): Promise<void>;

  // ===== PAGOS =====
  listPagos(params?: ListParams): Promise<PaginatedResponse<Pago>>;
  getPago(id: string): Promise<Pago>;
  createPago(data: PagoCreate): Promise<Pago>;
  updatePago(id: string, data: PagoUpdate): Promise<Pago>;
  deletePago(id: string): Promise<void>;
}
