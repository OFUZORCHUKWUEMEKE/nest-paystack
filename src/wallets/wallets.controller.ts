import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CoreController } from 'src/common/core/controller.core';
import { WalletTransferDto } from './dto/wallet.dto';
import { CurrentUser } from 'src/common/decorators/current-user';
import { TokenPayload } from 'src/auth/token.payload';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('wallets')
export class WalletsController extends CoreController {
    constructor(private readonly walletService: WalletsService) {
        super()
    }
    @UseGuards(AuthGuard)
    @Post("/transfer")
    async transfer(@Body() body: WalletTransferDto, @CurrentUser() user: TokenPayload, @Res() res: Response) {
        const transfer = await this.walletService.transferFunds(body, user)
        return this.responseSuccess(res, "00", "Status", transfer, HttpStatus.OK);
    }
}
