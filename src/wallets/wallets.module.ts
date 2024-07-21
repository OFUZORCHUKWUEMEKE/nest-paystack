import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.model';
import { CustomersModule } from 'src/customers/customers.module';
import { WalletRepository } from './wallet.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }])],
  controllers: [WalletsController],
  providers: [WalletsService,WalletRepository],
  exports:[WalletsService,WalletRepository]
})
export class WalletsModule{}
