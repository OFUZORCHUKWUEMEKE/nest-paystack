import { BadRequestException, Body, ConsoleLogger, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { CustomerDto } from 'src/customers/enum/customer.dto';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from './guard/jwtAuthentication.guard';

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
    @Post("/login")
    async Login(@Req() request, @Res() response: Response) {
        try { 
            const user = request.user
            const cookie = await this.authService.getCookieWithJwtToken(user._doc._id)
            response.setHeader('Set-Cookie', cookie)
            user.password = undefined;
            const {password,...others} = user._doc
            return response.send(others);
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logOut(@Req() request, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authService.getCookieLogOut());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request) {
        const user = request.user;
        user.password = undefined;
        return user;
    }
}
