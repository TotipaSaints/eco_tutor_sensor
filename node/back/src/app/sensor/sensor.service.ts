import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Sensor } from './shema/sensor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SensorService {
  constructor(@InjectModel(Sensor.name) private sensorModel: Model<Sensor>) {}

  async create(data: Partial<Sensor>): Promise<Sensor> {
    const createdSensor = new this.sensorModel(data);
    return createdSensor.save();
  }

  async findAll(): Promise<Sensor[]> {
    return this.sensorModel.find().lean().exec();
  }

  async findOne(id: string): Promise<Sensor> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid sensor ID format');
    }

    const sensor = await this.sensorModel.findById(id).exec();
    if (!sensor) throw new NotFoundException('Sensor not found');
    return sensor;
  }

  async update(id: string, data: Partial<Sensor>): Promise<Sensor> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid sensor ID format');
    }

    const updatedSensor = await this.sensorModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedSensor) throw new NotFoundException('Sensor not found');
    return updatedSensor;
  }

  async delete(id: string): Promise<void> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid sensor ID format');
    }

    const result = await this.sensorModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Sensor not found');
  }

  async obtenerEstadisticas() {
    return this.sensorModel
      .aggregate([
        {
          $addFields: {
            temperatura_ambiental_num: {
              $convert: {
                input: {
                  $arrayElemAt: [
                    { $split: ['$temperatura_ambiental', ' '] },
                    0,
                  ],
                },
                to: 'double',
                onError: null,
                onNull: null,
              },
            },
            estado_uv_valor_num: {
              $convert: {
                input: '$estado_uv_valor',
                to: 'double',
                onError: null,
                onNull: null,
              },
            },
          },
        },
        {
          $match: {
            temperatura_ambiental_num: { $ne: null },
            estado_uv_valor_num: { $ne: null },
          },
        },
        {
          $sort: {
            temperatura_ambiental_num: 1,
          },
        },
        {
          $group: {
            _id: null,
            tempMax: { $last: '$temperatura_ambiental_num' },
            horaMax: { $last: '$fecha' },
            tempMin: { $first: '$temperatura_ambiental_num' },
            horaMin: { $first: '$fecha' },
            promedioTemperatura: { $avg: '$temperatura_ambiental_num' },
            promedioEstadoUV: { $avg: '$estado_uv_valor_num' },
          },
        },
      ])
      .exec();
  }

  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}
