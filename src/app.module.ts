import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { WalletsModule } from './wallets/wallets.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsModule } from './transactions/transactions.module';
import { PaymentsModule } from './payments/payments.module';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaystackModule } from './paystack/paystack.module';
import configuration from './config/config';

const config = configuration()


@Module({
  imports: [CustomersModule, WalletsModule, AuthModule, TransactionsModule, PaymentsModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    load: [configuration]
  }), MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async () => {
      const uri = config.DB.uri
      return {
        uri,
        retryAttempts: 6,
      }
    }
  }), PaystackModule],
  controllers: [AppController, TransactionsController],
  providers: [AppService],
})
export class AppModule { }
