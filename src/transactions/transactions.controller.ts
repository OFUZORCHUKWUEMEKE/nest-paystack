import { Controller, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { CoreController } from 'src/common/core/controller.core';
import { TransactionsService } from './transactions.service';
import { ViewTransactionDto } from './transaction.interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Response } from 'express';

@Controller('transactions')
export class TransactionsController extends CoreController {
    constructor(private readonly transactionService: TransactionsService) {
        super()
    }

    @UseGuards(AuthGuard)
    async getTransaction(
        @Query() query: ViewTransactionDto,
        @Res({ passthrough: true }) res: Response) {
        const resp = await this.transactionService.getTransaction(query)
        return this.responseSuccess(res, '00', 'Success', resp, HttpStatus.OK);
    }
}
