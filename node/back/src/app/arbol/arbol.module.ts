// arbol.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArbolService } from './arbol.service';

import { SensorModule } from '../sensor/sensor.module';
import { Arbol, ArbolSchema } from './shema/arbol.schema';
import { SectorModule } from '../sector/sector.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arbol.name, schema: ArbolSchema }]),
    SensorModule,
    SectorModule,
  ],
  providers: [ArbolService],
  exports: [ArbolService],
})
export class ArbolModule {}
