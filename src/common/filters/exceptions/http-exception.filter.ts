import { BadRequestException, HttpStatus } from '@nestjs/common';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../../exceptions/base.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response | any>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let response_code: string;

    // defining response codes
    response_code =
      status == HttpStatus.NOT_FOUND
        ? (response_code = '004')
        : status == HttpStatus.BAD_REQUEST
        ? (response_code = '006')
        : status == HttpStatus.BAD_GATEWAY
        ? (response_code = '007')
        : status == HttpStatus.FORBIDDEN
        ? (response_code = '009')
        : status == HttpStatus.GATEWAY_TIMEOUT
        ? (response_code = '008')
        : status == HttpStatus.HTTP_VERSION_NOT_SUPPORTED
        ? (response_code = '010')
        : status == HttpStatus.NOT_ACCEPTABLE
        ? (response_code = '016')
        : status == HttpStatus.REQUEST_TIMEOUT
        ? (response_code = '013')
        : status == HttpStatus.UNAUTHORIZED
        ? (response_code = '011')
        : status == HttpStatus.UNPROCESSABLE_ENTITY
        ? (response_code = '012')
        : status == HttpStatus.UNSUPPORTED_MEDIA_TYPE
        ? (response_code = '015')
        : status == HttpStatus.URI_TOO_LONG
        ? (response_code = '014')
        : status == HttpStatus.SERVICE_UNAVAILABLE
        ? (response_code = '016')
        : status == HttpStatus.NOT_MODIFIED
        ? (response_code = '017')
        : status == HttpStatus.NOT_IMPLEMENTED
        ? (response_code = '018')
        : status == HttpStatus.INTERNAL_SERVER_ERROR
        ? 'An error encountered'
        : 'Internal Server error';

    let message: any;
    if (exception instanceof BadRequestException) {
      const xx: any = exception.getResponse();
      if (xx.hasOwnProperty('message')) {
        message = xx?.message;
      }
    }

    if (exception instanceof BaseException) {
      response_code = exception.getStatusCode();
    }

    response.status(status).json({
      success: 'false',
      response_code: response_code,
      response_description: exception.message || 'An Error Occured',
      message: message || exception.message || '',
    });

    console.log(`An Error Occured in ${request.url}`, exception);
  }
}
