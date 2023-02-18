import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SettingsService } from 'src/common/settings/settings.service';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, JwtModule.register({})],
  providers: [AuthService, AccessStrategy, RefreshStrategy, SettingsService],
  controllers: [AuthController],
})
export class AuthModule {}
