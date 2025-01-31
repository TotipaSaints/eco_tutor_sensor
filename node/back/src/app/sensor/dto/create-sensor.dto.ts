import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSensorDto {
  @ApiProperty({ description: 'Nombre del sensor', example: 'Sensor1' })
  @IsInt()
  @IsNotEmpty()
  nombre_sensor: number;

  @ApiProperty({ description: 'ID del sensor', example: '123' })
  @IsInt()
  @IsNotEmpty()
  id_sensor: string;

  @ApiProperty({ description: 'Valor de humedad', example: 65 })
  @IsInt()
  @IsNotEmpty()
  humedad: number;

  @ApiProperty({
    description: 'Fecha de medición',
    example: '2025-01-01T12:00:00Z',
    required: false,
  })
  @ApiProperty({ required: false })
  fecha: Date;
}
