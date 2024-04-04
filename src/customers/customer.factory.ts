import { Injectable } from "@nestjs/common";
import { CustomerDto } from "./enum/customer.dto";
import { HashPassword } from "src/utils/utils";



@Injectable()
export class CustomerFactory {
    async create(customer: CustomerDto) {
        const hashpassword = await HashPassword(customer.password)
        return {
            ...customer,
            password: hashpassword
        }
    }
}