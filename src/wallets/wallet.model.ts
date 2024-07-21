import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaType, SchemaTypes, Types } from "mongoose";

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet extends Document {
    _id?: any;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
    user_id: Types.ObjectId

    @Prop({ required: true, default: 0.0 })
    balance: number

    @Prop({ default: 'NGN' })
    currency: string
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)