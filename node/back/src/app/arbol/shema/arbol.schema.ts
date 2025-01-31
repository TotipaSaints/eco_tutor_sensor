import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Sensor } from 'src/app/sensor/shema/sensor.schema';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Arbol extends Document {
  @Prop({ required: true })
  nombre_comun: string;

  @Prop({ required: true })
  especie: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Sensor', default: [] })
  sensores: Sensor[];
}

export const ArbolSchema = SchemaFactory.createForClass(Arbol);
