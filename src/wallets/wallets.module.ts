import { forwardRef, Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.model';
import { CustomersModule } from 'src/customers/customers.module';
import { WalletRepository } from './wallet.repository';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports:[forwardRef(()=>CustomersModule),MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),TransactionsModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletRepository],
  exports: [WalletsService, WalletRepository]
})
export class WalletsModule {}
