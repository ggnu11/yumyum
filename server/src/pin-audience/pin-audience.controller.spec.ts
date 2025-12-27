import { Test, TestingModule } from '@nestjs/testing';
import { PinAudienceController } from './pin-audience.controller';

describe('PinAudienceController', () => {
  let controller: PinAudienceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinAudienceController],
    }).compile();

    controller = module.get<PinAudienceController>(PinAudienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
