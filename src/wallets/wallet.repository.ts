import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoreRepository } from 'src/common/core/repository';
import { Wallet, WalletDocument } from './wallet.model';



@Injectable()
export class WalletRepository extends CoreRepository<WalletDocument> {
    constructor(
        @InjectModel(Wallet.name)
        walletModel: Model<WalletDocument>,
    ) {
        super(walletModel);
    }
}
