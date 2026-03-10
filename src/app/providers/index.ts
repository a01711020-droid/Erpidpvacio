/**
 * DATA PROVIDER - Solo Mock (Frontend Puro)
 * 
 * Sistema simplificado sin backend.
 * Todos los datos se manejan en memoria local.
 */

import { MockProvider, mockProvider } from './MockProvider';
import type { IDataProvider } from './DataProvider.interface';

/**
 * Provider activo (solo mock - frontend puro)
 */
export const dataProvider = mockProvider;

/**
 * Exportar tipos y clases
 */
export type { IDataProvider } from './DataProvider.interface';
export { MockProvider, mockProvider };
