import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// DTO Class
export class ResolveAccountNumberDto {
  @ApiProperty({
    type: String,
    description: 'Account Number is required',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({
    type: String,
    description: 'Bank Code is required',
  })
  @IsString()
  @IsNotEmpty()
  bank_code: string;
}