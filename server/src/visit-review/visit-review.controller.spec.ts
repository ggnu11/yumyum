import { Test, TestingModule } from '@nestjs/testing';
import { VisitReviewController } from './visit-review.controller';

describe('VisitReviewController', () => {
    let controller: VisitReviewController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VisitReviewController],
        }).compile();

        controller = module.get<VisitReviewController>(VisitReviewController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
