import { Injectable } from '@nestjs/common';
import { CustomerDto } from './enum/customer.dto';
import { CustomerFactory } from './customer.factory';
import { CustomerRepository } from './customer.repository';
import { Customer } from './customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WalletsService } from 'src/wallets/wallets.service';

@Injectable()
export class CustomersService {
    constructor(private readonly customerFactory: CustomerFactory, private readonly repository: CustomerRepository, @InjectModel(Customer.name) private readonly model: Model<Customer>, private readonly wallet: WalletsService) { }
    async CreateCustomer(customer: CustomerDto) {
        const factory = await this.customerFactory.create(customer)
        const newCustomer = await this.model.create(factory)
        const newWallet = await this.wallet.createWallet(newCustomer._id)
    }
}
