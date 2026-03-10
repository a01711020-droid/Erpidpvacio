/**
 * MOCK ADAPTER
 * 
 * Implementación del IDataAdapter usando datos mock
 * Lee de /spec/mock-db/seed.ts
 * Simula latencia de red para realismo
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
  createEmptyListResponse,
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

// Importar seed data
import { mockDatabase, emptyDatabase } from '/spec/mock-db/seed';
import { TEST_EMPTY_STATE } from '../config';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

// Determinar qué base de datos usar según configuración
const db = TEST_EMPTY_STATE ? emptyDatabase : mockDatabase;

const SIMULATE_NETWORK_DELAY = true;
const MIN_DELAY = 200; // ms
const MAX_DELAY = 600; // ms

/**
 * Simular delay de red
 */
async function simulateDelay(): Promise<void> {
  if (!SIMULATE_NETWORK_DELAY) return;
  const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Generar ID único
 */
function generateId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

// ============================================================================
// MOCK ADAPTER IMPLEMENTATION
// ============================================================================

export class MockDataAdapter implements IDataAdapter {
  // ==========================================================================
  // OBRAS
  // ==========================================================================

  async listObras(filters?: { estatus?: string }): Promise<ListResponse<Obra>> {
    await simulateDelay();
    
    try {
      let obras = [...db.obras];
      
      if (filters?.estatus) {
        obras = obras.filter((o) => o.estatus === filters.estatus);
      }
      
      return createSuccessListResponse(obras);
    } catch (error) {
      return {
        status: 'error',
        data: [],
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  async getObra(obraId: string): Promise<DataResponse<Obra>> {
    await simulateDelay();
    
    const obra = db.obras.find((o) => o.obra_id === obraId);
    
    if (!obra) {
      return createErrorResponse(`Obra con ID ${obraId} no encontrada`);
    }
    
    return createSuccessResponse(obra);
  }

  async createObra(data: CreateObraDTO): Promise<DataResponse<Obra>> {
    await simulateDelay();
    
    const nuevaObra: Obra = {
      obra_id: generateId('obra'),
      codigo_obra: data.codigo_obra,
      nombre_obra: data.nombre_obra,
      cliente: data.cliente,
      residente: data.residente || null,
      direccion: data.direccion || null,
      fecha_inicio: data.fecha_inicio || null,
      fecha_fin_estimada: data.fecha_fin_estimada || null,
      presupuesto_total: data.presupuesto_total,
      estatus: data.estatus || 'activa',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // En mock, solo retornamos la obra sin guardarla
    return createSuccessResponse(nuevaObra);
  }

  async updateObra(obraId: string, data: UpdateObraDTO): Promise<DataResponse<Obra>> {
    await simulateDelay();
    
    const obra = db.obras.find((o) => o.obra_id === obraId);
    
    if (!obra) {
      return createErrorResponse(`Obra con ID ${obraId} no encontrada`);
    }
    
    const obraActualizada: Obra = {
      ...obra,
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    return createSuccessResponse(obraActualizada);
  }

  async deleteObra(obraId: string): Promise<DataResponse<void>> {
    await simulateDelay();
    
    const obra = db.obras.find((o) => o.obra_id === obraId);
    
    if (!obra) {
      return createErrorResponse(`Obra con ID ${obraId} no encontrada`);
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
    await simulateDelay();
    
    let proveedores = [...db.proveedores];
    
    if (filters?.activo !== undefined) {
      proveedores = proveedores.filter((p) => p.activo === filters.activo);
    }
    
    if (filters?.tipo) {
      proveedores = proveedores.filter((p) => p.tipo_proveedor === filters.tipo);
    }
    
    return createSuccessListResponse(proveedores);
  }

  async getProveedor(proveedorId: string): Promise<DataResponse<Proveedor>> {
    await simulateDelay();
    
    const proveedor = db.proveedores.find((p) => p.proveedor_id === proveedorId);
    
    if (!proveedor) {
      return createErrorResponse(`Proveedor con ID ${proveedorId} no encontrado`);
    }
    
    return createSuccessResponse(proveedor);
  }

  async createProveedor(data: CreateProveedorDTO): Promise<DataResponse<Proveedor>> {
    await simulateDelay();
    
    const nuevoProveedor: Proveedor = {
      proveedor_id: generateId('prov'),
      alias_proveedor: data.alias_proveedor,
      razon_social: data.razon_social,
      rfc: data.rfc,
      direccion: data.direccion || null,
      ciudad: data.ciudad || null,
      codigo_postal: data.codigo_postal || null,
      telefono: data.telefono || null,
      email: data.email || null,
      contacto_principal: data.contacto_principal || null,
      banco: data.banco || null,
      numero_cuenta: data.numero_cuenta || null,
      clabe: data.clabe || null,
      tipo_proveedor: data.tipo_proveedor || null,
      dias_credito: data.dias_credito || 0,
      limite_credito: data.limite_credito || 0,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return createSuccessResponse(nuevoProveedor);
  }

  async updateProveedor(
    proveedorId: string,
    data: UpdateProveedorDTO
  ): Promise<DataResponse<Proveedor>> {
    await simulateDelay();
    
    const proveedor = db.proveedores.find((p) => p.proveedor_id === proveedorId);
    
    if (!proveedor) {
      return createErrorResponse(`Proveedor con ID ${proveedorId} no encontrado`);
    }
    
    const proveedorActualizado: Proveedor = {
      ...proveedor,
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    return createSuccessResponse(proveedorActualizado);
  }

  async deactivateProveedor(proveedorId: string): Promise<DataResponse<void>> {
    await simulateDelay();
    
    const proveedor = db.proveedores.find((p) => p.proveedor_id === proveedorId);
    
    if (!proveedor) {
      return createErrorResponse(`Proveedor con ID ${proveedorId} no encontrado`);
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
    await simulateDelay();
    
    let requisiciones = [...db.requisiciones_material];
    
    if (filters?.obra_id) {
      requisiciones = requisiciones.filter((r) => r.obra_id === filters.obra_id);
    }
    
    if (filters?.estatus) {
      requisiciones = requisiciones.filter((r) => r.estatus === filters.estatus);
    }
    
    if (filters?.urgencia) {
      requisiciones = requisiciones.filter((r) => r.urgencia === filters.urgencia);
    }
    
    return createSuccessListResponse(requisiciones);
  }

  async getRequisicion(requisicionId: string): Promise<DataResponse<{
    requisicion: RequisicionMaterial;
    items: RequisicionMaterialItem[];
    comentarios: RequisicionComentario[];
  }>> {
    await simulateDelay();
    
    const requisicion = db.requisiciones_material.find(
      (r) => r.requisicion_id === requisicionId
    );
    
    if (!requisicion) {
      return createErrorResponse(`Requisición con ID ${requisicionId} no encontrada`);
    }
    
    const items = db.requisiciones_material_items.filter(
      (i) => i.requisicion_id === requisicionId
    );
    
    const comentarios = db.requisiciones_comentarios.filter(
      (c) => c.requisicion_id === requisicionId
    );
    
    return createSuccessResponse({
      requisicion,
      items,
      comentarios,
    });
  }

  async createRequisicion(
    data: CreateRequisicionDTO
  ): Promise<DataResponse<RequisicionMaterial>> {
    await simulateDelay();
    
    const obra = db.obras.find((o) => o.obra_id === data.obra_id);
    if (!obra) {
      return createErrorResponse(`Obra con ID ${data.obra_id} no encontrada`);
    }
    
    const nuevaRequisicion: RequisicionMaterial = {
      requisicion_id: generateId('req'),
      numero_requisicion: `REQ${obra.codigo_obra}-${Date.now()}`,
      obra_id: data.obra_id,
      residente_nombre: data.residente_nombre,
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_entrega_requerida: data.fecha_entrega_requerida || null,
      urgencia: data.urgencia,
      estatus: 'pendiente',
      observaciones: data.observaciones || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return createSuccessResponse(nuevaRequisicion);
  }

  async updateRequisicionEstatus(
    requisicionId: string,
    estatus: string
  ): Promise<DataResponse<RequisicionMaterial>> {
    await simulateDelay();
    
    const requisicion = db.requisiciones_material.find(
      (r) => r.requisicion_id === requisicionId
    );
    
    if (!requisicion) {
      return createErrorResponse(`Requisición con ID ${requisicionId} no encontrada`);
    }
    
    const requisicionActualizada: RequisicionMaterial = {
      ...requisicion,
      estatus: estatus as any,
      updated_at: new Date().toISOString(),
    };
    
    return createSuccessResponse(requisicionActualizada);
  }

  async addComentarioRequisicion(
    requisicionId: string,
    autor: string,
    rol: string,
    mensaje: string
  ): Promise<DataResponse<RequisicionComentario>> {
    await simulateDelay();
    
    const requisicion = db.requisiciones_material.find(
      (r) => r.requisicion_id === requisicionId
    );
    
    if (!requisicion) {
      return createErrorResponse(`Requisición con ID ${requisicionId} no encontrada`);
    }
    
    const nuevoComentario: RequisicionComentario = {
      comentario_id: generateId('req_com'),
      requisicion_id: requisicionId,
      autor,
      rol,
      mensaje,
      fecha_comentario: new Date().toISOString(),
    };
    
    return createSuccessResponse(nuevoComentario);
  }

  // ==========================================================================
  // ÓRDENES DE COMPRA
  // ==========================================================================

  async listOrdenesCompra(filters?: {
    obra_id?: string;
    proveedor_id?: string;
    estatus?: string;
  }): Promise<ListResponse<OrdenCompra>> {
    await simulateDelay();
    
    let ordenes = [...db.ordenes_compra];
    
    if (filters?.obra_id) {
      ordenes = ordenes.filter((o) => o.obra_id === filters.obra_id);
    }
    
    if (filters?.proveedor_id) {
      ordenes = ordenes.filter((o) => o.proveedor_id === filters.proveedor_id);
    }
    
    if (filters?.estatus) {
      ordenes = ordenes.filter((o) => o.estatus === filters.estatus);
    }
    
    return createSuccessListResponse(ordenes);
  }

  async getOrdenCompra(ocId: string): Promise<DataResponse<{
    orden: OrdenCompra;
    items: OrdenCompraItem[];
  }>> {
    await simulateDelay();
    
    const orden = db.ordenes_compra.find((o) => o.oc_id === ocId);
    
    if (!orden) {
      return createErrorResponse(`Orden de compra con ID ${ocId} no encontrada`);
    }
    
    const items = db.ordenes_compra_items.filter((i) => i.oc_id === ocId);
    
    return createSuccessResponse({
      orden,
      items,
    });
  }

  async createOrdenCompra(data: CreateOrdenCompraDTO): Promise<DataResponse<OrdenCompra>> {
    await simulateDelay();
    
    const obra = db.obras.find((o) => o.obra_id === data.obra_id);
    if (!obra) {
      return createErrorResponse(`Obra con ID ${data.obra_id} no encontrada`);
    }
    
    const proveedor = db.proveedores.find((p) => p.proveedor_id === data.proveedor_id);
    if (!proveedor) {
      return createErrorResponse(`Proveedor con ID ${data.proveedor_id} no encontrado`);
    }
    
    // Calcular totales
    const subtotal = data.items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);
    const monto_descuento = subtotal * (data.porcentaje_descuento / 100);
    const base = subtotal - monto_descuento;
    const iva = data.aplica_iva ? base * 0.16 : 0;
    const total = base + iva;
    
    const nuevaOrden: OrdenCompra = {
      oc_id: generateId('oc'),
      numero_oc: `${obra.codigo_obra}-${Date.now()}`,
      obra_id: data.obra_id,
      proveedor_id: data.proveedor_id,
      comprador: data.comprador,
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_entrega: data.fecha_entrega,
      tipo_entrega: data.tipo_entrega,
      aplica_iva: data.aplica_iva,
      porcentaje_descuento: data.porcentaje_descuento,
      subtotal,
      monto_descuento,
      iva,
      total,
      observaciones: data.observaciones || null,
      estatus: 'pendiente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return createSuccessResponse(nuevaOrden);
  }

  async updateOrdenCompraEstatus(
    ocId: string,
    estatus: string
  ): Promise<DataResponse<OrdenCompra>> {
    await simulateDelay();
    
    const orden = db.ordenes_compra.find((o) => o.oc_id === ocId);
    
    if (!orden) {
      return createErrorResponse(`Orden de compra con ID ${ocId} no encontrada`);
    }
    
    const ordenActualizada: OrdenCompra = {
      ...orden,
      estatus: estatus as any,
      updated_at: new Date().toISOString(),
    };
    
    return createSuccessResponse(ordenActualizada);
  }

  async cancelOrdenCompra(ocId: string, motivo?: string): Promise<DataResponse<void>> {
    await simulateDelay();
    
    const orden = db.ordenes_compra.find((o) => o.oc_id === ocId);
    
    if (!orden) {
      return createErrorResponse(`Orden de compra con ID ${ocId} no encontrada`);
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
    await simulateDelay();
    
    let pagos = [...db.pagos];
    
    if (filters?.obra_id) {
      pagos = pagos.filter((p) => p.obra_id === filters.obra_id);
    }
    
    if (filters?.oc_id) {
      pagos = pagos.filter((p) => p.oc_id === filters.oc_id);
    }
    
    if (filters?.proveedor_id) {
      pagos = pagos.filter((p) => p.proveedor_id === filters.proveedor_id);
    }
    
    return createSuccessListResponse(pagos);
  }

  async getPago(pagoId: string): Promise<DataResponse<Pago>> {
    await simulateDelay();
    
    const pago = db.pagos.find((p) => p.pago_id === pagoId);
    
    if (!pago) {
      return createErrorResponse(`Pago con ID ${pagoId} no encontrado`);
    }
    
    return createSuccessResponse(pago);
  }

  async createPago(data: CreatePagoDTO): Promise<DataResponse<Pago>> {
    await simulateDelay();
    
    const oc = db.ordenes_compra.find((o) => o.oc_id === data.oc_id);
    if (!oc) {
      return createErrorResponse(`Orden de compra con ID ${data.oc_id} no encontrada`);
    }
    
    const nuevoPago: Pago = {
      pago_id: generateId('pago'),
      oc_id: data.oc_id,
      obra_id: oc.obra_id,
      proveedor_id: oc.proveedor_id,
      numero_pago: `PAG-${Date.now()}`,
      fecha_pago: data.fecha_pago,
      monto_pagado: data.monto_pagado,
      metodo_pago: data.metodo_pago,
      referencia_pago: data.referencia_pago || null,
      banco: data.banco || null,
      factura_numero: data.factura_numero || null,
      factura_xml_url: data.factura_xml_url || null,
      factura_pdf_url: data.factura_pdf_url || null,
      notas: data.notas || null,
      estatus: 'aplicado',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return createSuccessResponse(nuevoPago);
  }

  async cancelPago(pagoId: string, motivo?: string): Promise<DataResponse<void>> {
    await simulateDelay();
    
    const pago = db.pagos.find((p) => p.pago_id === pagoId);
    
    if (!pago) {
      return createErrorResponse(`Pago con ID ${pagoId} no encontrado`);
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
    await simulateDelay();
    
    let entregas = [...db.entregas];
    
    if (filters?.obra_id) {
      entregas = entregas.filter((e) => e.obra_id === filters.obra_id);
    }
    
    if (filters?.oc_id) {
      entregas = entregas.filter((e) => e.oc_id === filters.oc_id);
    }
    
    return createSuccessListResponse(entregas);
  }

  async getEntrega(entregaId: string): Promise<DataResponse<{
    entrega: Entrega;
    items: EntregaItem[];
  }>> {
    await simulateDelay();
    
    const entrega = db.entregas.find((e) => e.entrega_id === entregaId);
    
    if (!entrega) {
      return createErrorResponse(`Entrega con ID ${entregaId} no encontrada`);
    }
    
    const items = db.entregas_items.filter((i) => i.entrega_id === entregaId);
    
    return createSuccessResponse({
      entrega,
      items,
    });
  }

  // ==========================================================================
  // MÉTRICAS Y DASHBOARDS
  // ==========================================================================

  async getMetricasObra(obraId: string): Promise<DataResponse<MetricasObra>> {
    await simulateDelay();
    
    const obra = db.obras.find((o) => o.obra_id === obraId);
    
    if (!obra) {
      return createErrorResponse(`Obra con ID ${obraId} no encontrada`);
    }
    
    // Calcular métricas
    const ordenesObra = db.ordenes_compra.filter(
      (o) => o.obra_id === obraId && (o.estatus === 'aprobada' || o.estatus === 'entregada')
    );
    const pagosObra = db.pagos.filter(
      (p) => p.obra_id === obraId && p.estatus === 'aplicado'
    );
    
    const total_comprometido = ordenesObra.reduce((sum, o) => sum + o.total, 0);
    const total_pagado = pagosObra.reduce((sum, p) => sum + p.monto_pagado, 0);
    
    const metricas: MetricasObra = {
      obra_id: obra.obra_id,
      codigo_obra: obra.codigo_obra,
      nombre_obra: obra.nombre_obra,
      presupuesto_total: obra.presupuesto_total,
      total_comprometido,
      total_pagado,
      presupuesto_disponible: obra.presupuesto_total - total_comprometido,
      saldo_por_pagar: total_comprometido - total_pagado,
    };
    
    return createSuccessResponse(metricas);
  }

  async getAllMetricasObras(): Promise<ListResponse<MetricasObra>> {
    await simulateDelay();
    
    const metricas: MetricasObra[] = [];
    
    for (const obra of db.obras) {
      const result = await this.getMetricasObra(obra.obra_id);
      if (result.data) {
        metricas.push(result.data);
      }
    }
    
    return createSuccessListResponse(metricas);
  }

  async getResumenProveedorOC(
    proveedorId: string
  ): Promise<DataResponse<ResumenProveedorOC>> {
    await simulateDelay();
    
    const proveedor = db.proveedores.find((p) => p.proveedor_id === proveedorId);
    
    if (!proveedor) {
      return createErrorResponse(`Proveedor con ID ${proveedorId} no encontrado`);
    }
    
    const ordenesProveedor = db.ordenes_compra.filter(
      (o) => o.proveedor_id === proveedorId && (o.estatus === 'aprobada' || o.estatus === 'entregada')
    );
    const pagosProveedor = db.pagos.filter(
      (p) => p.proveedor_id === proveedorId && p.estatus === 'aplicado'
    );
    
    const total_comprometido = ordenesProveedor.reduce((sum, o) => sum + o.total, 0);
    const total_pagado = pagosProveedor.reduce((sum, p) => sum + p.monto_pagado, 0);
    
    const resumen: ResumenProveedorOC = {
      proveedor_id: proveedor.proveedor_id,
      alias_proveedor: proveedor.alias_proveedor,
      razon_social: proveedor.razon_social,
      total_ordenes: ordenesProveedor.length,
      total_comprometido,
      total_pagado,
      saldo_pendiente: total_comprometido - total_pagado,
    };
    
    return createSuccessResponse(resumen);
  }

  async getEstadoRequisiciones(obraId?: string): Promise<ListResponse<EstadoRequisiciones>> {
    await simulateDelay();
    
    const obras = obraId
      ? db.obras.filter((o) => o.obra_id === obraId)
      : db.obras;
    
    const estados: EstadoRequisiciones[] = obras.map((obra) => {
      const requisiciones = db.requisiciones_material.filter(
        (r) => r.obra_id === obra.obra_id
      );
      
      return {
        obra_id: obra.obra_id,
        nombre_obra: obra.nombre_obra,
        total_requisiciones: requisiciones.length,
        pendientes: requisiciones.filter((r) => r.estatus === 'pendiente').length,
        en_revision: requisiciones.filter((r) => r.estatus === 'en_revision').length,
        urgentes: requisiciones.filter(
          (r) => r.urgencia === 'urgente' && r.estatus !== 'convertida_oc' && r.estatus !== 'rechazada'
        ).length,
      };
    });
    
    return createSuccessListResponse(estados);
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
    await simulateDelay();
    
    const obrasActivas = db.obras.filter((o) => o.estatus === 'activa');
    const total_presupuesto = obrasActivas.reduce((sum, o) => sum + o.presupuesto_total, 0);
    
    const ordenesAprobadas = db.ordenes_compra.filter(
      (o) => o.estatus === 'aprobada' || o.estatus === 'entregada'
    );
    const total_comprometido = ordenesAprobadas.reduce((sum, o) => sum + o.total, 0);
    
    const pagosAplicados = db.pagos.filter((p) => p.estatus === 'aplicado');
    const total_pagado = pagosAplicados.reduce((sum, p) => sum + p.monto_pagado, 0);
    
    const requisiciones_pendientes = db.requisiciones_material.filter(
      (r) => r.estatus === 'pendiente' || r.estatus === 'en_revision'
    ).length;
    
    const ordenes_pendientes = db.ordenes_compra.filter(
      (o) => o.estatus === 'pendiente'
    ).length;
    
    const dashboard = {
      total_obras_activas: obrasActivas.length,
      total_presupuesto,
      total_comprometido,
      total_pagado,
      total_por_pagar: total_comprometido - total_pagado,
      requisiciones_pendientes,
      ordenes_pendientes,
    };
    
    return createSuccessResponse(dashboard);
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const mockAdapter = new MockDataAdapter();