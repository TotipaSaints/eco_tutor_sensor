import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorService } from './sensor.service';
import { Sensor, SensorSchema } from './shema/sensor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sensor.name, schema: SensorSchema }]),
  ],
  providers: [SensorService],
  exports: [SensorService, MongooseModule],
})
export class SensorModule {}
