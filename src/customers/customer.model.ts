import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CustomerType } from "./enum/enum";


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

    @Prop({})
    is_active: boolean

    @Prop({ enum: CustomerType, default: CustomerType.REGULAR })
    role: CustomerType
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)