import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionFactory } from './factory';
import { TransactionRepository } from './transaction.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './transaction.model';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
  controllers:[TransactionsController],
  providers: [TransactionsService, TransactionFactory, TransactionRepository],
  exports: [TransactionsService, TransactionFactory, TransactionRepository],
 
})
export class TransactionsModule {}
