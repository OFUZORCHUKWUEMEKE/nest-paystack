import { BadRequestException, Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { CustomerDto } from 'src/customers/enum/customer.dto';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly customerService: CustomersService, private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post("/signup")
    async Signup(@Body() customer: CustomerDto) {
        try {
            const newCustomer = await this.customerService.CreateCustomer(customer)
            return newCustomer;
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthenticationGuard)
    @Post("/log-in")
    async Login(@Req() request, @Res() response: Response) {
        try {
            const user = request.user
            const cookie = await this.authService.getCookieWithJwtToken(user._id)
            response.setHeader('Set-Cookie',cookie)
            user.password = undefined;
            return response.send(user);
        } catch (error) {
            throw new HttpException("An Error Occureed", HttpStatus.BAD_REQUEST)
        }
    }
}
