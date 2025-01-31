import axios, { AxiosInstance } from 'axios';

/**
 * AxiosFactory es una clase para crear instancias de Axios con configuración personalizada.
 */
export class AxiosFactory {
  /**
   * Crea una instancia de Axios con una URL base proporcionada, un tiempo de espera y encabezados personalizados.
   *
   * @param {string} baseURL La URL base para la instancia de Axios.
   * @param {Record<string, string>} [headers] Los encabezados personalizados a incluir.
   * @returns {AxiosInstance} Una nueva instancia de Axios configurada.
   */
  static createInstance(
    baseURL: string,
    headers?: Record<string, string>,
  ): AxiosInstance {
    const instance = axios.create({
      baseURL: baseURL,
      timeout: 5000,
      headers: headers,
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Axios error:', error);
        return Promise.reject(error);
      },
    );

    return instance;
  }

  /**
   * Realiza una solicitud GET con encabezados personalizados.
   * @param {AxiosInstance} instance La instancia de Axios que se usará para la solicitud.
   * @param {string} url La URL del endpoint a llamar.
   * @param {Record<string, string>} [headers] Los encabezados personalizados para esta solicitud.
   * @returns {Promise} La promesa de la solicitud.
   */
  static getWithHeaders(
    instance: AxiosInstance,
    url: string,
    headers?: Record<string, string>,
  ) {
    return instance.get(url, { headers });
  }

  /**
   * Realiza una solicitud POST con encabezados personalizados.
   * @param {AxiosInstance} instance La instancia de Axios que se usará para la solicitud.
   * @param {string} url La URL del endpoint a llamar.
   * @param {any} data Los datos a enviar en la solicitud POST.
   * @param {Record<string, string>} [headers] Los encabezados personalizados para esta solicitud.
   * @returns {Promise} La promesa de la solicitud.
   */
  static postWithHeaders(
    instance: AxiosInstance,
    url: string,
    data: any,
    headers?: Record<string, string>,
  ) {
    return instance.post(url, data, { headers });
  }
}
