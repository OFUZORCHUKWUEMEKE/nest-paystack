import { Injectable } from '@nestjs/common';
import { CoreRepository } from 'src/common/core/repository';
import { TransactionRepository } from './transaction.repository';
import { CoreService } from 'src/common/core/service.core';
import { TransactionDto } from './transaction.dto';
import { TransactionDocument } from './transaction.model';
import { TransactionFactory } from './factory';
import { ViewTransactionDto } from './transaction.interface';

@Injectable()
export class TransactionsService extends CoreService<TransactionRepository> {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly factory: TransactionFactory
    ) {
        super(transactionRepository)
    }

    async createTransaction(data: TransactionDto) {
        const create = await this.factory.create(data);
        const newTransaction = await this.transactionRepository.create(create);
        return newTransaction;
    }

    async getTransaction(query: ViewTransactionDto) {
        let searchQuery: Record<string, any> = {};
        if (query.q) {
            searchQuery = {
                reference: { $regex: query.q, $options: 'i' },
            };
        }
        if (query.status) {
            searchQuery.status = query.status;
        }
        if (query.type) {
            searchQuery.type = query.type;
        }

        searchQuery = {
            ...searchQuery,
            ...(query.startDate &&
                !query.endDate && {
                createdAt: {
                    $gte: new Date(query.startDate).toISOString(),
                },
            }),
            ...(!query.startDate &&
                query.endDate && {
                createdAt: {
                    $lte: new Date(query.endDate).toISOString(),
                },
            }),
            ...(query.startDate &&
                query.endDate && {
                createdAt: {
                    $lte: new Date(query.endDate).toISOString(),
                    $gte: new Date(query.startDate).toISOString(),
                },
            }),
        };
        const { page, perPage } = query;
        const total = await this.transactionRepository
            .model()
            .find({
                ...searchQuery
            }).sort({ _id: -1 })
            .skip(((+page || 1) - 1) * (+perPage || 10))
            .limit(+perPage || 10);

            return total;
    }
}
