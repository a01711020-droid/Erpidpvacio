/**
 * SEED DATA - Mock Database
 * 
 * Datos consistentes estructurados como tablas SQL
 * Los IDs siguen el patrón {prefijo}_{numero} para facilitar debugging
 * Todas las relaciones (FK) son válidas y consistentes
 */

export interface MockDatabase {
  obras: Obra[];
  proveedores: Proveedor[];
  requisiciones_material: RequisicionMaterial[];
  requisiciones_material_items: RequisicionMaterialItem[];
  requisiciones_comentarios: RequisicionComentario[];
  ordenes_compra: OrdenCompra[];
  ordenes_compra_items: OrdenCompraItem[];
  pagos: Pago[];
  entregas: Entrega[];
  entregas_items: EntregaItem[];
}

// ============================================================================
// TYPES - Espejo del schema SQL
// ============================================================================

export interface Obra {
  obra_id: string;
  codigo_obra: string;
  nombre_obra: string;
  cliente: string;
  residente: string | null;
  direccion: string | null;
  fecha_inicio: string | null; // ISO date
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

export interface RequisicionMaterial {
  requisicion_id: string;
  numero_requisicion: string;
  obra_id: string; // FK → obras
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
  requisicion_id: string; // FK → requisiciones_material
  descripcion: string;
  cantidad: number;
  unidad: string;
  orden_item: number;
  created_at: string;
}

export interface RequisicionComentario {
  comentario_id: string;
  requisicion_id: string; // FK → requisiciones_material
  autor: string;
  rol: string;
  mensaje: string;
  fecha_comentario: string;
}

export interface OrdenCompra {
  oc_id: string;
  numero_oc: string;
  obra_id: string; // FK → obras
  proveedor_id: string; // FK → proveedores
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
  oc_id: string; // FK → ordenes_compra
  descripcion: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  subtotal_item: number;
  orden_item: number;
  created_at: string;
}

export interface Pago {
  pago_id: string;
  oc_id: string; // FK → ordenes_compra
  obra_id: string; // FK → obras
  proveedor_id: string; // FK → proveedores
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

export interface Entrega {
  entrega_id: string;
  oc_id: string; // FK → ordenes_compra
  obra_id: string; // FK → obras
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
  entrega_id: string; // FK → entregas
  oc_item_id: string; // FK → ordenes_compra_items
  cantidad_entregada: number;
  observaciones: string | null;
  created_at: string;
}

// ============================================================================
// SEED DATA
// ============================================================================

export const mockDatabase: MockDatabase = {
  // ========== OBRAS ==========
  obras: [
    {
      obra_id: 'obra_227',
      codigo_obra: '227',
      nombre_obra: 'CASTELLO E',
      cliente: 'Desarrolladora Inmobiliaria del Centro',
      residente: 'Ing. Miguel Ángel Torres',
      direccion: 'Av. Constituyentes 234, Ciudad de México',
      fecha_inicio: '2024-06-01',
      fecha_fin_estimada: '2025-12-31',
      presupuesto_total: 5500000.00,
      estatus: 'activa',
      created_at: '2024-06-01T08:00:00Z',
      updated_at: '2024-06-01T08:00:00Z',
    },
    {
      obra_id: 'obra_228',
      codigo_obra: '228',
      nombre_obra: 'CASTELLO F',
      cliente: 'Grupo Constructor Metropolitano',
      residente: 'Arq. Laura Martínez',
      direccion: 'Bosques de Manzanares 45, Bosques de las Lomas',
      fecha_inicio: '2024-08-15',
      fecha_fin_estimada: '2026-02-28',
      presupuesto_total: 8200000.00,
      estatus: 'activa',
      created_at: '2024-08-15T08:00:00Z',
      updated_at: '2024-08-15T08:00:00Z',
    },
    {
      obra_id: 'obra_229',
      codigo_obra: '229',
      nombre_obra: 'CASTELLO G',
      cliente: 'Gobierno del Estado de México',
      residente: 'Ing. Roberto Sánchez',
      direccion: 'Centro Histórico, Toluca',
      fecha_inicio: '2024-09-01',
      fecha_fin_estimada: '2025-08-31',
      presupuesto_total: 12000000.00,
      estatus: 'activa',
      created_at: '2024-09-01T08:00:00Z',
      updated_at: '2024-09-01T08:00:00Z',
    },
    {
      obra_id: 'obra_230',
      codigo_obra: '230',
      nombre_obra: 'CASTELLO H',
      cliente: 'Inmobiliaria Santa Fe',
      residente: 'Ing. Patricia González',
      direccion: 'Santa Fe, CDMX',
      fecha_inicio: '2024-10-01',
      fecha_fin_estimada: '2025-10-31',
      presupuesto_total: 9500000.00,
      estatus: 'activa',
      created_at: '2024-10-01T08:00:00Z',
      updated_at: '2024-10-01T08:00:00Z',
    },
    {
      obra_id: 'obra_231',
      codigo_obra: '231',
      nombre_obra: 'DOZA A',
      cliente: 'Constructora Doza SA',
      residente: 'Ing. Carlos Ramírez',
      direccion: 'Querétaro Centro',
      fecha_inicio: '2024-11-01',
      fecha_fin_estimada: '2025-11-30',
      presupuesto_total: 6800000.00,
      estatus: 'activa',
      created_at: '2024-11-01T08:00:00Z',
      updated_at: '2024-11-01T08:00:00Z',
    },
    {
      obra_id: 'obra_232',
      codigo_obra: '232',
      nombre_obra: 'BALVANERA',
      cliente: 'Desarrollos Balvanera',
      residente: 'Arq. Sofia Vargas',
      direccion: 'Corregidora, Querétaro',
      fecha_inicio: '2025-01-01',
      fecha_fin_estimada: '2026-01-31',
      presupuesto_total: 7500000.00,
      estatus: 'activa',
      created_at: '2025-01-01T08:00:00Z',
      updated_at: '2025-01-01T08:00:00Z',
    },
    {
      obra_id: 'obra_233',
      codigo_obra: '233',
      nombre_obra: 'DOZA C',
      cliente: 'Constructora Doza SA',
      residente: 'Ing. Fernando López',
      direccion: 'San Juan del Río, Querétaro',
      fecha_inicio: '2025-02-01',
      fecha_fin_estimada: '2025-12-31',
      presupuesto_total: 4200000.00,
      estatus: 'activa',
      created_at: '2025-02-01T08:00:00Z',
      updated_at: '2025-02-01T08:00:00Z',
    },
  ],

  // ========== PROVEEDORES ==========
  proveedores: [
    {
      proveedor_id: 'prov_001',
      alias_proveedor: 'CEMEX',
      razon_social: 'CEMEX México S.A. de C.V.',
      rfc: 'CMX940815A12',
      direccion: 'Av. Revolución 1425, Col. Campestre',
      ciudad: 'Monterrey',
      codigo_postal: '64000',
      telefono: '(81) 8888-0000',
      email: 'ventas@cemex.com',
      contacto_principal: 'Ing. Roberto Martínez',
      banco: 'BBVA',
      numero_cuenta: '0123456789',
      clabe: '012180001234567890',
      tipo_proveedor: 'material',
      dias_credito: 30,
      limite_credito: 500000.00,
      activo: true,
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z',
    },
    {
      proveedor_id: 'prov_002',
      alias_proveedor: 'LEVINSON',
      razon_social: 'Aceros Levinson S.A. de C.V.',
      rfc: 'LEV850203B34',
      direccion: 'Circuito Interior 234',
      ciudad: 'Ciudad de México',
      codigo_postal: '11000',
      telefono: '(55) 5555-3456',
      email: 'ventas@levinson.com.mx',
      contacto_principal: 'Ing. Carlos Pérez',
      banco: 'Santander',
      numero_cuenta: '9876543210',
      clabe: '014180009876543210',
      tipo_proveedor: 'material',
      dias_credito: 15,
      limite_credito: 800000.00,
      activo: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      proveedor_id: 'prov_003',
      alias_proveedor: 'INTERCERAMIC',
      razon_social: 'Interceramic S.A. de C.V.',
      rfc: 'INT760512C56',
      direccion: 'Periférico Norte 456',
      ciudad: 'Chihuahua',
      codigo_postal: '31000',
      telefono: '(614) 4444-5555',
      email: 'contacto@interceramic.com',
      contacto_principal: 'Arq. Ana García',
      banco: 'Banamex',
      numero_cuenta: '5555666677',
      clabe: '002180005555666677',
      tipo_proveedor: 'material',
      dias_credito: 30,
      limite_credito: 300000.00,
      activo: true,
      created_at: '2024-02-01T10:00:00Z',
      updated_at: '2024-02-01T10:00:00Z',
    },
    {
      proveedor_id: 'prov_004',
      alias_proveedor: 'BEREL',
      razon_social: 'Pinturas Berel S.A. de C.V.',
      rfc: 'BER830622D78',
      direccion: 'Calzada Vallejo 800',
      ciudad: 'Ciudad de México',
      codigo_postal: '07000',
      telefono: '(55) 5555-9012',
      email: 'ventas@berel.com.mx',
      contacto_principal: 'Lic. Sofia Vargas',
      banco: 'HSBC',
      numero_cuenta: '1122334455',
      clabe: '021180001122334455',
      tipo_proveedor: 'material',
      dias_credito: 0,
      limite_credito: 150000.00,
      activo: true,
      created_at: '2024-02-15T10:00:00Z',
      updated_at: '2024-02-15T10:00:00Z',
    },
    {
      proveedor_id: 'prov_005',
      alias_proveedor: 'HIERROS',
      razon_social: 'Hierros y Materiales S.A. de C.V.',
      rfc: 'HMA920404E90',
      direccion: 'Carr. Querétaro-México Km 12',
      ciudad: 'Querétaro',
      codigo_postal: '76000',
      telefono: '(442) 2222-4567',
      email: 'ventas@hierros.com',
      contacto_principal: 'Sr. Juan Hernández',
      banco: 'Banorte',
      numero_cuenta: '3344556677',
      clabe: '072180003344556677',
      tipo_proveedor: 'material',
      dias_credito: 15,
      limite_credito: 600000.00,
      activo: true,
      created_at: '2024-03-01T10:00:00Z',
      updated_at: '2024-03-01T10:00:00Z',
    },
    {
      proveedor_id: 'prov_006',
      alias_proveedor: 'HOME_DEPOT',
      razon_social: 'The Home Depot México S. de R.L. de C.V.',
      rfc: 'HDM971205F12',
      direccion: 'Blvd. Manuel Ávila Camacho 2915',
      ciudad: 'Tlalnepantla',
      codigo_postal: '54020',
      telefono: '(55) 5555-8888',
      email: 'comercial@homedepot.com.mx',
      contacto_principal: 'Lic. María Rodríguez',
      banco: 'Scotia',
      numero_cuenta: '7788990011',
      clabe: '044180007788990011',
      tipo_proveedor: 'mixto',
      dias_credito: 0,
      limite_credito: 200000.00,
      activo: true,
      created_at: '2024-03-10T10:00:00Z',
      updated_at: '2024-03-10T10:00:00Z',
    },
  ],

  // ========== REQUISICIONES MATERIAL ==========
  requisiciones_material: [
    {
      requisicion_id: 'req_001',
      numero_requisicion: 'REQ227-001MAT',
      obra_id: 'obra_227',
      residente_nombre: 'Ing. Miguel Ángel Torres',
      fecha_creacion: '2025-01-10',
      fecha_entrega_requerida: '2025-01-17',
      urgencia: 'urgente',
      estatus: 'convertida_oc',
      observaciones: 'Necesario para cimentación programada',
      created_at: '2025-01-10T09:30:00Z',
      updated_at: '2025-01-10T11:00:00Z',
    },
    {
      requisicion_id: 'req_002',
      numero_requisicion: 'REQ228-001LM',
      obra_id: 'obra_228',
      residente_nombre: 'Arq. Laura Martínez',
      fecha_creacion: '2025-01-11',
      fecha_entrega_requerida: '2025-01-20',
      urgencia: 'normal',
      estatus: 'pendiente',
      observaciones: null,
      created_at: '2025-01-11T10:00:00Z',
      updated_at: '2025-01-11T10:00:00Z',
    },
    {
      requisicion_id: 'req_003',
      numero_requisicion: 'REQ229-001RS',
      obra_id: 'obra_229',
      residente_nombre: 'Ing. Roberto Sánchez',
      fecha_creacion: '2025-01-09',
      fecha_entrega_requerida: '2025-01-25',
      urgencia: 'normal',
      estatus: 'en_revision',
      observaciones: 'Verificar que sea el mismo tono que la muestra',
      created_at: '2025-01-09T14:00:00Z',
      updated_at: '2025-01-09T14:00:00Z',
    },
    {
      requisicion_id: 'req_004',
      numero_requisicion: 'REQ231-001CR',
      obra_id: 'obra_231',
      residente_nombre: 'Ing. Carlos Ramírez',
      fecha_creacion: '2025-01-12',
      fecha_entrega_requerida: '2025-01-19',
      urgencia: 'urgente',
      estatus: 'pendiente',
      observaciones: null,
      created_at: '2025-01-12T08:00:00Z',
      updated_at: '2025-01-12T08:00:00Z',
    },
    {
      requisicion_id: 'req_005',
      numero_requisicion: 'REQ232-001SV',
      obra_id: 'obra_232',
      residente_nombre: 'Arq. Sofia Vargas',
      fecha_creacion: '2025-01-13',
      fecha_entrega_requerida: '2025-01-30',
      urgencia: 'planeado',
      estatus: 'aprobada',
      observaciones: null,
      created_at: '2025-01-13T09:00:00Z',
      updated_at: '2025-01-13T09:00:00Z',
    },
  ],

  // ========== REQUISICIONES ITEMS ==========
  requisiciones_material_items: [
    // REQ227-001MAT (req_001)
    {
      item_id: 'req_item_001',
      requisicion_id: 'req_001',
      descripcion: 'Cemento gris CPC 30R',
      cantidad: 100,
      unidad: 'BULTO',
      orden_item: 1,
      created_at: '2025-01-10T09:30:00Z',
    },
    {
      item_id: 'req_item_002',
      requisicion_id: 'req_001',
      descripcion: 'Arena fina de río',
      cantidad: 5,
      unidad: 'M3',
      orden_item: 2,
      created_at: '2025-01-10T09:30:00Z',
    },
    // REQ228-001LM (req_002)
    {
      item_id: 'req_item_003',
      requisicion_id: 'req_002',
      descripcion: 'Varilla corrugada 3/8',
      cantidad: 250,
      unidad: 'PZA',
      orden_item: 1,
      created_at: '2025-01-11T10:00:00Z',
    },
    {
      item_id: 'req_item_004',
      requisicion_id: 'req_002',
      descripcion: 'Alambrón',
      cantidad: 50,
      unidad: 'KG',
      orden_item: 2,
      created_at: '2025-01-11T10:00:00Z',
    },
    // REQ229-001RS (req_003)
    {
      item_id: 'req_item_005',
      requisicion_id: 'req_003',
      descripcion: 'Piso porcelanato 60x60 cm',
      cantidad: 150,
      unidad: 'M2',
      orden_item: 1,
      created_at: '2025-01-09T14:00:00Z',
    },
    // REQ231-001CR (req_004)
    {
      item_id: 'req_item_006',
      requisicion_id: 'req_004',
      descripcion: 'Block hueco 15x20x40',
      cantidad: 5000,
      unidad: 'PZA',
      orden_item: 1,
      created_at: '2025-01-12T08:00:00Z',
    },
    {
      item_id: 'req_item_007',
      requisicion_id: 'req_004',
      descripcion: 'Mortero para pegar block',
      cantidad: 80,
      unidad: 'BULTO',
      orden_item: 2,
      created_at: '2025-01-12T08:00:00Z',
    },
    // REQ232-001SV (req_005)
    {
      item_id: 'req_item_008',
      requisicion_id: 'req_005',
      descripcion: 'Tubería PVC 4 pulgadas',
      cantidad: 100,
      unidad: 'M',
      orden_item: 1,
      created_at: '2025-01-13T09:00:00Z',
    },
  ],

  // ========== REQUISICIONES COMENTARIOS ==========
  requisiciones_comentarios: [
    {
      comentario_id: 'req_com_001',
      requisicion_id: 'req_001',
      autor: 'Ing. Miguel Ángel Torres',
      rol: 'Residente',
      mensaje: 'Necesario para cimentación programada',
      fecha_comentario: '2025-01-10T09:30:00Z',
    },
    {
      comentario_id: 'req_com_002',
      requisicion_id: 'req_001',
      autor: 'Departamento de Compras',
      rol: 'Compras',
      mensaje: 'Entendido, generando OC con CEMEX',
      fecha_comentario: '2025-01-10T11:00:00Z',
    },
    {
      comentario_id: 'req_com_003',
      requisicion_id: 'req_003',
      autor: 'Ing. Roberto Sánchez',
      rol: 'Residente',
      mensaje: 'Verificar que sea el mismo tono que la muestra',
      fecha_comentario: '2025-01-09T14:00:00Z',
    },
  ],

  // ========== ÓRDENES DE COMPRA ==========
  ordenes_compra: [
    // OC #1 - CEMEX (obra_227)
    {
      oc_id: 'oc_001',
      numero_oc: '227-A01GM-CEMEX',
      obra_id: 'obra_227',
      proveedor_id: 'prov_001', // CEMEX
      comprador: 'Gabriela Mendoza',
      fecha_creacion: '2025-01-05',
      fecha_entrega: '2025-01-20',
      tipo_entrega: 'entrega',
      aplica_iva: true,
      porcentaje_descuento: 0,
      subtotal: 34550.00,
      monto_descuento: 0,
      iva: 5528.00,
      total: 40078.00,
      observaciones: 'Entrega en obra, horario de 8am a 2pm',
      estatus: 'aprobada',
      created_at: '2025-01-05T10:00:00Z',
      updated_at: '2025-01-05T10:00:00Z',
    },
    // OC #2 - LEVINSON (obra_227)
    {
      oc_id: 'oc_002',
      numero_oc: '227-A02RS-LEVINSON',
      obra_id: 'obra_227',
      proveedor_id: 'prov_002', // LEVINSON
      comprador: 'Ricardo Sánchez',
      fecha_creacion: '2025-01-06',
      fecha_entrega: '2025-01-22',
      tipo_entrega: 'recoleccion',
      aplica_iva: true,
      porcentaje_descuento: 5,
      subtotal: 37000.00,
      monto_descuento: 1850.00,
      iva: 5624.00,
      total: 40774.00,
      observaciones: 'Recoger en almacén principal',
      estatus: 'entregada',
      created_at: '2025-01-06T10:00:00Z',
      updated_at: '2025-01-06T10:00:00Z',
    },
    // OC #3 - INTERCERAMIC (obra_228)
    {
      oc_id: 'oc_003',
      numero_oc: '228-A01JR-INTERCERAMIC',
      obra_id: 'obra_228',
      proveedor_id: 'prov_003', // INTERCERAMIC
      comprador: 'Juan Reyes',
      fecha_creacion: '2025-01-07',
      fecha_entrega: '2025-01-25',
      tipo_entrega: 'entrega',
      aplica_iva: true,
      porcentaje_descuento: 0,
      subtotal: 34800.00,
      monto_descuento: 0,
      iva: 5568.00,
      total: 40368.00,
      observaciones: null,
      estatus: 'pendiente',
      created_at: '2025-01-07T10:00:00Z',
      updated_at: '2025-01-07T10:00:00Z',
    },
    // OC #4 - BEREL (obra_229) - Sin IVA (Gobierno)
    {
      oc_id: 'oc_004',
      numero_oc: '229-A01GM-BEREL',
      obra_id: 'obra_229',
      proveedor_id: 'prov_004', // BEREL
      comprador: 'Gabriela Mendoza',
      fecha_creacion: '2025-01-08',
      fecha_entrega: '2025-01-18',
      tipo_entrega: 'entrega',
      aplica_iva: false, // Gobierno
      porcentaje_descuento: 10,
      subtotal: 16800.00,
      monto_descuento: 1680.00,
      iva: 0,
      total: 15120.00,
      observaciones: 'Gobierno - Sin IVA',
      estatus: 'aprobada',
      created_at: '2025-01-08T10:00:00Z',
      updated_at: '2025-01-08T10:00:00Z',
    },
    // OC #5 - CEMEX (obra_231)
    {
      oc_id: 'oc_005',
      numero_oc: '231-A01RS-CEMEX',
      obra_id: 'obra_231',
      proveedor_id: 'prov_001', // CEMEX
      comprador: 'Ricardo Sánchez',
      fecha_creacion: '2025-01-10',
      fecha_entrega: '2025-01-28',
      tipo_entrega: 'entrega',
      aplica_iva: true,
      porcentaje_descuento: 0,
      subtotal: 27825.00,
      monto_descuento: 0,
      iva: 4452.00,
      total: 32277.00,
      observaciones: 'Entrega urgente para inicio de obra',
      estatus: 'pendiente',
      created_at: '2025-01-10T10:00:00Z',
      updated_at: '2025-01-10T10:00:00Z',
    },
    // OC #6 - HIERROS (obra_232)
    {
      oc_id: 'oc_006',
      numero_oc: '232-A01JR-HIERROS',
      obra_id: 'obra_232',
      proveedor_id: 'prov_005', // HIERROS
      comprador: 'Juan Reyes',
      fecha_creacion: '2025-01-11',
      fecha_entrega: '2025-01-30',
      tipo_entrega: 'entrega',
      aplica_iva: true,
      porcentaje_descuento: 3,
      subtotal: 67500.00,
      monto_descuento: 2025.00,
      iva: 10476.00,
      total: 75951.00,
      observaciones: '',
      estatus: 'aprobada',
      created_at: '2025-01-11T10:00:00Z',
      updated_at: '2025-01-11T10:00:00Z',
    },
  ],

  // ========== ÓRDENES DE COMPRA ITEMS ==========
  ordenes_compra_items: [
    // OC #1 - CEMEX
    {
      item_id: 'oc_item_001',
      oc_id: 'oc_001',
      descripcion: 'Cemento gris CPC 30R',
      cantidad: 100,
      unidad: 'BULTO',
      precio_unitario: 185.50,
      subtotal_item: 18550.00,
      orden_item: 1,
      created_at: '2025-01-05T10:00:00Z',
    },
    {
      item_id: 'oc_item_002',
      oc_id: 'oc_001',
      descripcion: 'Arena fina de río',
      cantidad: 50,
      unidad: 'M3',
      precio_unitario: 320.00,
      subtotal_item: 16000.00,
      orden_item: 2,
      created_at: '2025-01-05T10:00:00Z',
    },
    // OC #2 - LEVINSON
    {
      item_id: 'oc_item_003',
      oc_id: 'oc_002',
      descripcion: 'Varilla corrugada 3/8',
      cantidad: 200,
      unidad: 'PZA',
      precio_unitario: 185.00,
      subtotal_item: 37000.00,
      orden_item: 1,
      created_at: '2025-01-06T10:00:00Z',
    },
    // OC #3 - INTERCERAMIC
    {
      item_id: 'oc_item_004',
      oc_id: 'oc_003',
      descripcion: 'Piso porcelanato 60x60 cm',
      cantidad: 120,
      unidad: 'M2',
      precio_unitario: 245.00,
      subtotal_item: 29400.00,
      orden_item: 1,
      created_at: '2025-01-07T10:00:00Z',
    },
    {
      item_id: 'oc_item_005',
      oc_id: 'oc_003',
      descripcion: 'Adhesivo para porcelanato',
      cantidad: 30,
      unidad: 'BULTO',
      precio_unitario: 180.00,
      subtotal_item: 5400.00,
      orden_item: 2,
      created_at: '2025-01-07T10:00:00Z',
    },
    // OC #4 - BEREL
    {
      item_id: 'oc_item_006',
      oc_id: 'oc_004',
      descripcion: 'Pintura vinílica blanco 19L',
      cantidad: 40,
      unidad: 'CUBETA',
      precio_unitario: 420.00,
      subtotal_item: 16800.00,
      orden_item: 1,
      created_at: '2025-01-08T10:00:00Z',
    },
    // OC #5 - CEMEX
    {
      item_id: 'oc_item_007',
      oc_id: 'oc_005',
      descripcion: 'Cemento gris CPC 30R',
      cantidad: 150,
      unidad: 'BULTO',
      precio_unitario: 185.50,
      subtotal_item: 27825.00,
      orden_item: 1,
      created_at: '2025-01-10T10:00:00Z',
    },
    // OC #6 - HIERROS
    {
      item_id: 'oc_item_008',
      oc_id: 'oc_006',
      descripcion: 'Varilla corrugada 1/2',
      cantidad: 300,
      unidad: 'PZA',
      precio_unitario: 225.00,
      subtotal_item: 67500.00,
      orden_item: 1,
      created_at: '2025-01-11T10:00:00Z',
    },
  ],

  // ========== PAGOS ==========
  pagos: [
    // Pago OC #1 - Parcial 50%
    {
      pago_id: 'pago_001',
      oc_id: 'oc_001',
      obra_id: 'obra_227',
      proveedor_id: 'prov_001',
      numero_pago: 'PAG-227-001',
      fecha_pago: '2025-01-15',
      monto_pagado: 20039.00, // 50% de 40078
      metodo_pago: 'transferencia',
      referencia_pago: 'TRF-20250115-001',
      banco: 'BBVA',
      factura_numero: 'F-CEMEX-001',
      factura_xml_url: null,
      factura_pdf_url: null,
      notas: 'Anticipo 50%',
      estatus: 'aplicado',
      created_at: '2025-01-15T14:00:00Z',
      updated_at: '2025-01-15T14:00:00Z',
    },
    // Pago OC #2 - Total
    {
      pago_id: 'pago_002',
      oc_id: 'oc_002',
      obra_id: 'obra_227',
      proveedor_id: 'prov_002',
      numero_pago: 'PAG-227-002',
      fecha_pago: '2025-01-23',
      monto_pagado: 40774.00,
      metodo_pago: 'transferencia',
      referencia_pago: 'TRF-20250123-001',
      banco: 'Santander',
      factura_numero: 'F-LEV-045',
      factura_xml_url: null,
      factura_pdf_url: null,
      notas: 'Pago total contra entrega',
      estatus: 'aplicado',
      created_at: '2025-01-23T10:00:00Z',
      updated_at: '2025-01-23T10:00:00Z',
    },
    // Pago OC #4 - Parcial 30%
    {
      pago_id: 'pago_003',
      oc_id: 'oc_004',
      obra_id: 'obra_229',
      proveedor_id: 'prov_004',
      numero_pago: 'PAG-229-001',
      fecha_pago: '2025-01-12',
      monto_pagado: 4536.00, // 30% de 15120
      metodo_pago: 'transferencia',
      referencia_pago: 'TRF-20250112-001',
      banco: 'HSBC',
      factura_numero: 'F-BEREL-112',
      factura_xml_url: null,
      factura_pdf_url: null,
      notas: 'Anticipo 30%',
      estatus: 'aplicado',
      created_at: '2025-01-12T11:00:00Z',
      updated_at: '2025-01-12T11:00:00Z',
    },
  ],

  // ========== ENTREGAS (Futuro) ==========
  entregas: [
    {
      entrega_id: 'entrega_001',
      oc_id: 'oc_002',
      obra_id: 'obra_227',
      numero_entrega: 'ENT-227-001',
      fecha_entrega: '2025-01-22',
      quien_recibe: 'Ing. Miguel Ángel Torres',
      observaciones: 'Material completo y en buen estado',
      estatus: 'completa',
      created_at: '2025-01-22T15:00:00Z',
      updated_at: '2025-01-22T15:00:00Z',
    },
  ],

  // ========== ENTREGAS ITEMS ==========
  entregas_items: [
    {
      entrega_item_id: 'ent_item_001',
      entrega_id: 'entrega_001',
      oc_item_id: 'oc_item_003', // Varilla 3/8
      cantidad_entregada: 200,
      observaciones: null,
      created_at: '2025-01-22T15:00:00Z',
    },
  ],
};

// ============================================================================
// HELPER: Modo vacío para testing
// ============================================================================

/**
 * Base de datos vacía para probar estados sin datos
 * Cambia TEST_EMPTY_STATE = true en config.ts para activar
 */
export const emptyDatabase: MockDatabase = {
  obras: [],
  proveedores: [],
  requisiciones_material: [],
  requisiciones_material_items: [],
  requisiciones_comentarios: [],
  ordenes_compra: [],
  ordenes_compra_items: [],
  pagos: [],
  entregas: [],
  entregas_items: [],
};