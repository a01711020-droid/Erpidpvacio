/**
 * DATA ADAPTER - EXPORT POINT
 * 
 * Punto de entrada único para el adaptador de datos
 * Cambia entre mockAdapter y apiAdapter según configuración
 */

import { mockAdapterWithDevMode } from './mockAdapterWithDevMode';
import { MOCK_MODE } from '../config';

/**
 * DataAdapter activo
 * 
 * En desarrollo: mockAdapterWithDevMode (con control de UI)
 * En producción: apiAdapter (pendiente)
 */
export const dataAdapter = MOCK_MODE ? mockAdapterWithDevMode : mockAdapterWithDevMode; // TODO: Cambiar segundo a apiAdapter cuando esté listo

// Re-exports
export * from './dataAdapter';
export * from './types';