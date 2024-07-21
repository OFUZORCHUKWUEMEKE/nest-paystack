import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './wallet.model';
import { Model } from 'mongoose';
import { CoreService } from 'src/common/core/service.core';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class WalletsService extends CoreService<WalletRepository> {
    constructor(
        private readonly model: WalletRepository
    ) { super(model) }
    async createWallet(user_id) {
        const newWallet = await this.model.create({
            user_id
        })
        return newWallet
    }
}
