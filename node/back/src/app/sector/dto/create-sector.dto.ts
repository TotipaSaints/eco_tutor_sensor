import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';
import { ArbolDto } from 'src/app/arbol/dto/create-arbol.dto';

export class CreateSectorDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsArray()
  @IsOptional()
  arboles?: ArbolDto[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  coordenadas?: [number, number][];
}
