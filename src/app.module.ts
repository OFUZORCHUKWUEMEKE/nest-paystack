import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [CustomersModule, WalletsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
