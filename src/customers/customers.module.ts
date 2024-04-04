import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerFactory } from './customer.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customer.model';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
  controllers: [CustomersController],
  providers: [CustomersService, CustomerFactory, CustomerRepository],
  exports: [CustomerFactory, CustomerRepository]
})
export class CustomersModule { }
