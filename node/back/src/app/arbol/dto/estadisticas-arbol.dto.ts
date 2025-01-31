import { ApiProperty } from '@nestjs/swagger';

export class EstadisticasArbolDto {
  @ApiProperty()
  fechaSaliente: string;

  @ApiProperty()
  mayorTemperatura: number;

  @ApiProperty()
  menorTemperatura: number;

  @ApiProperty()
  estadoClimaMayorTemperatura: string;

  @ApiProperty()
  estadoClimaMenorTemperatura: string;

  @ApiProperty()
  mayorHumedad: number;

  @ApiProperty()
  menorHumedad: number;

  @ApiProperty()
  estadoClimaMayorHumedad: string;

  @ApiProperty()
  estadoClimaMenorHumedad: string;

  // @ApiProperty()
  // mayorUV: number;

  @ApiProperty()
  estadoUVMayor: string;
}
