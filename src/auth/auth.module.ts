import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomersModule } from 'src/customers/customers.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/Local-Strategies';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthenticationService } from './strategies/twoFactorAuthentication.service';

@Module({
  imports: [CustomersModule,PassportModule],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy,TwoFactorAuthenticationService]
})
export class AuthModule {}
