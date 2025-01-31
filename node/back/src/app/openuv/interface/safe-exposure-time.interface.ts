/**
 * Representa los tiempos de exposición segura al sol según niveles de UV.
 */
export interface SafeExposureTime {
  /**
   * Tiempo seguro para exposición al sol para el nivel 1 de radiación UV.
   */
  st1: number;

  /**
   * Tiempo seguro para exposición al sol para el nivel 2 de radiación UV.
   */
  st2: number;

  /**
   * Tiempo seguro para exposición al sol para el nivel 3 de radiación UV.
   */
  st3: number;

  /**
   * Tiempo seguro para exposición al sol para el nivel 4 de radiación UV.
   */
  st4: number;

  /**
   * Tiempo seguro para exposición al sol para el nivel 5 de radiación UV.
   */
  st5: number;

  /**
   * Tiempo seguro para exposición al sol para el nivel 6 de radiación UV.
   */
  st6: number;
}
