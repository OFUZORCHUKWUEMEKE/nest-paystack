import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { TransactionStatus, TransactionType } from 'src/transactions/enums/transaction.enum';
import { TransactionsService } from 'src/transactions/transactions.service';
import { WalletRepository } from 'src/wallets/wallet.repository';
import { WalletsService } from 'src/wallets/wallets.service';

@Injectable()
export class WebhooksService {
    constructor(
        private readonly transactionService: TransactionsService,
        private readonly customerService: CustomersService,
        private readonly walletRepository: WalletRepository
    ) { }
    async webhook(event, body) {
        const { data } = body
        switch (event) {
            case 'charge.success':
                await this.verifyPayment(data)
                break;
            default:
                break;
        }
    }

    async verifyPayment(data) {
        const customer = await this.customerService.findOne({ email: data.customer.email });
        if (!customer) throw new ConflictException("Email not found")
        if (data.success) {
            const session = await this.walletRepository.model().startSession()
            session.startTransaction();
            try {
                const updateWallet = await this.walletRepository.findOneAndUpdate(
                    { user_id: customer._id },
                    { $inc: { amount: +(data?.amount) } },
                    { session });
                    await updateWallet.save({ session });
                const transaction = await this.transactionService.createTransaction({
                    amount: Number(data.amount / 100),
                    customername: customer.firstname,
                    customerid: customer._id,
                    reference: data.reference,
                    transactiontype: TransactionType.TRANSFER,
                    customer_code: data.customer.customer_code,
                    status: data.status == 'success' ? TransactionStatus.SUCCESS : TransactionStatus.PENDING
                })
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw new BadRequestException('Something went wrong!');
            } finally {
                session.endSession();
                console.log("session ended");
            }
        }
    }
}
