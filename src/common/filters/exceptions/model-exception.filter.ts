import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ModelNotFound } from '../../exceptions/model-not-found.exception';

@Catch(ModelNotFound)
export class ModelExceptionFilter implements ExceptionFilter {
  catch(exception: ModelNotFound, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      success: 'false',
      response_code: '004',
      response_description: exception.message,
      message: exception.message,
    });

    console.log(`An Error Occured in ${request.url}`, exception);
  }
}
