import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Customer } from 'src/customers/customer.model';
import { CustomersService } from 'src/customers/customers.service';

 
@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly _customerService: CustomersService,
    private readonly _configService: ConfigService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: Customer) {
    const secret = authenticator.generateSecret();
 
    const otpauthUrl = authenticator.keyuri(user.email, this._configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
 
    await this._customerService.setTwoFactorAuthenticationSecret(secret, user.id);
 
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}