import { IsNumber, IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator"
import { TransactionStatus, TransactionType } from "./enums/transaction.enum"

export class TransactionDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @IsString()
    @IsNotEmpty()
    customername: string

    @IsString()
    @IsNotEmpty()
    reference: string

    @IsString()
    @IsNotEmpty()
    customerid: string

    @IsEnum(TransactionType)
    @IsNotEmpty()
    transactiontype: TransactionType

    @IsOptional()
    @IsString()
    customer_code?: string

    @IsOptional()
    status?:TransactionStatus
}