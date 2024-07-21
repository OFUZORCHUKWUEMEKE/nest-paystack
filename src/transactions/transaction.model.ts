import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { TransactionStatus, TransactionType } from "./enums/transaction.enum";



export type TransactionDocument = Transaction & Document

@Schema({ timestamps: true })
export class Transaction extends Document {
    _id: any

    @Prop({ type: Number, required: true })
    amount: number

    @Prop({ enum: TransactionStatus, default: TransactionStatus.PENDING })
    status: TransactionStatus

    @Prop({ type: String, required: false })
    customer_code: string

    @Prop({ enum: TransactionType })
    transaction_type: TransactionType
}


export const TransactionSchema = SchemaFactory.createForClass(Transaction)

TransactionSchema.index({
    createdAt: -1
})