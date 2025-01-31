import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ArbolService } from './arbol.service';
import { Arbol } from './shema/arbol.schema';
import { ArbolDto } from './dto/create-arbol.dto';
import { ResponseDto } from '../common/dto/response.dto';
import { EstadisticasArbolDto } from './dto/estadisticas-arbol.dto';

@ApiTags('Arbol')
@Controller('arbol')
export class ArbolController {
  constructor(private readonly arbolService: ArbolService) {}

  // @Post()
  // @ApiOperation({ summary: 'Crear un árbol con sensores asociados' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'El árbol ha sido creado exitosamente',
  //   type: Arbol,
  // })
  // @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  // @ApiBody({ type: ArbolDto })
  // async create(@Body() arbolDto: ArbolDto): Promise<Arbol> {
  //   const sensoresMapped = arbolDto.sensores.map((sensor) => {
  //     return {
  //       id_sensor: sensor.id_sensor,
  //       nombre_sensor: sensor.nombre_sensor,
  //       humedad: sensor.humedad,
  //       fecha: new Date(),
  //     };
  //   });

  //   // return this.arbolService.create({
  //   //   ...arbolDto,
  //   //   sensores: sensoresMapped,
  //   // });
  // }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los árboles' })
  @ApiResponse({ status: 200, description: 'Lista de árboles', type: [Arbol] })
  findAll(): Promise<Arbol[]> {
    return this.arbolService.findAll();
  }

  @Get(':nombre_comun')
  @ApiOperation({ summary: 'Obtener un árbol por su nombre común' })
  @ApiParam({ name: 'nombre_comun', description: 'Nombre común del árbol' })
  @ApiResponse({ status: 200, description: 'Árbol encontrado', type: Arbol })
  @ApiResponse({ status: 404, description: 'Árbol no encontrado' })
  findOne(@Param('nombre_comun') nombre_comun: string): Promise<Arbol> {
    return this.arbolService.findOne(nombre_comun);
  }

  @Put(':nombre_comun')
  @ApiOperation({ summary: 'Actualizar un árbol por su nombre común' })
  @ApiParam({ name: 'nombre_comun', description: 'Nombre común del árbol' })
  @ApiResponse({ status: 200, description: 'Árbol actualizado', type: Arbol })
  @ApiResponse({ status: 404, description: 'Árbol no encontrado' })
  update(
    @Param('nombre_comun') nombre_comun: string,
    @Body() data: Partial<Arbol>,
  ): Promise<Arbol> {
    return this.arbolService.update(nombre_comun, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un árbol por su ID' })
  @ApiParam({ name: 'id', description: 'ID del árbol a eliminar' })
  @ApiResponse({ status: 200, description: 'Árbol eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Árbol no encontrado' })
  delete(@Param('id') id: string): Promise<void> {
    return this.arbolService.delete(id);
  }

  @Get(':nombre_comun/diferencias-humedad')
  @ApiOperation({ summary: 'Obtener diferencias de humedad para un árbol' })
  @ApiParam({ name: 'nombre_comun', description: 'Nombre común del árbol' })
  async getDiferenciasHumedad(
    @Param('nombre_comun') nombre_comun: string,
  ): Promise<any[]> {
    return this.arbolService.getHumedadByArbol(nombre_comun);
  }

  @Post('crear-sin-sensores')
  @ApiOperation({ summary: 'Crear un árbol sin sensores asociados' })
  @ApiBody({ type: ArbolDto })
  async crearArbolSinSensores(
    @Body() body: ArbolDto,
  ): Promise<ResponseDto<Arbol>> {
    const arbolCreado = await this.arbolService.crearArbolSinSensores(body);
    return new ResponseDto<Arbol>(
      200,
      'Árbol creado exitosamente',
      arbolCreado,
    );
  }

  @Get('nombre/:nombre/estadisticas')
  @ApiOperation({
    summary: 'Obtener estadísticas de temperatura y humedad para un árbol',
  })
  @ApiParam({ name: 'nombre', description: 'Nombre del árbol' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    type: [EstadisticasArbolDto],
  })
  async obtenerEstadisticas(
    @Param('nombre') nombre: string,
  ): Promise<ResponseDto<EstadisticasArbolDto[]>> {
    const data = await this.arbolService.obtenerEstadisticasPorNombre(nombre);
    await this.arbolService.generarMd(nombre);
    return new ResponseDto<EstadisticasArbolDto[]>(
      200,
      'estadísticas creadas exitosamente',
      data,
    );
  }
}
