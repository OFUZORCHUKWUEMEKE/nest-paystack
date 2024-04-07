import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerDto, PaystackCustomer } from './enum/customer.dto';
import { CustomerFactory } from './customer.factory';
import { CustomerRepository } from './customer.repository';
import { Customer } from './customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WalletsService } from 'src/wallets/wallets.service';
import { ICustomerResponse } from './customer.interface';
import { PaystackService } from 'src/paystack/paystack.service';

@Injectable()
export class CustomersService {
    constructor(private readonly customerFactory: CustomerFactory, private readonly repository: CustomerRepository, @InjectModel(Customer.name) private readonly model: Model<Customer>,
        private readonly wallet: WalletsService, private readonly paystackSevice: PaystackService
    ) {}
    async CreateCustomer(customer: CustomerDto) {
        const factory = await this.customerFactory.create(customer)
        const newCustomer = await this.model.create(factory)
        const newWallet = await this.wallet.createWallet(newCustomer._id)
        const payload = {
            lastname: customer.lastname,
            firstname: customer.firstname,
            email: customer.email,
            phonenumber: customer.phonenumber,
            date_of_birth: new Date()
        }
        const {result,err} = await this.paystackSevice.createCustomer(payload)
        
        if (err) return new BadRequestException("An error occured here")
        return {
            success: true,
            customer: newCustomer,
            wallet: newWallet
        }
    }
}
