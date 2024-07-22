import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './wallet.model';
import { Model } from 'mongoose';
import { CoreService } from 'src/common/core/service.core';
import { WalletRepository } from './wallet.repository';
import { WalletTransferDto } from './dto/wallet.dto';
import { TokenPayload } from 'src/auth/token.payload';
import { CustomerRepository } from 'src/customers/customer.repository';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class WalletsService extends CoreService<WalletRepository> {
    constructor(
        private readonly model: WalletRepository,
        private readonly customer: CustomerRepository
    ) {
        super(model)
    }
    async createWallet(user_id) {
        const newWallet = await this.model.create({
            user_id
        })
        return newWallet
    }

    async transferFunds(data: WalletTransferDto, user: TokenPayload) {
        const sender = await this.model.model().findOne({ user_id: user.customerId })
        if (!sender) throw new UnauthorizedException()
        const reciepient = await this.customer.findOne({ email: data.email });
        if (!reciepient) throw new ConflictException("Customer does not exist,wrong email address");
        if (sender && reciepient) {
              const session = await this.model.model().startSession();
            try {
                session.startTransaction();
                await sender.updateOne({ $inc: { amount: -(data?.amount) } }, { session })
                await reciepient.updateOne({ $inc: { amount: +(data.amount) } }, { session })
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw new BadRequestException('Something went wrong!');
            }finally{
                session.endSession()
                console.log("Session Ended")
            }
        }
    }
}
