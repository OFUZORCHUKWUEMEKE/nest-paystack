import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './wallet.model';
import { Model } from 'mongoose';

@Injectable()
export class WalletsService {
    constructor(@InjectModel(Wallet.name) private readonly model: Model<Wallet>) { }
    async createWallet(wallet: string) {
        const newWallet = await this.model.create({
            user_id: wallet
        })
        return newWallet
    }
}
