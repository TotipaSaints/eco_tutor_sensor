import { IsString, IsArray, IsOptional } from 'class-validator';
import { CreateSensorDto } from 'src/app/sensor/dto/create-sensor.dto';

export class ArbolDto {
  @IsString()
  nombre_comun: string;

  @IsString()
  especie: string;

  @IsString()
  descripcion: string;

  @IsArray()
  @IsOptional()
  sensores: CreateSensorDto[];
}
