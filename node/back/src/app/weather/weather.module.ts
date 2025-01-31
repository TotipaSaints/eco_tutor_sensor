import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { AxiosFactory } from '../axios/axios.factory';

@Module({
  imports: [],
  providers: [WeatherService, AxiosFactory],
  exports: [WeatherService],
})
export class WeatherModule {}
