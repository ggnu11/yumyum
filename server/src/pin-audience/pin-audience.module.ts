import { Module } from '@nestjs/common';
import { PinAudienceService } from './pin-audience.service';

@Module({
  providers: [PinAudienceService]
})
export class PinAudienceModule {}
