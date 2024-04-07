import { Injectable } from "@nestjs/common";
import { CustomerDto } from "./enum/customer.dto";
import { HashPassword, generateToken } from "src/utils/utils";



@Injectable()
export class CustomerFactory {
    async create(customer: CustomerDto) {
        const hashpassword = await HashPassword(customer.password)
        const token =  generateToken(15)
        return {
            ...customer,
            password: hashpassword,
            token
        }
    }
}