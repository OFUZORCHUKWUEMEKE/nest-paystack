import { Body, Controller, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { CoreController } from 'src/common/core/controller.core';
import { CustomersService } from './customers.service';
import { CustomerDto } from './enum/customer.dto';

@Controller('customers')
export class CustomersController extends CoreController {
    constructor(private readonly customerService: CustomersService) {
        super()
    }
    async createCustomer(@Body() data: CustomerDto,@Res() res) {
        const createCustomer = await this.customerService.CreateCustomer(data)
        return this.responseSuccess(res,"00","Success",createCustomer,HttpStatus.OK)
    }
}
