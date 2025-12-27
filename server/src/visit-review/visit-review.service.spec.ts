import { Test, TestingModule } from '@nestjs/testing';
import { VisitReviewService } from './visit-review.service';

describe('VisitReviewService', () => {
    let service: VisitReviewService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VisitReviewService],
        }).compile();

        service = module.get<VisitReviewService>(VisitReviewService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
