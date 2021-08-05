import { Test, TestingModule } from '@nestjs/testing';
import { MiniofileService } from './miniofile.service';

describe('MiniofileService', () => {
  let service: MiniofileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MiniofileService],
    }).compile();

    service = module.get<MiniofileService>(MiniofileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
