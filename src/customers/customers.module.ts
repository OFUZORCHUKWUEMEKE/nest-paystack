import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerFactory } from './customer.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { BankDetails, BankSchema, Customer, CustomerSchema } from './customer.model';
import { CustomerRepository } from './customer.repository';
import { WalletsModule } from 'src/wallets/wallets.module';
import { PaystackModule } from 'src/paystack/paystack.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }, { name: BankDetails.name, schema: BankSchema }]), WalletsModule, PaystackModule],
  controllers: [CustomersController],
  providers: [CustomersService, CustomerFactory, CustomerRepository],
  exports: [CustomerFactory, CustomerRepository, CustomersService]
})
export class CustomersModule { }
