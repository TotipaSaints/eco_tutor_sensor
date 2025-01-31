import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { OpenuvService } from '../openuv/openuv.service';

@Module({
  providers: [CronService, OpenuvService],
})
export class CronModule {}
