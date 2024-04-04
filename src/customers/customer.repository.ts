import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoreRepository } from 'src/common/core/repository';
import { Customer, CustomerDocument } from './customer.model';

@Injectable()
export class CustomerRepository extends CoreRepository<CustomerDocument> {
    constructor(
        @InjectModel(Customer.name)
        customerModel: Model<CustomerDocument>,
    ) {
        super(customerModel);
    }
}
