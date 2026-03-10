/**
 * TYPES - Domain Models
 * 
 * Tipos del dominio que espejean el schema SQL
 * Estos son los tipos que usa toda la aplicación
 */

// ============================================================================
// CATÁLOGOS BASE
// ============================================================================

export interface Obra {
  obra_id: string;
  codigo_obra: string;
  nombre_obra: string;
  cliente: string;
  residente: string | null;
  direccion: string | null;
  fecha_inicio: string | null;
  fecha_fin_estimada: string | null;
  presupuesto_total: number;
  estatus: 'activa' | 'pausada' | 'terminada' | 'cancelada';
  created_at: string;
  updated_at: string;
}

export interface Proveedor {
  proveedor_id: string;
  alias_proveedor: string;
  razon_social: string;
  rfc: string;
  direccion: string | null;
  ciudad: string | null;
  codigo_postal: string | null;
  telefono: string | null;
  email: string | null;
  contacto_principal: string | null;
  banco: string | null;
  numero_cuenta: string | null;
  clabe: string | null;
  tipo_proveedor: 'material' | 'servicio' | 'renta' | 'mixto' | null;
  dias_credito: number;
  limite_credito: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REQUISICIONES
// ============================================================================

export interface RequisicionMaterial {
  requisicion_id: string;
  numero_requisicion: string;
  obra_id: string;
  residente_nombre: string;
  fecha_creacion: string;
  fecha_entrega_requerida: string | null;
  urgencia: 'urgente' | 'normal' | 'planeado';
  estatus: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'convertida_oc';
  observaciones: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequisicionMaterialItem {
  item_id: string;
  requisicion_id: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  orden_item: number;
  created_at: string;
}

export interface RequisicionComentario {
  comentario_id: string;
  requisicion_id: string;
  autor: string;
  rol: string;
  mensaje: string;
  fecha_comentario: string;
}

// ============================================================================
// ÓRDENES DE COMPRA
// ============================================================================

export interface OrdenCompra {
  oc_id: string;
  numero_oc: string;
  obra_id: string;
  proveedor_id: string;
  comprador: string;
  fecha_creacion: string;
  fecha_entrega: string;
  tipo_entrega: 'entrega' | 'recoleccion';
  aplica_iva: boolean;
  porcentaje_descuento: number;
  subtotal: number;
  monto_descuento: number;
  iva: number;
  total: number;
  observaciones: string | null;
  estatus: 'pendiente' | 'aprobada' | 'rechazada' | 'entregada' | 'cancelada';
  created_at: string;
  updated_at: string;
}

export interface OrdenCompraItem {
  item_id: string;
  oc_id: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  subtotal_item: number;
  orden_item: number;
  created_at: string;
}

// ============================================================================
// PAGOS
// ============================================================================

export interface Pago {
  pago_id: string;
  oc_id: string;
  obra_id: string;
  proveedor_id: string;
  numero_pago: string;
  fecha_pago: string;
  monto_pagado: number;
  metodo_pago: 'transferencia' | 'cheque' | 'efectivo' | 'tarjeta';
  referencia_pago: string | null;
  banco: string | null;
  factura_numero: string | null;
  factura_xml_url: string | null;
  factura_pdf_url: string | null;
  notas: string | null;
  estatus: 'pendiente' | 'aplicado' | 'cancelado';
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ENTREGAS (FUTURO)
// ============================================================================

export interface Entrega {
  entrega_id: string;
  oc_id: string;
  obra_id: string;
  numero_entrega: string;
  fecha_entrega: string;
  quien_recibe: string | null;
  observaciones: string | null;
  estatus: 'parcial' | 'completa' | 'con_incidencia';
  created_at: string;
  updated_at: string;
}

export interface EntregaItem {
  entrega_item_id: string;
  entrega_id: string;
  oc_item_id: string;
  cantidad_entregada: number;
  observaciones: string | null;
  created_at: string;
}

// ============================================================================
// VISTAS / MÉTRICAS CALCULADAS
// ============================================================================

export interface MetricasObra {
  obra_id: string;
  codigo_obra: string;
  nombre_obra: string;
  presupuesto_total: number;
  total_comprometido: number;
  total_pagado: number;
  presupuesto_disponible: number;
  saldo_por_pagar: number;
}

export interface ResumenProveedorOC {
  proveedor_id: string;
  alias_proveedor: string;
  razon_social: string;
  total_ordenes: number;
  total_comprometido: number;
  total_pagado: number;
  saldo_pendiente: number;
}

export interface EstadoRequisiciones {
  obra_id: string;
  nombre_obra: string;
  total_requisiciones: number;
  pendientes: number;
  en_revision: number;
  urgentes: number;
}

// ============================================================================
// DTOs - Data Transfer Objects para creación/actualización
// ============================================================================

export interface CreateObraDTO {
  codigo_obra: string;
  nombre_obra: string;
  cliente: string;
  residente?: string;
  direccion?: string;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  presupuesto_total: number;
  estatus?: 'activa' | 'pausada' | 'terminada' | 'cancelada';
}

export interface UpdateObraDTO {
  nombre_obra?: string;
  cliente?: string;
  residente?: string;
  direccion?: string;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  presupuesto_total?: number;
  estatus?: 'activa' | 'pausada' | 'terminada' | 'cancelada';
}

export interface CreateProveedorDTO {
  alias_proveedor: string;
  razon_social: string;
  rfc: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  telefono?: string;
  email?: string;
  contacto_principal?: string;
  banco?: string;
  numero_cuenta?: string;
  clabe?: string;
  tipo_proveedor?: 'material' | 'servicio' | 'renta' | 'mixto';
  dias_credito?: number;
  limite_credito?: number;
}

export interface UpdateProveedorDTO {
  alias_proveedor?: string;
  razon_social?: string;
  rfc?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  telefono?: string;
  email?: string;
  contacto_principal?: string;
  banco?: string;
  numero_cuenta?: string;
  clabe?: string;
  tipo_proveedor?: 'material' | 'servicio' | 'renta' | 'mixto';
  dias_credito?: number;
  limite_credito?: number;
  activo?: boolean;
}

export interface CreateRequisicionDTO {
  obra_id: string;
  residente_nombre: string;
  fecha_entrega_requerida?: string;
  urgencia: 'urgente' | 'normal' | 'planeado';
  observaciones?: string;
  items: {
    descripcion: string;
    cantidad: number;
    unidad: string;
  }[];
}

export interface CreateOrdenCompraDTO {
  obra_id: string;
  proveedor_id: string;
  comprador: string;
  fecha_entrega: string;
  tipo_entrega: 'entrega' | 'recoleccion';
  aplica_iva: boolean;
  porcentaje_descuento: number;
  observaciones?: string;
  items: {
    descripcion: string;
    cantidad: number;
    unidad: string;
    precio_unitario: number;
  }[];
}

export interface CreatePagoDTO {
  oc_id: string;
  fecha_pago: string;
  monto_pagado: number;
  metodo_pago: 'transferencia' | 'cheque' | 'efectivo' | 'tarjeta';
  referencia_pago?: string;
  banco?: string;
  factura_numero?: string;
  factura_xml_url?: string;
  factura_pdf_url?: string;
  notas?: string;
}

// ============================================================================
// ENUMERACIONES
// ============================================================================

export const EstatusObra = {
  ACTIVA: 'activa',
  PAUSADA: 'pausada',
  TERMINADA: 'terminada',
  CANCELADA: 'cancelada',
} as const;

export const UrgenciaRequisicion = {
  URGENTE: 'urgente',
  NORMAL: 'normal',
  PLANEADO: 'planeado',
} as const;

export const EstatusRequisicion = {
  PENDIENTE: 'pendiente',
  EN_REVISION: 'en_revision',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
  CONVERTIDA_OC: 'convertida_oc',
} as const;

export const EstatusOrdenCompra = {
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
  ENTREGADA: 'entregada',
  CANCELADA: 'cancelada',
} as const;

export const MetodoPago = {
  TRANSFERENCIA: 'transferencia',
  CHEQUE: 'cheque',
  EFECTIVO: 'efectivo',
  TARJETA: 'tarjeta',
} as const;

export const EstatusPago = {
  PENDIENTE: 'pendiente',
  APLICADO: 'aplicado',
  CANCELADO: 'cancelado',
} as const;
