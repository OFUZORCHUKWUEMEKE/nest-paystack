import { ConflictException, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { CustomersService } from 'src/customers/customers.service';
import { comparePassword } from 'src/utils/utils';
import { TokenPayload } from './token.payload';
import { CustomerRepository } from 'src/customers/customer.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private readonly customerService: CustomersService, private readonly customerRepository: CustomerRepository, private readonly jwtService: JwtService, private readonly configService: ConfigService) { }
    async getAuthenticated(email, password) {
        let newpassword = password
        try {
            const customer = await this.customerService.getEmail(email)
            if (!customer) throw new ConflictException("Customer Not Found")
            const ispassword = await comparePassword(newpassword, customer.customer.password)
            if (!ispassword) throw new ConflictException("Wrong Credentials")
            const { password, ...others } = customer.customer
            return others
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    public async getCookieWithJwtToken(customerId: any) {
        const customer = await this.customerRepository.findOne({ _id: customerId })
        if (!customer) throw new HttpException("Invalid Customer Id", HttpStatus.BAD_REQUEST)
        const payload: TokenPayload = {
            customerId,
            isSecondFactorAuthenticated: false
        }
        const token = await this.jwtService.sign(payload)
        return token
    }

    public getCookieWithJwtAccessToken(userId: any, isSecondFactorAuthenticated = true) {
        const payload: TokenPayload = { customerId: userId, isSecondFactorAuthenticated };
        const token = this.jwtService.sign(payload);
        return token
    }
}
