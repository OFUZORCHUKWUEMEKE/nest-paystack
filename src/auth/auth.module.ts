import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [CustomersModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
