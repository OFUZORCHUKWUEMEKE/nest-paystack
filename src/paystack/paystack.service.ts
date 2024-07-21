import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PAYSTACK_CREATE_CUSTOMER } from 'src/common/constants';
import { PaystackCustomer } from 'src/customers/enum/customer.dto';
import { ExternalCall } from 'src/external-call/extrenal-call.service';
import { VirtualAccountDto } from './paystack.dto';
import { ResolveAccountNumberDto } from './dto/resolve-account-number.dto';
import { ITransferRecipient } from './paystack.interface';

type NewType = PaystackCustomer;

@Injectable()
export class PaystackService {
    constructor(
        private readonly apis: ExternalCall,
        private readonly configService: ConfigService
    ) { }
    async createCustomer(customer: NewType) {
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
        console.log(err)
        if (err) {
            console.log(err)
            throw new BadRequestException(err.data ? err.data.message : err)
        }
        return result
    }

    async createVirtualAccount(data: VirtualAccountDto) {
        const { result, err } = await this.apis.postData(
            this.configService.get('CREATE_DEDICATED_ACCOUNT'),
            data, {
            Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
        }
        )
        if (err) throw new BadRequestException(err.data ? err.data.message : err);
        return result;
    }
    async fetchBankList(): Promise<Record<string, any>[]> {
        const { result, err } = await this.apis.fetchData(
            `${this.configService.get('BANK_LIST_ENDPOINT')}`,
            {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET')}`,
            },
        );

        if (err) throw new BadRequestException(err.data ? err.data.message : err);

        return result.data;
    }

    async resolveAccountNumber(
        dto: ResolveAccountNumberDto,
    ): Promise<Record<string, any>[]> {
        const { result, err } = await this.apis.fetchData(
            `${this.configService.get(
                'RESOLVE_ACCOUNT_ENDPOINT',
            )}?account_number=${encodeURIComponent(
                dto.account_number,
            )}&bank_code=${encodeURIComponent(dto.bank_code)}`,
            {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET')}`,
            },
        );

        if (err) throw new BadRequestException(err.data ? err.data.message : err);

        return result.data;
    }

    async transferRecipient(data: ITransferRecipient) {
        const { result, err } = await this.apis.postData(
            this.configService.get('TRANSFER_RECIPIENT_ENDPOINT'),
            { ...data, metadata: { user_id: data.user_id } },
            {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET')}`,
            },
        );

        if (err) throw new BadRequestException(err.data ? err.data.message : err);

        return result.data;
    }

    async transfer(recipient: string, amount: number) {
        const { result, err } = await this.apis.postData(
            this.configService.get('TRANSFER_ENDPOINT'),
            {
                source: 'balance',
                amount,
                recipient: recipient,
                reason: 'Transfer',
            },
            {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET')}`,
            },
        );
        if (err) throw new BadRequestException(err.data ? err.data.message : err);

        return result.data;
    }
}
