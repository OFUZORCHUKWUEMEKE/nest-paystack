import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  protected statusCode: string;
  constructor(message?: string, statusCode?: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.setStatusCode(statusCode);
  }

  public getStatusCode(): string {
    return this.statusCode;
  }

  public setStatusCode(statusCode: string): void {
    this.statusCode = statusCode;
  }
}
