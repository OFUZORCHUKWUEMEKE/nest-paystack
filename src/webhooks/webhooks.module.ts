import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CustomersModule } from 'src/customers/customers.module';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  imports:[TransactionsModule,CustomersModule,WalletsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService]
})
export class WebhooksModule{}
