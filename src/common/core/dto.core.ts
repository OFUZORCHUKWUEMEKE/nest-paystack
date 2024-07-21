import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CoreSearchFilterDatePaginationDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    q: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    page: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    perPage: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    startDate: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    endDate: string;
}