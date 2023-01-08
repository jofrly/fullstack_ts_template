import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TestEnvGuard implements CanActivate {
  canActivate(): boolean {
    return process.env.NODE_ENV === 'test';
  }
}
