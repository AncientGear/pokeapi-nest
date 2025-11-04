import { Module } from '@nestjs/common';
import { AxiosAdapter } from './providers/axios.provider';

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
})
export class CommonModule {}
