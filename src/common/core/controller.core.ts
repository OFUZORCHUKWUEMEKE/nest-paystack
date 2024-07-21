import { Controller } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class CoreController {
  async responseSuccess(
    res: Response,
    res_code: string,
    res_des: string,
    data: any,
    code: number,
  ) {
    res.status(code).json({
      success: true,
      response_code: `${res_code}`,
      response_description: `${res_des}`,
      data,
    });
  }
}