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
import Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';

const config = configuration()


@Module({
  imports: [CustomersModule, WalletsModule, AuthModule, TransactionsModule, PaymentsModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    load: [configuration],
    // validationSchema: Joi.object({
    //   JWT_SECRET: Joi.string().required(),
    //   JWT_EXPIRATION_TIME: Joi.string().required(),
    // })
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
  }), JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`
      }
    }),
    global: true
  }), PaystackModule],
  controllers: [AppController, TransactionsController],
  providers: [AppService],
})
export class AppModule { }
