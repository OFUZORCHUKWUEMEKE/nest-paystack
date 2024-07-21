import { ApiProperty } from "@nestjs/swagger";
import { TransactionStatus, TransactionType } from "./enums/transaction.enum";
import { IsEnum, IsOptional } from "class-validator";
import { CoreSearchFilterDatePaginationDto } from "src/common/core/dto.core";

export class ViewTransactionDto extends CoreSearchFilterDatePaginationDto {
    @ApiProperty()
    @IsEnum(TransactionStatus)
    @IsOptional()
    status: TransactionStatus;
  
    @ApiProperty()
    @IsEnum(TransactionType)
    @IsOptional()
    type: TransactionType;

  }