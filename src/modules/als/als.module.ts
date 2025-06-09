import { Global, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AlsService } from './als.service';

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    AlsService,
  ],
  exports: [AsyncLocalStorage, AlsService],
})
export class AlsModule {}
