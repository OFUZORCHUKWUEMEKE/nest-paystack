import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { CoreController } from 'src/common/core/controller.core';
import { Response } from 'express';

@Controller('webhooks')
export class WebhooksController extends CoreController {
    constructor(private readonly webhookService: WebhooksService) {
        super()
    }
    @Post('')
    async webhook(
        @Res({ passthrough: true }) res: Response,
        @Body() body: Record<string, any>,
    ) {
        console.log('body >> ', body);

        const { event, data } = body;

        await this.webhookService.webhook(event, body);


        return this.responseSuccess(res, '00', 'Success', {}, HttpStatus.CREATED);
    }
}
