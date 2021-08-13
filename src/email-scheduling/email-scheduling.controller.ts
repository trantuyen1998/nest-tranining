import { EmailScheduleDto } from './dto/emailSchedule.dto';
import { EmailSchedulingService } from './email-scheduling.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}
  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    await this.emailSchedulingService.scheduleEmail(emailSchedule);
  }
}
