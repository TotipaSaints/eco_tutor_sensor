import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Arbol } from './shema/arbol.schema';
import { Model } from 'mongoose';
import { Sensor } from '../sensor/shema/sensor.schema';
import { Sector } from '../sector/shema/sector.schema';
import { ArbolDto } from './dto/create-arbol.dto';
import { ERRORES } from './constants/arbol-mensajes';
import { EstadisticasArbolDto } from './dto/estadisticas-arbol.dto';
import * as fs from 'fs';

@Injectable()
export class ArbolService {
  constructor(
    @InjectModel(Arbol.name) private readonly arbolModel: Model<Arbol>,
    @InjectModel(Sensor.name) private readonly sensorModel: Model<Sensor>,
    @InjectModel(Sector.name) private readonly sectorModel: Model<Sector>,
  ) {}

  // async addArbolToSectorByNombreComun(
  //   sectorNombre: string,
  //   arbolNombreComun: string,
  // ): Promise<Sector> {
  //   // Buscar el sector por nombre
  //   const sector = await this.sectorModel.findOne({ nombre: sectorNombre });

  //   if (!sector) {
  //     throw new NotFoundException(
  //       `Sector con el nombre ${sectorNombre} no encontrado`,
  //     );
  //   }

  //   // // Crear el objeto que se va a agregar al array de arboles
  //   // const arbolObj = { nombre_comun: arbolNombreComun };

  //   // // Verificar si el árbol ya está asociado al sector por su nombre_comun
  //   // const isArbolExist = sector.arboles.some(
  //   //   (arbol) => arbol.nombre_comun === arbolNombreComun,
  //   // );

  //   // if (!isArbolExist) {
  //   //   sector.arboles.push(arbolObj); // Agregar el objeto con nombre_comun
  //   //   await sector.save(); // Guardar el sector con la actualización
  //   // }

  //   return sector;
  // }

  async findAll(): Promise<Arbol[]> {
    return this.arbolModel.find().populate('sensores').exec();
  }

  async findOne(nombre_comun: string): Promise<Arbol> {
    const arbol = await this.arbolModel
      .findOne({ nombre_comun })
      .populate('sensores')
      .exec();
    if (!arbol) throw new NotFoundException('Arbol not found');
    return arbol;
  }

  async update(id: string, data: Partial<Arbol>): Promise<Arbol> {
    const updatedArbol = await this.arbolModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('sensores')
      .exec();
    if (!updatedArbol) throw new NotFoundException('Arbol not found');
    return updatedArbol;
  }

  async delete(id: string): Promise<void> {
    const result = await this.arbolModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Arbol not found');
  }

  async getHumedadByArbol(nombre_comun: string) {
    const arbol = await this.arbolModel
      .findOne({ nombre_comun })
      .populate('sensores')
      .exec();

    if (!arbol) {
      throw new NotFoundException(
        `Árbol con nombre común ${nombre_comun} no encontrado`,
      );
    }

    const humedadPorDia = {};

    arbol.sensores.forEach((sensor: Sensor) => {
      const fecha = sensor.fecha.toISOString().split('T')[0];
      if (!humedadPorDia[fecha]) {
        humedadPorDia[fecha] = [];
      }
      humedadPorDia[fecha].push(sensor.humedad);
    });

    const resultado = Object.entries(humedadPorDia).map(
      ([fecha, humedades]: [string, number[]]) => {
        const humedadMaxima = Math.max(...humedades);
        const humedadMinima = Math.min(...humedades);
        const diferencia = humedadMaxima - humedadMinima;

        return {
          fecha,
          humedad_maxima: humedadMaxima + '%',
          humedad_minima: humedadMinima + '%',
          diferencia,
        };
      },
    );

    return resultado;
  }

  async crearArbolSinSensores(arbol: ArbolDto): Promise<Arbol> {
    try {
      const arbolExistente = await this.arbolModel.findOne({
        nombre_comun: arbol.nombre_comun,
      });

      if (arbolExistente) {
        throw new ConflictException(ERRORES.CONFLICTO);
      }

      const nuevoArbol = new this.arbolModel({
        nombre_comun: arbol.nombre_comun,
        especie: arbol.especie,
        descripcion: arbol.descripcion,
        sensores: [],
      });

      return await nuevoArbol.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORES.INTERNO, error.message);
    }
  }

  async obtenerEstadisticasPorArbol(arbolId: string) {
    const arbol = await this.arbolModel
      .findById(arbolId)
      .populate('sensores')
      .exec();

    let mayorTemperatura = -Infinity;
    let menorTemperatura = Infinity;
    let estadoClimaMayorTemperatura = '';
    let estadoClimaMenorTemperatura = '';

    let mayorHumedad = -Infinity;
    let menorHumedad = Infinity;
    let estadoClimaMayorHumedad = '';
    let estadoClimaMenorHumedad = '';

    arbol.sensores.forEach((sensor) => {
      const temperatura = parseFloat(
        sensor.temperatura_ambiental.replace(' °C', ''),
      );
      const { humedad, estado_clima } = sensor;

      if (temperatura > mayorTemperatura) {
        mayorTemperatura = temperatura;
        estadoClimaMayorTemperatura = estado_clima;
      }
      if (temperatura < menorTemperatura) {
        menorTemperatura = temperatura;
        estadoClimaMenorTemperatura = estado_clima;
      }

      if (humedad > mayorHumedad) {
        mayorHumedad = humedad;
        estadoClimaMayorHumedad = estado_clima;
      }
      if (humedad < menorHumedad) {
        menorHumedad = humedad;
        estadoClimaMenorHumedad = estado_clima;
      }
    });

    return {
      mayorTemperatura,
      menorTemperatura,
      estadoClimaMayorTemperatura,
      estadoClimaMenorTemperatura,
      mayorHumedad,
      menorHumedad,
      estadoClimaMayorHumedad,
      estadoClimaMenorHumedad,
    };
  }

  async obtenerEstadisticasPorNombre(
    nombre: string,
  ): Promise<EstadisticasArbolDto[]> {
    try {
      const arbol = await this.arbolModel
        .findOne({ nombre_comun: nombre })
        .populate('sensores')
        .exec();

      if (!arbol) {
        throw new Error('Árbol no encontrado');
      }

      const lecturasPorDia = {};

      arbol.sensores.forEach((sensor) => {
        const temperatura = parseFloat(
          sensor.temperatura_ambiental.replace(' °C', ''),
        );
        const { humedad, estado_clima, estado_uv_valor, estado_uv, fecha } =
          sensor;
        // const fechaSaliente = new Date(fecha);
        const fechaKey = fecha.toISOString().split('T')[0];

        if (!lecturasPorDia[fechaKey]) {
          lecturasPorDia[fechaKey] = [];
        }

        lecturasPorDia[fechaKey].push({
          temperatura,
          humedad,
          estado_clima,
          estado_uv_valor,
          estado_uv,
        });
      });

      return Object.keys(lecturasPorDia).map((fechaSaliente) => {
        const lecturas = lecturasPorDia[fechaSaliente];

        let mayorTemperatura = -Infinity;
        let menorTemperatura = Infinity;
        let estadoClimaMayorTemperatura = '';
        let estadoClimaMenorTemperatura = '';

        let mayorHumedad = -Infinity;
        let menorHumedad = Infinity;
        let estadoClimaMayorHumedad = '';
        let estadoClimaMenorHumedad = '';

        let mayorUV = -Infinity;
        let estadoUVMayor = '';

        lecturas.forEach(
          ({
            temperatura,
            humedad,
            estado_clima,
            estado_uv_valor,
            estado_uv,
          }) => {
            if (temperatura > mayorTemperatura) {
              mayorTemperatura = temperatura;
              estadoClimaMayorTemperatura = estado_clima;
            }
            if (temperatura < menorTemperatura) {
              menorTemperatura = temperatura;
              estadoClimaMenorTemperatura = estado_clima;
            }

            if (humedad > mayorHumedad) {
              mayorHumedad = humedad;
              estadoClimaMayorHumedad = estado_clima;
            }
            if (humedad < menorHumedad) {
              menorHumedad = humedad;
              estadoClimaMenorHumedad = estado_clima;
            }

            if (estado_uv_valor > mayorUV) {
              mayorUV = estado_uv_valor;
              estadoUVMayor = estado_uv;
            }
          },
        );

        return {
          fechaSaliente,
          mayorTemperatura,
          menorTemperatura,
          estadoClimaMayorTemperatura,
          estadoClimaMenorTemperatura,
          mayorHumedad,
          menorHumedad,
          estadoClimaMayorHumedad,
          estadoClimaMenorHumedad,
          mayorUV,
          estadoUVMayor,
        };
      });
    } catch (error) {
      throw new Error(`Error al obtener las estadísticas: ${error.message}`);
    }
  }

  //   /**
  //    * Genera un archivo Markdown con las estadísticas de un árbol.
  //    * @param {string} nombreArbol - El nombre común del árbol.
  //    * @returns {Promise<void>} - Promesa que indica que el archivo ha sido generado.
  //    */
  //   async generarMd(nombreArbol: string): Promise<void> {
  //     try {
  //       const estadisticas = await this.obtenerEstadisticasPorNombre(nombreArbol);

  //       let mdContent = `# Estadísticas del Árbol: ${nombreArbol}\n\n`;

  //       estadisticas.forEach((estadistica) => {
  //         mdContent += `## Día: ${estadistica.fechaSaliente}\n\n`;
  //         mdContent += `## Índice UV del Día: ${estadistica.estadoUVMayor}\n\n`;

  //         mdContent += `**Mayor Temperatura:** ${estadistica.mayorTemperatura}°C
  // **Menor Temperatura:** ${estadistica.menorTemperatura}°C

  // **Estado Climático de la Mayor Temperatura:** ${estadistica.estadoClimaMayorTemperatura}
  // **Estado Climático de la Menor Temperatura:** ${estadistica.estadoClimaMenorTemperatura}

  // **Mayor Humedad:** ${estadistica.mayorHumedad}%
  // **Menor Humedad:** ${estadistica.menorHumedad}%

  // ---

  // `;
  //       });

  //       fs.writeFileSync(`${nombreArbol}_estadisticas.md`, mdContent);
  //       console.log(
  //         `El archivo MD para el árbol ${nombreArbol} se ha generado correctamente.`,
  //       );
  //     } catch (error) {
  //       console.error('Error al generar el archivo MD:', error.message);
  //     }
  //   }

  async generarMd(nombreArbol: string): Promise<void> {
    try {
      const estadisticas = await this.obtenerEstadisticasPorNombre(nombreArbol);
      const imageUrl =
        'https://instagram.fscl29-1.fna.fbcdn.net/v/t51.2885-19/288885609_549093183561568_8783182692664535427_n.jpg?_nc_ht=instagram.fscl29-1.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2AFS0uMb02SDuUdmgUPaXJAwEEHctwWXFwYYb2TGw2lYpVCDOjOon0tvnwLXc6MW2Sg&_nc_ohc=0Jxxyp7QlSYQ7kNvgH6fAL5&_nc_gid=d1d90a64786547598191f0e949304bef&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AYC0bPFSBrNGQmYvkaB0JnsrvAD2JnGw1Ftp4IrAa2irhA&oe=67A176C1&_nc_sid=7a9f4b';

      let mdContent = `# Estadísticas del Árbol: ${nombreArbol}\n\n`;

      // Agregar imagen centrada usando HTML
      mdContent += `<p align="center">  
        <img src="${imageUrl}" alt="Eco Logo" width="400"/>  
      </p>\n\n`;

      estadisticas.forEach((estadistica) => {
        mdContent += `## Día: ${estadistica.fechaSaliente}\n\n`;
        mdContent += `## Índice UV del Día: ${estadistica.estadoUVMayor}\n\n`;

        mdContent += `**Mayor Temperatura:** ${estadistica.mayorTemperatura}°C  
  **Menor Temperatura:** ${estadistica.menorTemperatura}°C  
  
  **Estado Climático de la Mayor Temperatura:** ${estadistica.estadoClimaMayorTemperatura}  
  **Estado Climático de la Menor Temperatura:** ${estadistica.estadoClimaMenorTemperatura}  
  
  **Mayor Humedad:** ${estadistica.mayorHumedad}%  
  **Menor Humedad:** ${estadistica.menorHumedad}%  
  
  ---
  
  `;
      });

      fs.writeFileSync(`${nombreArbol}_estadisticas.md`, mdContent);
      console.log(
        `El archivo MD para el árbol ${nombreArbol} se ha generado correctamente.`,
      );
    } catch (error) {
      console.error('Error al generar el archivo MD:', error.message);
    }
  }
}
