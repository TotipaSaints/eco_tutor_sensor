import { SafeExposureTime } from './safe-exposure-time.interface';
import { SunInfo } from './sun-info.interface';

/**
 * Resultados obtenidos de la API OpenUV relacionados con la radiación UV y la exposición al sol.
 */
export interface Result {
  /**
   * Valor actual de la radiación UV.
   */
  uv: number;

  /**
   * Hora en la que se registró el valor de la radiación UV.
   */
  uv_time: string;

  /**
   * Valor máximo de la radiación UV.
   */
  uv_max: number;

  /**
   * Hora en la que se registró el valor máximo de la radiación UV.
   */
  uv_max_time: string;

  /**
   * Nivel de ozono.
   */
  ozone: number;

  /**
   * Hora en la que se registró el nivel de ozono.
   */
  ozone_time: string;

  /**
   * Tiempos seguros de exposición al sol según niveles de radiación UV.
   */
  safe_exposure_time: SafeExposureTime;

  /**
   * Información adicional sobre el sol, como horarios y posición.
   */
  sun_info: SunInfo;
}
