import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Captura todas las excepciones HTTP.
   * @param {HttpException} exception Excepción capturada.
   * @param {ArgumentsHost} host Información del contexto de la solicitud.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message: exceptionResponse['message'] || 'Error inesperado',
      error: exceptionResponse['error'] || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  }
}
