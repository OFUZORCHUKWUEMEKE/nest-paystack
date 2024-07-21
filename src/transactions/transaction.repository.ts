import { Injectable } from "@nestjs/common";
import { CoreRepository } from "src/common/core/repository";
import { Transaction, TransactionDocument } from "./transaction.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class TransactionRepository extends CoreRepository<TransactionDocument> {
    constructor(
        @InjectModel(Transaction.name)
        transactionModel: Model<TransactionDocument>,
    ) {
        super(transactionModel);
    }
}
