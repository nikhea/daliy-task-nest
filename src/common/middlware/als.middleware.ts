import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AlsService } from '../../modules/als/als.service';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private readonly alsService: AlsService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    this.alsService.run({}, () => {
      next();
    });
  }
}
