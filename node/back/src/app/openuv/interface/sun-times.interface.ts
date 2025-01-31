/**
 * Representa los horarios del sol.
 */
export interface SunTimes {
  /**
   * Hora del mediodía solar.
   */
  solarNoon: string;

  /**
   * Hora del nadir (punto más bajo del sol en el cielo).
   */
  nadir: string;

  /**
   * Hora del amanecer.
   */
  sunrise: string;

  /**
   * Hora del atardecer.
   */
  sunset: string;

  /**
   * Hora final del amanecer.
   */
  sunriseEnd: string;

  /**
   * Hora de inicio del atardecer.
   */
  sunsetStart: string;

  /**
   * Hora del alba (cuando empieza a amanecer).
   */
  dawn: string;

  /**
   * Hora del crepúsculo (cuando se apaga la luz del sol).
   */
  dusk: string;

  /**
   * Hora del amanecer náutico.
   */
  nauticalDawn: string;

  /**
   * Hora del atardecer náutico.
   */
  nauticalDusk: string;

  /**
   * Hora de finalización de la noche.
   */
  nightEnd: string;

  /**
   * Hora de inicio de la noche.
   */
  night: string;

  /**
   * Hora de finalización de la hora dorada.
   */
  goldenHourEnd: string;

  /**
   * Hora de inicio de la hora dorada.
   */
  goldenHour: string;
}
