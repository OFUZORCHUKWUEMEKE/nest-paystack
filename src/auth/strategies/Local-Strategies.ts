import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { AuthenticationService } from './authentication.service';
import { AuthService } from '../auth.service';
import { Customer } from 'src/customers/customer.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email'
        });
    }
    async validate(email: string, password: string): Promise<Partial<Customer>> {
        return this.authService.getAuthenticated(email, password);
    }
}