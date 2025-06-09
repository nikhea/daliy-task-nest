import { Injectable, Inject } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { TUser } from '../../common/interface/user.interface';

export interface AppContext {
  user?: TUser;
}

@Injectable()
export class AlsService {
  constructor(
    @Inject(AsyncLocalStorage)
    private readonly als: AsyncLocalStorage<AppContext>,
  ) {}

  run<T>(context: AppContext, fn: () => T): T {
    return this.als.run(context, fn);
  }

  setContext(context: Partial<AppContext>): void {
    const currentStore = this.als.getStore();
    if (!currentStore) {
      throw new Error(
        'No AsyncLocalStorage context found. Ensure AlsMiddleware is properly configured.',
      );
    }
    Object.assign(currentStore, context);
  }

  getContext(): AppContext | undefined {
    return this.als.getStore();
  }

  getUser(): TUser | undefined {
    const store = this.getContext();
    return store?.user;
  }

  hasContext(): boolean {
    return this.als.getStore() !== undefined;
  }
}
