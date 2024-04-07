import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { CustomerDto } from 'src/customers/enum/customer.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly customerService: CustomersService) { }
    @Post("/signup")
    async Signup(@Body() customer: CustomerDto) {
        try {
            const newCustomer = await this.customerService.CreateCustomer(customer)
            return newCustomer;
        } catch (error) {
            throw new BadRequestException(error)
        }
      
    }
}
