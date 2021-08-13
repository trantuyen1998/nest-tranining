import { EmailModule } from './../email/email.module';
import { Module } from '@nestjs/common';
import { EmailSchedulingService } from './email-scheduling.service';
import { EmailSchedulingController } from './email-scheduling.controller';

@Module({
  imports: [EmailModule],
  providers: [EmailSchedulingService],
  controllers: [EmailSchedulingController],
})
export class EmailSchedulingModule {}
