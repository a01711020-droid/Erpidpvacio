/**
 * MOCK PROVIDER - Datos de prueba en memoria
 * 
 * REGLAS:
 * - Usa el modelo unificado (codigo, nombre, estado)
 * - Solo para desarrollo/testing
 * - Sin persistencia
 * - Activar solo con VITE_DATA_MODE=mock
 */

import type { IDataProvider } from './DataProvider.interface';
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
import { v4 as uuidv4 } from 'uuid';

/**
 * Datos mock en memoria
 */
const mockObras: Obra[] = [];
const mockProveedores: Proveedor[] = [];
const mockRequisiciones: Requisicion[] = [];
const mockOrdenesCompra: OrdenCompra[] = [];
const mockPagos: Pago[] = [];

/**
 * Helper para paginar resultados
 */
function paginate<T>(
  data: T[],
  params?: ListParams
): PaginatedResponse<T> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const paginatedData = data.slice(startIndex, endIndex);
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Helper para buscar por ID
 */
function findById<T extends { id: string }>(
  data: T[],
  id: string,
  entity: string
): T {
  const item = data.find(item => item.id === id);
  if (!item) {
    throw new Error(`${entity} con ID ${id} no encontrado`);
  }
  return item;
}

/**
 * Implementación del MockProvider
 */
export class MockProvider implements IDataProvider {
  // ===== OBRAS =====
  async listObras(params?: ListParams): Promise<PaginatedResponse<Obra>> {
    return paginate(mockObras, params);
  }

  async getObra(id: string): Promise<Obra> {
    return findById(mockObras, id, 'Obra');
  }

  async createObra(data: ObraCreate): Promise<Obra> {
    const newObra: Obra = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockObras.push(newObra);
    return newObra;
  }

  async updateObra(id: string, data: ObraUpdate): Promise<Obra> {
    const index = mockObras.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Obra con ID ${id} no encontrada`);
    
    mockObras[index] = {
      ...mockObras[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockObras[index];
  }

  async deleteObra(id: string): Promise<void> {
    const index = mockObras.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`Obra con ID ${id} no encontrada`);
    mockObras.splice(index, 1);
  }

  // ===== PROVEEDORES =====
  async listProveedores(params?: ListParams): Promise<PaginatedResponse<Proveedor>> {
    return paginate(mockProveedores, params);
  }

  async getProveedor(id: string): Promise<Proveedor> {
    return findById(mockProveedores, id, 'Proveedor');
  }

  async createProveedor(data: ProveedorCreate): Promise<Proveedor> {
    const newProveedor: Proveedor = {
      id: uuidv4(),
      nombreComercial: null,
      direccion: null,
      ciudad: null,
      codigoPostal: null,
      telefono: null,
      email: null,
      contactoPrincipal: null,
      banco: null,
      numeroCuenta: null,
      clabe: null,
      tipoProveedor: null,
      creditoDias: 0,
      limiteCredito: 0,
      activo: true,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProveedores.push(newProveedor);
    return newProveedor;
  }

  async updateProveedor(id: string, data: ProveedorUpdate): Promise<Proveedor> {
    const index = mockProveedores.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Proveedor con ID ${id} no encontrado`);
    
    mockProveedores[index] = {
      ...mockProveedores[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockProveedores[index];
  }

  async deleteProveedor(id: string): Promise<void> {
    const index = mockProveedores.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Proveedor con ID ${id} no encontrado`);
    mockProveedores.splice(index, 1);
  }

  // ===== REQUISICIONES =====
  async listRequisiciones(params?: ListParams): Promise<PaginatedResponse<Requisicion>> {
    return paginate(mockRequisiciones, params);
  }

  async getRequisicion(id: string): Promise<Requisicion> {
    return findById(mockRequisiciones, id, 'Requisicion');
  }

  async createRequisicion(data: RequisicionCreate): Promise<Requisicion> {
    const newRequisicion: Requisicion = {
      id: uuidv4(),
      ...data,
      fechaSolicitud: new Date().toISOString(),
      items: data.items.map(item => ({
        ...item,
        id: uuidv4(),
        requisicionId: '', // Se actualizará después
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Actualizar requisicionId en los items
    newRequisicion.items.forEach(item => {
      item.requisicionId = newRequisicion.id;
    });
    
    mockRequisiciones.push(newRequisicion);
    return newRequisicion;
  }

  async updateRequisicion(id: string, data: RequisicionUpdate): Promise<Requisicion> {
    const index = mockRequisiciones.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Requisicion con ID ${id} no encontrada`);
    
    mockRequisiciones[index] = {
      ...mockRequisiciones[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockRequisiciones[index];
  }

  async deleteRequisicion(id: string): Promise<void> {
    const index = mockRequisiciones.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Requisicion con ID ${id} no encontrada`);
    mockRequisiciones.splice(index, 1);
  }

  // ===== ÓRDENES DE COMPRA =====
  async listOrdenesCompra(params?: ListParams): Promise<PaginatedResponse<OrdenCompra>> {
    return paginate(mockOrdenesCompra, params);
  }

  async getOrdenCompra(id: string): Promise<OrdenCompra> {
    return findById(mockOrdenesCompra, id, 'OrdenCompra');
  }

  async createOrdenCompra(data: OrdenCompraCreate): Promise<OrdenCompra> {
    const newOrdenCompra: OrdenCompra = {
      id: uuidv4(),
      ...data,
      fechaEmision: new Date().toISOString(),
      items: data.items.map(item => ({
        ...item,
        id: uuidv4(),
        ordenCompraId: '', // Se actualizará después
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Actualizar ordenCompraId en los items
    newOrdenCompra.items.forEach(item => {
      item.ordenCompraId = newOrdenCompra.id;
    });
    
    mockOrdenesCompra.push(newOrdenCompra);
    return newOrdenCompra;
  }

  async updateOrdenCompra(id: string, data: OrdenCompraUpdate): Promise<OrdenCompra> {
    const index = mockOrdenesCompra.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`OrdenCompra con ID ${id} no encontrada`);
    
    mockOrdenesCompra[index] = {
      ...mockOrdenesCompra[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockOrdenesCompra[index];
  }

  async deleteOrdenCompra(id: string): Promise<void> {
    const index = mockOrdenesCompra.findIndex(o => o.id === id);
    if (index === -1) throw new Error(`OrdenCompra con ID ${id} no encontrada`);
    mockOrdenesCompra.splice(index, 1);
  }

  // ===== PAGOS =====
  async listPagos(params?: ListParams): Promise<PaginatedResponse<Pago>> {
    return paginate(mockPagos, params);
  }

  async getPago(id: string): Promise<Pago> {
    return findById(mockPagos, id, 'Pago');
  }

  async createPago(data: PagoCreate): Promise<Pago> {
    const newPago: Pago = {
      id: uuidv4(),
      ...data,
      fechaProcesado: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPagos.push(newPago);
    return newPago;
  }

  async updatePago(id: string, data: PagoUpdate): Promise<Pago> {
    const index = mockPagos.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Pago con ID ${id} no encontrado`);
    
    mockPagos[index] = {
      ...mockPagos[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockPagos[index];
  }

  async deletePago(id: string): Promise<void> {
    const index = mockPagos.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Pago con ID ${id} no encontrado`);
    mockPagos.splice(index, 1);
  }
}

/**
 * Instancia singleton del MockProvider
 */
export const mockProvider = new MockProvider();
