import { Test, TestingModule } from '@nestjs/testing';
import { EmailSchedulingService } from './email-scheduling.service';

describe('EmailSchedulingService', () => {
  let service: EmailSchedulingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSchedulingService],
    }).compile();

    service = module.get<EmailSchedulingService>(EmailSchedulingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
