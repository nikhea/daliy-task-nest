// import { Injectable } from '@nestjs/common';
// import { AsyncLocalStorage } from 'async_hooks';
// import { TUser } from '../interface/user.interface';

// export interface AppContext {
//   user: TUser;
// }

// @Injectable()
// export class ContextService {
//   private static asyncLocalStorage = new AsyncLocalStorage<AppContext>();

//   static run(callback: () => void) {
//     this.asyncLocalStorage.run({} as AppContext, callback);
//   }

//   static setContext(context: AppContext) {
//     this.asyncLocalStorage.enterWith(context);
//   }

//   static getContext(): AppContext | undefined {
//     return this.asyncLocalStorage.getStore();
//   }

//   static getUser(): TUser | undefined {
//     const store = this.getContext();
//     return store?.user;
//   }
// }
