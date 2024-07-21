import { Injectable } from "@nestjs/common";
import { TransactionDto } from "./transaction.dto";
import { GenerateRef } from "src/utils/utils";



@Injectable()
export class TransactionFactory {
    async create(data: TransactionDto) {
        const payload: Record<string, any> = {}
        for (const [key, value] of Object.entries(data)) {
            payload.key = value
        }
    }
}