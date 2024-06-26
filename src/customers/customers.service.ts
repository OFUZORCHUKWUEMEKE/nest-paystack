import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
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
    ) { }
    async CreateCustomer(customer: CustomerDto) {
        try {
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
            const { result, err } = await this.paystackSevice.createCustomer(payload)
            console.log(err)
            if (err) {
                console.log(err)
                throw new BadRequestException("An error occured here")
            }
            return {
                success: true,
                customer: newCustomer,
                wallet: newWallet
            }
        } catch (error) {
            throw new BadRequestException(error)
        }

    }

    async getEmail(email) {
        try {
            const customer = await this.repository.findOne({ email })
            if (!customer) throw new ConflictException("Customer Does not exist")
            return {
                success: true,
                customer
            }
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async getById(id) {
        try {
            const customer = await this.repository.findOne({ _id: id })
            if (!customer) throw new ConflictException("Customer Does not exist")
            return {
                success: true,
                customer
            }
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async setTwoFactorAuthenticationSecret(secret: string, userId: any) {
        return this.model.updateOne({ _id: userId }, { twoFactorAuthenticationSecret: secret })
    }

    async turnOnTwoFactorAuthentication(userId: any) {
        return this.model.updateOne({ _id: userId }, { twofa: true })
    }
}
