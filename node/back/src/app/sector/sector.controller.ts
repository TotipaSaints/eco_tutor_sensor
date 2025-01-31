import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { SectorService } from './sector.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { CreateSensorDto } from '../sensor/dto/create-sensor.dto';
import { Sector } from './shema/sector.schema';

@ApiTags('Sector')
@Controller('sector')
export class SectorController {
  constructor(private readonly sectorService: SectorService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un sector' })
  @ApiBody({ type: CreateSectorDto })
  @ApiResponse({ status: 201, description: 'Sector creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el sector' })
  async create(@Body() createSectorDto: CreateSectorDto) {
    try {
      return await this.sectorService.create(createSectorDto);
    } catch (error) {
      throw new HttpException(
        `Error creating sector: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los sectores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de sectores obtenida exitosamente',
  })
  @ApiResponse({ status: 500, description: 'Error al obtener los sectores' })
  async findAll() {
    try {
      return await this.sectorService.findAll();
    } catch (error) {
      throw new HttpException(
        `Error fetching sectors: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':sectorName/arboles/:treeName/sensores')
  @ApiOperation({ summary: 'Agregar sensores a un árbol en un sector' })
  @ApiParam({ name: 'sectorName', description: 'Nombre del sector' })
  @ApiParam({ name: 'treeName', description: 'Nombre del árbol' })
  @ApiBody({ type: [CreateSensorDto] })
  @ApiResponse({ status: 201, description: 'Sensores agregados exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al agregar sensores' })
  async addSensor(
    @Param('sectorName') sectorName: string,
    @Param('treeName') treeName: string,
    @Body() sensorDtos: CreateSensorDto[],
  ) {
    try {
      console.log(
        `[INFO] ${new Date().toISOString()} - Registro de entrada del sensor (${treeName}):`,
        JSON.stringify(sensorDtos, null, 2),
      );

      return await this.sectorService.addSensorsToTree(
        sectorName,
        treeName,
        sensorDtos,
      );
    } catch (error) {
      throw new HttpException(
        `Error adding sensor: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':nombreSector/arboles/:nombreArbol')
  @ApiOperation({ summary: 'Agregar un árbol a un sector' })
  @ApiParam({ name: 'nombreSector', description: 'Nombre del sector' })
  @ApiParam({ name: 'nombreArbol', description: 'Nombre del árbol' })
  @ApiResponse({ status: 201, description: 'Árbol agregado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al agregar el árbol' })
  async agregarArbolASectorPorNombre(
    @Param('nombreSector') nombreSector: string,
    @Param('nombreArbol') nombreArbol: string,
  ): Promise<Sector> {
    return this.sectorService.agregarArbolASectorPorNombre(
      nombreSector,
      nombreArbol,
    );
  }

  @Get('informe')
  @ApiOperation({ summary: 'Generar informe en formato Markdown' })
  @ApiResponse({ status: 200, description: 'Informe generado exitosamente' })
  @ApiResponse({ status: 500, description: 'Error al generar el informe' })
  async generarInforme(): Promise<string> {
    try {
      await this.sectorService.generarInformeMD();
      return 'Informe generado con éxito!';
    } catch (error) {
      console.error('Error generando el informe:', error);
      throw new Error('No se pudo generar el informe');
    }
  }
}
