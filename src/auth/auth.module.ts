import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SettingsService } from 'src/settings/settings.service';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService, AccessStrategy, RefreshStrategy, SettingsService],
  controllers: [AuthController],
})
export class AuthModule {}
