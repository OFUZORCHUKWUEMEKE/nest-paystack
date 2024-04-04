import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { PaystackController } from './paystack.controller';
import { ExternalCall } from 'src/external-call/extrenal-call.service';

@Module({
  providers: [PaystackService,ExternalCall],
  controllers: [PaystackController],
  exports:[PaystackService]
})
export class PaystackModule {}
