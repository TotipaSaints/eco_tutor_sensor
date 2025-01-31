/**
 * Representa la posición del sol en el cielo.
 */
export interface SunPosition {
  /**
   * Azimut del sol (ángulo desde el norte hacia el este).
   */
  azimuth: number;

  /**
   * Altitud del sol en el cielo (en grados).
   */
  altitude: number;
}
