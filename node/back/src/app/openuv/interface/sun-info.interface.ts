import { SunTimes } from './sun-times.interface';
import { SunPosition } from './sun-position.interface';

/**
 * Información del sol, que incluye los horarios y la posición.
 */
export interface SunInfo {
  /**
   * Horarios importantes relacionados con el sol.
   */
  sun_times: SunTimes;

  /**
   * Posición del sol en el cielo.
   */
  sun_position: SunPosition;
}
