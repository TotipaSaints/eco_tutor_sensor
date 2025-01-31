import { Result } from './result.interface';

/**
 * Estructura completa de los datos obtenidos desde la API OpenUV.
 */
export interface OpenUVData {
  /**
   * Resultados relacionados con la radiación UV y otros datos solares.
   */
  result: Result;
}
