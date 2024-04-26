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

@Controller('auth')
export class AuthController {
    constructor(private readonly customerService: CustomersService, private readonly authService: AuthService, private readonly _twoFa: TwoFactorAuthenticationService) { }

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
            const customer = await this.customerService.getById(user._doc._id)
            if (!customer) throw new ConflictException("Invalid Credentials")

            const token = await this.authService.getCookieWithJwtToken(user._doc._id)

            user.password = undefined;

            const { password, ...others } = user._doc
            response.send({
                ...others,
                token
            })
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logOut(@Req() request, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authService.getCookieLogOut());
        return response.sendStatus(200);
    }

    // @UseGuards(JwtAuthenticationGuard)
    @UseGuards(AuthGuard)
    @Get()
    authenticated(@Req() request) {
        const user = request.user;
        user.password = undefined;
        return user;
    }

    @UseGuards(AuthGuard)
    @Post('2fa/generate')
    async generate(@Res() response: Response, @Req() req) {
        const user = await this.customerService.getById(req.user.customerId)
        const { otpauthUrl } = await this._twoFa.generateTwoFactorAuthenticationSecret(user.customer)
        return this._twoFa.pipeQrCodeStream(response, otpauthUrl)
    }


    @Get('turn-on')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    async turnOnTwoFactorAuthentication(
        @Req() request,
        @Res() response: Response
        // @Body() twoFactorAuthenticationCode: code
    ) {
        const user = await this.customerService.getById(request.user.customerId)
        await this.customerService.turnOnTwoFactorAuthentication(request.user.customerId);
        const { otpauthUrl } = await this._twoFa.generateTwoFactorAuthenticationSecret(user.customer)
        return this._twoFa.pipeQrCodeStream(response, otpauthUrl)
        // const isCodeValid = this._twoFa.isTwoFactorAuthenticationCodeValid(
        //     twoFactorAuthenticationCode.twoFactorAuthenticationCode, user.customer
        // );
        // console.log(twoFactorAuthenticationCode.twoFactorAuthenticationCode)
        // if (!isCodeValid) {
        //     throw new UnauthorizedException('Wrong authentication code');
        // }
        // await this.customerService.turnOnTwoFactorAuthentication(request.user.customerId);
    }

    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    async authenticate(
        @Req() request,
        @Body() { twoFactorAuthenticationCode }: code
    ) {
        console.log(request.user)
        const user = await this.customerService.getById(request.user.customerId)
        const isCodeValid = this._twoFa.isTwoFactorAuthenticationCodeValid(
            twoFactorAuthenticationCode, user.customer
        );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.customerId, true);

        return accessTokenCookie
    }
}
