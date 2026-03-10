// API CLIENT - Capa de comunicación con el servidor Supabase
// Todos los módulos usan esta capa para acceder a los datos

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4298db9c`;

// ==================== TIPOS DE RESPUESTA ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==================== FUNCIONES HELPER ====================

async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Error en la solicitud',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// ==================== API: OBRAS ====================

export const obrasApi = {
  getAll: () => apiRequest('/api/obras', 'GET'),
  getById: (obraId: string) => apiRequest(`/api/obras/${obraId}`, 'GET'),
  create: (obra: any) => apiRequest('/api/obras', 'POST', obra),
  update: (obraId: string, obra: any) => apiRequest(`/api/obras/${obraId}`, 'PUT', obra),
  delete: (obraId: string) => apiRequest(`/api/obras/${obraId}`, 'DELETE'),
};

// ==================== API: PROVEEDORES ====================

export const proveedoresApi = {
  getAll: () => apiRequest('/api/proveedores', 'GET'),
  getById: (proveedorId: string) => apiRequest(`/api/proveedores/${proveedorId}`, 'GET'),
  create: (proveedor: any) => apiRequest('/api/proveedores', 'POST', proveedor),
  update: (proveedorId: string, proveedor: any) => apiRequest(`/api/proveedores/${proveedorId}`, 'PUT', proveedor),
  delete: (proveedorId: string) => apiRequest(`/api/proveedores/${proveedorId}`, 'DELETE'),
};

// ==================== API: ÓRDENES DE COMPRA ====================

export const ordenesCompraApi = {
  getAll: () => apiRequest('/api/ordenes-compra', 'GET'),
  getByObra: (obraId: string) => apiRequest(`/api/ordenes-compra/obra/${obraId}`, 'GET'),
  getById: (ordenId: string) => apiRequest(`/api/ordenes-compra/${ordenId}`, 'GET'),
  create: (orden: any) => apiRequest('/api/ordenes-compra', 'POST', orden),
  update: (ordenId: string, orden: any) => apiRequest(`/api/ordenes-compra/${ordenId}`, 'PUT', orden),
  delete: (ordenId: string) => apiRequest(`/api/ordenes-compra/${ordenId}`, 'DELETE'),
  updateStatus: (ordenId: string, status: string) => apiRequest(`/api/ordenes-compra/${ordenId}/status`, 'PUT', { status }),
};

// ==================== API: FACTURAS ====================

export const facturasApi = {
  getAll: () => apiRequest('/api/facturas', 'GET'),
  getByObra: (obraId: string) => apiRequest(`/api/facturas/obra/${obraId}`, 'GET'),
  getById: (facturaId: string) => apiRequest(`/api/facturas/${facturaId}`, 'GET'),
  create: (factura: any) => apiRequest('/api/facturas', 'POST', factura),
  update: (facturaId: string, factura: any) => apiRequest(`/api/facturas/${facturaId}`, 'PUT', factura),
  delete: (facturaId: string) => apiRequest(`/api/facturas/${facturaId}`, 'DELETE'),
};

// ==================== API: PAGOS ====================

export const pagosApi = {
  getAll: () => apiRequest('/api/pagos', 'GET'),
  getByObra: (obraId: string) => apiRequest(`/api/pagos/obra/${obraId}`, 'GET'),
  getByWeek: (year: number, week: number) => apiRequest(`/api/pagos/semana/${year}/${week}`, 'GET'),
  getById: (pagoId: string) => apiRequest(`/api/pagos/${pagoId}`, 'GET'),
  create: (pago: any) => apiRequest('/api/pagos', 'POST', pago),
  update: (pagoId: string, pago: any) => apiRequest(`/api/pagos/${pagoId}`, 'PUT', pago),
  delete: (pagoId: string) => apiRequest(`/api/pagos/${pagoId}`, 'DELETE'),
  procesarPago: (pagoId: string) => apiRequest(`/api/pagos/${pagoId}/procesar`, 'POST'),
};

// ==================== API: DESTAJISTAS ====================

export const destajistasApi = {
  getAll: () => apiRequest('/api/destajistas', 'GET'),
  getById: (destajistaId: string) => apiRequest(`/api/destajistas/${destajistaId}`, 'GET'),
  create: (destajista: any) => apiRequest('/api/destajistas', 'POST', destajista),
  update: (destajistaId: string, destajista: any) => apiRequest(`/api/destajistas/${destajistaId}`, 'PUT', destajista),
  delete: (destajistaId: string) => apiRequest(`/api/destajistas/${destajistaId}`, 'DELETE'),
};

// ==================== API: AVANCES DE DESTAJOS ====================

export const avancesApi = {
  getAll: () => apiRequest('/api/avances', 'GET'),
  getByObra: (obraId: string) => apiRequest(`/api/avances/obra/${obraId}`, 'GET'),
  getByWeek: (year: number, week: number) => apiRequest(`/api/avances/semana/${year}/${week}`, 'GET'),
  getById: (avanceId: string) => apiRequest(`/api/avances/${avanceId}`, 'GET'),
  create: (avance: any) => apiRequest('/api/avances', 'POST', avance),
  update: (avanceId: string, avance: any) => apiRequest(`/api/avances/${avanceId}`, 'PUT', avance),
  delete: (avanceId: string) => apiRequest(`/api/avances/${avanceId}`, 'DELETE'),
};

// ==================== API: REQUISICIONES ====================

export const requisicionesApi = {
  getAll: () => apiRequest('/api/requisiciones', 'GET'),
  getByObra: (obraId: string) => apiRequest(`/api/requisiciones/obra/${obraId}`, 'GET'),
  getById: (requisicionId: string) => apiRequest(`/api/requisiciones/${requisicionId}`, 'GET'),
  create: (requisicion: any) => apiRequest('/api/requisiciones', 'POST', requisicion),
  update: (requisicionId: string, requisicion: any) => apiRequest(`/api/requisiciones/${requisicionId}`, 'PUT', requisicion),
  delete: (requisicionId: string) => apiRequest(`/api/requisiciones/${requisicionId}`, 'DELETE'),
  updateStatus: (requisicionId: string, status: string) => apiRequest(`/api/requisiciones/${requisicionId}/status`, 'PUT', { status }),
};

// ==================== API: ITEMS DE REQUISICIÓN ====================

export const itemsRequisicionApi = {
  getByRequisicion: (requisicionId: string) => apiRequest(`/api/requisiciones/${requisicionId}/items`, 'GET'),
  create: (requisicionId: string, item: any) => apiRequest(`/api/requisiciones/${requisicionId}/items`, 'POST', item),
  update: (requisicionId: string, itemId: string, item: any) => apiRequest(`/api/requisiciones/${requisicionId}/items/${itemId}`, 'PUT', item),
  delete: (requisicionId: string, itemId: string) => apiRequest(`/api/requisiciones/${requisicionId}/items/${itemId}`, 'DELETE'),
};
