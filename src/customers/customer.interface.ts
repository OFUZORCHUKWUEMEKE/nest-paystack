import { Wallet } from "src/wallets/wallet.model";
import { Customer } from "./customer.model";

export interface ICustomerResponse {
    success: true
    wallet: Wallet,
    customer: Customer
}