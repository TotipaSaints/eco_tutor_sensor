import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SensorService } from './sensor.service';

@ApiTags('Sensor')
@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @ApiOperation({ summary: 'Obtener estadísticas de los sensores' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas con éxito' })
  @ApiResponse({ status: 500, description: 'Error al obtener estadísticas' })
  @Get('estadisticas')
  async obtenerEstadisticas() {
    try {
      const estadisticas = await this.sensorService.obtenerEstadisticas();
      return {
        message: 'Estadísticas obtenidas con éxito',
        data: estadisticas,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener estadísticas',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
