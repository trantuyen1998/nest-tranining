import { Test, TestingModule } from '@nestjs/testing';
import { EmailSchedulingController } from './email-scheduling.controller';

describe('EmailSchedulingController', () => {
  let controller: EmailSchedulingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailSchedulingController],
    }).compile();

    controller = module.get<EmailSchedulingController>(EmailSchedulingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
