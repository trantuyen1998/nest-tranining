import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import { BufferedFile } from '../miniofile/minioFile.interface';
import { UsersService } from './users.service';
import FindOneParams from 'src/utils/findOneParams';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addAvatar(request.user.id, file as BufferedFile);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  async getUserById(@Param() { id }: FindOneParams) {
    return this.usersService.getById(Number(id));
  }
}
