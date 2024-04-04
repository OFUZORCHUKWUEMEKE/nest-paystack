import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaystackCustomer } from 'src/customers/enum/customer.dto';
import { ExternalCall } from 'src/external-call/extrenal-call.service';

@Injectable()
export class PaystackService {
    constructor(private readonly apis: ExternalCall, private readonly configService: ConfigService) { }

    async createCustomer(customer: PaystackCustomer) {
        const payload = {
            first_name: customer.firstname,
            last_name: customer.lastname,
            email: customer.email,
            phone: customer.phonenumber,
            metadata: {
                date_of_birth: customer.date_of_birth
            }

        }
        const { result, err } = await this.apis.postData(PAYSTACK_CREATE_CUSTOMER, payload, { Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}` })
        if (err) throw new BadRequestException(err.data ? err.data.message : err)
        return {
            result,
            err
        }
    }
}
