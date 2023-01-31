import { AuthGuard } from '@nestjs/passport';

export class AccessGuard extends AuthGuard('jwt-access') {
  constructor() {
    super();
  }
}

export class RefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
