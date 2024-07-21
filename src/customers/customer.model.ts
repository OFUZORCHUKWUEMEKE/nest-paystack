import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CustomerType } from "./enum/enum";

export type CustomerDocument = Customer & Document

@Schema({ timestamps: true })
export class BankDetails {
    @Prop({ required: true })
    bankName: string;

    @Prop({ required: true })
    accountNumber: string;

    @Prop({ required: true })
    accountName: string;

    @Prop({ required: true })
    customer_id: string;

}
export const BankSchema = SchemaFactory.createForClass(BankDetails);

@Schema({ timestamps: true })
export class Customer extends Document {
    _id?: any;

    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, minlength: 8 })
    password: string

    @Prop({})
    token: string

    @Prop({ default: true })
    is_active: boolean

    @Prop({ enum: CustomerType, default: CustomerType.REGULAR })
    role: CustomerType

    @Prop({ default: false })
    twofa: boolean

    @Prop({ type: String })
    twoFactorAuthenticationSecret?: string;

    @Prop({ default: false })
    blacklisted: boolean

    @Prop({required:false,type:BankSchema})
    bankdetails:BankDetails
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

