import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { PaystackCustomer } from 'src/customers/enum/customer.dto';
import { PaystackService } from './paystack.service';
import { CoreController } from 'src/common/core/controller.core';
import { Response } from 'express';
import { ResolveAccountNumberDto } from './dto/resolve-account-number.dto';
import { ITransferRecipient, Transferdto } from './paystack.interface';

@Controller('paystack')
export class PaystackController extends CoreController {
    constructor(private readonly paystackService: PaystackService) {
        super()
    }
    @Post("/")
    async CreateCustomer(@Body() customer: PaystackCustomer, @Res() res) {
        const newCustomer = await this.paystackService.createCustomer(customer)
        return this.responseSuccess(res, "00", "Status", newCustomer, HttpStatus.OK)
    }

    @Get('/bank-list')
    async fetchBankList(@Res({ passthrough: true }) res: Response) {
        const bank_list = await this.paystackService.fetchBankList();
        return this.responseSuccess(res, '00', 'Success', bank_list, HttpStatus.OK);
    }

    @Get('/resolve-account-number')
    async resolveAccountNumber(
        @Res({ passthrough: true }) res: Response,
        @Query() dto: ResolveAccountNumberDto,
    ) {
        const bank_list = await this.paystackService.resolveAccountNumber(dto);
        return this.responseSuccess(res, '00', 'Success', bank_list, HttpStatus.OK);
    }

    @Post('/transfer-recipient')
    async transferRecipient(
        @Body() body: ITransferRecipient,
        @Res({ passthrough: true }) res: Response) {
        const transferRecipient = await this.paystackService.transferRecipient(body)
        return this.responseSuccess(res, '00', 'Success', transferRecipient, HttpStatus.OK);
    }

    @Post('/transfer')
    async transfer(
        @Body() body: Transferdto,
        @Res({ passthrough: true }) res: Response) {
        const transferRecipient = await this.paystackService.transfer(body.recipient, body.amount)
        return this.responseSuccess(res, '00', 'Success', transferRecipient, HttpStatus.OK);
    }
}
