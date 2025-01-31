import { Module } from '@nestjs/common';
import { OpenuvService } from './openuv.service';

@Module({
  controllers: [],
  providers: [OpenuvService],
  exports: [OpenuvService],
})
export class OpenuvModule {}
