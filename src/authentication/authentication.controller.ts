import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './interface/requestWithUser.interface';
import JwtAuthenticationGuard from './guard/jwt-authentication.guard';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async Login(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = await this.authenticationService.getCookieWithJwtToken(
      user.id,
    );
    request.res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    const cookieRemove = await this.authenticationService.getCookieForLogOut();
    response.setHeader('Set-Cookie', cookieRemove);
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('current-user')
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
