import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CustomerDto {
    @ApiProperty({ description: "The Firstname of the Customer" })
    @IsString()
    @IsNotEmpty()
    firstname: string

    @ApiProperty({ description: "The lastname of the Customer" })
    @IsString()
    @IsNotEmpty()
    lastname: string

    @ApiProperty({ description: "The email of the Customer" })
    @IsString()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    token: string

    @ApiProperty({ description: "The Customers Password" })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string

    phonenumber:string
}

export class PaystackCustomer {
    firstname: string

    lastname: string

    email: string

    phonenumber: string

    date_of_birth: Date
}