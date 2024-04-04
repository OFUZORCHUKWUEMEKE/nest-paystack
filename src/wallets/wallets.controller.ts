import { Controller } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
    constructor(private readonly walletService:WalletsService){}
}
