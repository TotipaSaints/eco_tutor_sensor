import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({
    description: 'Código de estado de la respuesta',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de la respuesta',
    example: 'Operación exitosa',
  })
  message: string;

  @ApiProperty({ description: 'Datos de la respuesta', type: Object })
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
