import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CustomersService } from 'src/customers/customers.service';
import { TokenPayload } from '../token.payload';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
    Strategy,
    'jwt-two-factor'
) {
    constructor(
        private readonly _configService: ConfigService,
        private readonly _customerService: CustomersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication;
            }]),
            secretOrKey: _configService.get('JWT_SECRET')
        });
    }

    async validate(payload: TokenPayload) {
        const user = await this._customerService.getById(payload.customerId);
        if (!user.customer.twofa) {
            return user;
        }
        if (payload.isSecondFactorAuthenticated) {
            return user;
        }
    }
}