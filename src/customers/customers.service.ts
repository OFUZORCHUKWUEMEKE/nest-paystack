import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CustomerDto, PaystackCustomer } from './enum/customer.dto';
import { CustomerFactory } from './customer.factory';
import { CustomerRepository } from './customer.repository';
import { BankDetails, Customer } from './customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WalletsService } from 'src/wallets/wallets.service';
import { ICustomerResponse } from './customer.interface';
import { PaystackService } from 'src/paystack/paystack.service';
import { CoreService } from 'src/common/core/service.core';
import { TITAN } from './constants';

@Injectable()
export class CustomersService extends CoreService<CustomerRepository> {
    constructor(
        private readonly customerFactory: CustomerFactory,
        private readonly repository: CustomerRepository,
        @InjectModel(Customer.name) private readonly model: Model<Customer>,
        private readonly wallet: WalletsService,
        private readonly paystackSevice: PaystackService,
        @InjectModel(BankDetails.name) private readonly bankModel: Model<BankDetails>
    ) {
        super(repository)
    }
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
            const paystackCustomer = await this.paystackSevice.createCustomer(payload);
            const createDedicatedAccount = await this.paystackSevice.createVirtualAccount({
                customer_id: paystackCustomer.data.customer_code,
                preferred_bank: TITAN
            })
            const newBankDetail = await this.bankModel.create({
                bankName: createDedicatedAccount?.data?.bank?.name,
                accountName: createDedicatedAccount?.data.account_name,
                accountNumber: createDedicatedAccount?.data?.account_number,
                vehicle_id: newCustomer._id
            });
            newCustomer.bankdetails = newBankDetail;
            await newCustomer.save();
            return {
                success: true,
                customer: newCustomer,
                wallet: newWallet,
                account_details: {
                    message: createDedicatedAccount.message,
                    bank: {
                        name: createDedicatedAccount?.data?.bank?.name,
                        account_name: createDedicatedAccount?.data.account_name,
                        account_number: createDedicatedAccount?.data?.account_number
                    }
                }
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getEmail(email) {
        try {
            const customer = await this.findOne({ email })
            if (!customer) throw new ConflictException("Customer Does not exist")
            return customer;
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async getById(id) {
        try {
            const customer = await this.findOne({ _id: id })
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
