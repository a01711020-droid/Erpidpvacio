/**
 * MODELO DE DOMINIO UNIFICADO
 * Alineado 100% con backend FastAPI y esquema SQL
 * 
 * REGLAS:
 * - UUID como IDs
 * - Campos en español (codigo, nombre, estado)
 * - camelCase para propiedades TypeScript
 * - Sin traducciones, sin modelos duplicados
 * - Estados y enums coinciden exactamente con CHECK constraints de SQL
 */

// ============================================================================
// OBRA (Proyecto/Contrato)
// SQL: obras
// ============================================================================
export interface Obra {
  id: string; // UUID
  codigo: string; // VARCHAR(50) UNIQUE
  nombre: string; // VARCHAR(255)
  numeroContrato: string; // VARCHAR(100) UNIQUE
  cliente: string; // VARCHAR(255)
  residente: string; // VARCHAR(255)
  direccion: string | null; // TEXT
  montoContratado: number; // NUMERIC(15, 2)
  fechaInicio: string; // DATE (ISO string)
  fechaFinProgramada: string; // DATE (ISO string)
  plazoEjecucion: number; // INTEGER (días)
  estado: 'activa' | 'suspendida' | 'terminada' | 'cancelada'; // VARCHAR(50) CHECK
  createdAt: string; // TIMESTAMPTZ (ISO string)
  updatedAt: string; // TIMESTAMPTZ (ISO string)
}

export interface ObraCreate {
  codigo: string;
  nombre: string;
  numeroContrato: string;
  cliente: string;
  residente: string;
  direccion?: string | null;
  montoContratado: number;
  fechaInicio: string;
  fechaFinProgramada: string;
  plazoEjecucion: number;
  estado: 'activa' | 'suspendida' | 'terminada' | 'cancelada';
}

export interface ObraUpdate {
  codigo?: string;
  nombre?: string;
  numeroContrato?: string;
  cliente?: string;
  residente?: string;
  direccion?: string | null;
  montoContratado?: number;
  fechaInicio?: string;
  fechaFinProgramada?: string;
  plazoEjecucion?: number;
  estado?: 'activa' | 'suspendida' | 'terminada' | 'cancelada';
}

// ============================================================================
// PROVEEDOR
// SQL: proveedores
// ============================================================================
export interface Proveedor {
  id: string; // UUID
  razonSocial: string; // VARCHAR(255)
  nombreComercial: string | null; // VARCHAR(255)
  rfc: string; // VARCHAR(13) UNIQUE
  direccion: string | null; // TEXT
  ciudad: string | null; // VARCHAR(100)
  codigoPostal: string | null; // VARCHAR(10)
  telefono: string | null; // VARCHAR(20)
  email: string | null; // VARCHAR(255)
  contactoPrincipal: string | null; // VARCHAR(255)
  banco: string | null; // VARCHAR(100)
  numeroCuenta: string | null; // VARCHAR(50)
  clabe: string | null; // VARCHAR(18)
  tipoProveedor: 'material' | 'servicio' | 'renta' | 'mixto' | null; // CHECK
  creditoDias: number; // INTEGER DEFAULT 0
  limiteCredito: number; // NUMERIC(15, 2) DEFAULT 0
  activo: boolean; // BOOLEAN DEFAULT TRUE
  createdAt: string; // TIMESTAMPTZ
  updatedAt: string; // TIMESTAMPTZ
}

export interface ProveedorCreate {
  razonSocial: string;
  nombreComercial?: string | null;
  rfc: string;
  direccion?: string | null;
  ciudad?: string | null;
  codigoPostal?: string | null;
  telefono?: string | null;
  email?: string | null;
  contactoPrincipal?: string | null;
  banco?: string | null;
  numeroCuenta?: string | null;
  clabe?: string | null;
  tipoProveedor?: 'material' | 'servicio' | 'renta' | 'mixto' | null;
  creditoDias?: number;
  limiteCredito?: number;
  activo?: boolean;
}

export interface ProveedorUpdate {
  razonSocial?: string;
  nombreComercial?: string | null;
  rfc?: string;
  direccion?: string | null;
  ciudad?: string | null;
  codigoPostal?: string | null;
  telefono?: string | null;
  email?: string | null;
  contactoPrincipal?: string | null;
  banco?: string | null;
  numeroCuenta?: string | null;
  clabe?: string | null;
  tipoProveedor?: 'material' | 'servicio' | 'renta' | 'mixto' | null;
  creditoDias?: number;
  limiteCredito?: number;
  activo?: boolean;
}

// ============================================================================
// REQUISICIÓN DE MATERIAL
// SQL: requisiciones + requisicion_items
// ============================================================================
export interface Requisicion {
  id: string; // UUID
  numeroRequisicion: string; // VARCHAR(50) UNIQUE
  obraId: string; // UUID FK
  solicitadoPor: string; // VARCHAR(255)
  fechaSolicitud: string; // TIMESTAMPTZ (ISO string)
  urgencia: 'normal' | 'urgente' | 'muy_urgente'; // CHECK
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'en_proceso' | 'completada'; // CHECK
  observaciones: string | null; // TEXT
  aprobadoPor: string | null; // VARCHAR(255)
  fechaAprobacion: string | null; // TIMESTAMPTZ
  motivoRechazo: string | null; // TEXT
  items: RequisicionItem[]; // Items de la requisición
  createdAt: string; // TIMESTAMPTZ
  updatedAt: string; // TIMESTAMPTZ
}

export interface RequisicionItem {
  id: string; // UUID
  requisicionId: string; // UUID FK
  cantidad: number; // NUMERIC(10, 2)
  unidad: string; // VARCHAR(20)
  descripcion: string; // TEXT
  createdAt: string; // TIMESTAMPTZ
}

export interface RequisicionCreate {
  numeroRequisicion: string;
  obraId: string;
  solicitadoPor: string;
  urgencia: 'normal' | 'urgente' | 'muy_urgente';
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'en_proceso' | 'completada';
  observaciones?: string | null;
  aprobadoPor?: string | null;
  fechaAprobacion?: string | null;
  motivoRechazo?: string | null;
  items: Omit<RequisicionItem, 'id' | 'requisicionId' | 'createdAt'>[];
}

export interface RequisicionUpdate {
  urgencia?: 'normal' | 'urgente' | 'muy_urgente';
  estado?: 'pendiente' | 'aprobada' | 'rechazada' | 'en_proceso' | 'completada';
  observaciones?: string | null;
  aprobadoPor?: string | null;
  fechaAprobacion?: string | null;
  motivoRechazo?: string | null;
}

// ============================================================================
// ORDEN DE COMPRA
// SQL: ordenes_compra + orden_compra_items
// ============================================================================
export interface OrdenCompra {
  id: string; // UUID
  numeroOrden: string; // VARCHAR(50) UNIQUE
  obraId: string; // UUID FK
  proveedorId: string; // UUID FK
  requisicionId: string | null; // UUID FK
  fechaEmision: string; // TIMESTAMPTZ (ISO string)
  fechaEntrega: string; // DATE (ISO string)
  estado: 'borrador' | 'emitida' | 'recibida' | 'facturada' | 'pagada' | 'cancelada'; // CHECK
  tipoEntrega: 'en_obra' | 'bodega' | 'recoger' | null; // CHECK
  subtotal: number; // NUMERIC(15, 2)
  descuento: number; // NUMERIC(5, 2) DEFAULT 0
  descuentoMonto: number; // NUMERIC(15, 2) DEFAULT 0
  iva: number; // NUMERIC(15, 2) DEFAULT 0
  total: number; // NUMERIC(15, 2)
  observaciones: string | null; // TEXT
  creadoPor: string | null; // VARCHAR(255)
  items: OrdenCompraItem[]; // Items de la OC
  createdAt: string; // TIMESTAMPTZ
  updatedAt: string; // TIMESTAMPTZ
}

export interface OrdenCompraItem {
  id: string; // UUID
  ordenCompraId: string; // UUID FK
  cantidad: number; // NUMERIC(10, 2)
  unidad: string; // VARCHAR(20)
  descripcion: string; // TEXT
  precioUnitario: number; // NUMERIC(15, 2)
  total: number; // NUMERIC(15, 2)
  createdAt: string; // TIMESTAMPTZ
}

export interface OrdenCompraCreate {
  numeroOrden: string;
  obraId: string;
  proveedorId: string;
  requisicionId?: string | null;
  fechaEntrega: string;
  estado: 'borrador' | 'emitida' | 'recibida' | 'facturada' | 'pagada' | 'cancelada';
  tipoEntrega?: 'en_obra' | 'bodega' | 'recoger' | null;
  subtotal: number;
  descuento?: number;
  descuentoMonto?: number;
  iva?: number;
  total: number;
  observaciones?: string | null;
  creadoPor?: string | null;
  items: Omit<OrdenCompraItem, 'id' | 'ordenCompraId' | 'createdAt'>[];
}

export interface OrdenCompraUpdate {
  fechaEntrega?: string;
  estado?: 'borrador' | 'emitida' | 'recibida' | 'facturada' | 'pagada' | 'cancelada';
  tipoEntrega?: 'en_obra' | 'bodega' | 'recoger' | null;
  subtotal?: number;
  descuento?: number;
  descuentoMonto?: number;
  iva?: number;
  total?: number;
  observaciones?: string | null;
}

// ============================================================================
// PAGO
// SQL: pagos
// ============================================================================
export interface Pago {
  id: string; // UUID
  numeroPago: string; // VARCHAR(50) UNIQUE
  obraId: string; // UUID FK
  proveedorId: string; // UUID FK
  ordenCompraId: string; // UUID FK
  monto: number; // NUMERIC(15, 2)
  metodoPago: 'transferencia' | 'cheque' | 'efectivo' | null; // CHECK
  fechaProgramada: string; // DATE (ISO string)
  fechaProcesado: string | null; // TIMESTAMPTZ
  estado: 'programado' | 'procesando' | 'completado' | 'cancelado'; // CHECK
  referencia: string | null; // VARCHAR(100)
  comprobante: string | null; // TEXT
  observaciones: string | null; // TEXT
  procesadoPor: string | null; // VARCHAR(255)
  createdAt: string; // TIMESTAMPTZ
  updatedAt: string; // TIMESTAMPTZ
}

export interface PagoCreate {
  numeroPago: string;
  obraId: string;
  proveedorId: string;
  ordenCompraId: string;
  monto: number;
  metodoPago?: 'transferencia' | 'cheque' | 'efectivo' | null;
  fechaProgramada: string;
  estado: 'programado' | 'procesando' | 'completado' | 'cancelado';
  referencia?: string | null;
  comprobante?: string | null;
  observaciones?: string | null;
  procesadoPor?: string | null;
}

export interface PagoUpdate {
  monto?: number;
  metodoPago?: 'transferencia' | 'cheque' | 'efectivo' | null;
  fechaProgramada?: string;
  fechaProcesado?: string | null;
  estado?: 'programado' | 'procesando' | 'completado' | 'cancelado';
  referencia?: string | null;
  comprobante?: string | null;
  observaciones?: string | null;
  procesadoPor?: string | null;
}

// ============================================================================
// TIPOS PARA LISTADOS PAGINADOS
// ============================================================================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// ============================================================================
// TIPOS PARA RESPUESTAS EXTENDIDAS (con relaciones)
// ============================================================================
export interface OrdenCompraConRelaciones extends OrdenCompra {
  obra?: Obra;
  proveedor?: Proveedor;
}

export interface PagoConRelaciones extends Pago {
  obra?: Obra;
  proveedor?: Proveedor;
  ordenCompra?: OrdenCompra;
}

export interface RequisicionConRelaciones extends Requisicion {
  obra?: Obra;
}
