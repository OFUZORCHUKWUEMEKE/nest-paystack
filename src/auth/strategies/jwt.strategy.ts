
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from '../token.payload';
import { AuthService } from '../auth.service';
import { CustomerRepository } from 'src/customers/customer.repository';
// import { UsersService } from '../users/users.service';
// import TokenPayload from './tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly repository: CustomerRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication;
            }]),
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: TokenPayload) {
        return await this.repository.findOne({ _id: payload.customerId })
    }
}