import { BadRequestException, Body, ConflictException, ConsoleLogger, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { CustomerDto } from 'src/customers/enum/customer.dto';
import { LoginDto, code } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from './guard/jwtAuthentication.guard';
import { TwoFactorAuthenticationService } from './strategies/twoFactorAuthentication.service';
import { AuthGuard } from './guard/auth.guard';
import { CoreController } from '../common/core/controller.core';

@Controller('auth')
export class AuthController extends CoreController {
    constructor(private readonly customerService: CustomersService, private readonly authService: AuthService, private readonly _twoFa: TwoFactorAuthenticationService) {
        super()
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("/signup")
    async Signup(@Body() customer: CustomerDto, @Res() res: Response) {
        try {
            const newCustomer = await this.customerService.CreateCustomer(customer)
            return this.responseSuccess(res, "00", "Success", newCustomer, HttpStatus.OK)
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthenticationGuard)
    @Post("/login")
    async Login(@Req() request, @Res() res: Response) {
        try {
            const user = request.user
            const customer = await this.customerService.getById(user._doc._id)
            if (!customer) throw new ConflictException("Invalid Credentials")

            const token = await this.authService.getCookieWithJwtToken(user._doc._id)

            user.password = undefined;

            const { password, ...others } = user._doc
            return this.responseSuccess(res, "00", "Success", others, HttpStatus.OK);
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }
}
