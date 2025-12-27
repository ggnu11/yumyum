import { Test, TestingModule } from '@nestjs/testing';
import { PinAudienceService } from './pin-audience.service';

describe('PinAudienceService', () => {
  let service: PinAudienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinAudienceService],
    }).compile();

    service = module.get<PinAudienceService>(PinAudienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
