/**
 * CONSTANTES DEL SISTEMA
 * IDs y valores de referencia para los datos mock
 */

// ============================================================================
// IDs DE OBRA CASTELLO E (Obra principal en mock data)
// ============================================================================

/**
 * ID de la obra CASTELLO E en el sistema
 * Usar este ID para todas las operaciones relacionadas con la obra 227
 */
export const OBRA_CASTELLO_E_ID = "550e8400-e29b-41d4-a716-446655440000";

/**
 * Código de la obra CASTELLO E
 */
export const OBRA_CASTELLO_E_CODE = "227";

// ============================================================================
// IDs DE PROVEEDORES
// ============================================================================

export const PROVEEDOR_IDS = {
  AGREGADOS_DEL_NORTE: "660e8400-e29b-41d4-a716-446655440001",
  ACEROS_ESTRUCTURALES: "660e8400-e29b-41d4-a716-446655440002",
  CONCRETOS_DEL_CENTRO: "660e8400-e29b-41d4-a716-446655440003",
  ELECTROPRO: "660e8400-e29b-41d4-a716-446655440004",
  MADERAS_DEL_BAJIO: "660e8400-e29b-41d4-a716-446655440005",
};

// ============================================================================
// IDs DE REQUISICIONES DE OBRA 227
// ============================================================================

export const REQUISICION_IDS = {
  REQ_227_001: "770e8400-e29b-41d4-a716-446655440001", // Completada - Material para cimentación
  REQ_227_002: "770e8400-e29b-41d4-a716-446655440002", // Completada - Acero para estructura
  REQ_227_003: "770e8400-e29b-41d4-a716-446655440003", // Aprobada - Material eléctrico
  REQ_227_004: "770e8400-e29b-41d4-a716-446655440004", // Pendiente - Material para losa
};

// ============================================================================
// IDs DE ÓRDENES DE COMPRA DE OBRA 227
// ============================================================================

export const ORDEN_COMPRA_IDS = {
  OC_227_001: "880e8400-e29b-41d4-a716-446655440001", // Entregada - Agregados del Norte
  OC_227_002: "880e8400-e29b-41d4-a716-446655440002", // Entregada - Aceros Estructurales
  OC_227_003: "880e8400-e29b-41d4-a716-446655440003", // Enviada - Electropro
};

// ============================================================================
// IDs DE PAGOS DE OBRA 227
// ============================================================================

export const PAGO_IDS = {
  PAG_227_001: "990e8400-e29b-41d4-a716-446655440001", // Completado - OC-227-001
  PAG_227_002: "990e8400-e29b-41d4-a716-446655440002", // Completado - Anticipo 50% OC-227-002
  PAG_227_003: "990e8400-e29b-41d4-a716-446655440003", // Completado - Liquidación 50% OC-227-002
  PAG_227_004: "990e8400-e29b-41d4-a716-446655440004", // Programado - OC-227-003
};

// ============================================================================
// IDs DE DESTAJOS DE OBRA 227
// ============================================================================

export const DESTAJO_IDS = {
  DES_227_001: "aa0e8400-e29b-41d4-a716-446655440001", // Completado - Excavación y relleno
  DES_227_002: "aa0e8400-e29b-41d4-a716-446655440002", // Completado - Armado de acero
  DES_227_003: "aa0e8400-e29b-41d4-a716-446655440003", // En Proceso - Cimbrado
  DES_227_004: "aa0e8400-e29b-41d4-a716-446655440004", // Pendiente - Instalación sanitaria
};

// ============================================================================
// IDs DE USUARIOS
// ============================================================================

export const USUARIO_IDS = {
  ADMIN: "bb0e8400-e29b-41d4-a716-446655440001", // Ing. Jorge Hernández
  RESIDENTE_CASTELLO_E: "bb0e8400-e29b-41d4-a716-446655440002", // Ing. Miguel Ángel Torres
  PAGOS: "bb0e8400-e29b-41d4-a716-446655440003", // Lic. Ana Martínez
  COMPRAS: "bb0e8400-e29b-41d4-a716-446655440004", // Ing. Carmen Ruiz
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtiene el ID de una obra por su código
 * En el sistema mock solo tenemos obra 227, pero esta función
 * está preparada para cuando haya más obras
 */
export function getObraIdByCode(code: string): string | null {
  if (code === OBRA_CASTELLO_E_CODE) {
    return OBRA_CASTELLO_E_ID;
  }
  return null;
}

/**
 * Verifica si un ID pertenece a la obra CASTELLO E
 */
export function isObraCastelloE(obraId: string): boolean {
  return obraId === OBRA_CASTELLO_E_ID;
}

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

/*
import { OBRA_CASTELLO_E_ID } from "@/app/constants";
import { dataProvider } from "@/app/providers";

// Obtener datos de la obra CASTELLO E
const obra = await dataProvider.obras.getById(OBRA_CASTELLO_E_ID);

// Listar requisiciones de la obra
const requisiciones = await dataProvider.requisiciones.list({
  filters: { obraId: OBRA_CASTELLO_E_ID }
});

// Obtener resumen financiero
const summary = await dataProvider.obras.getFinancialSummary(OBRA_CASTELLO_E_ID);
*/
