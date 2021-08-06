import { BufferedFile } from '../miniofile/minioFile.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MiniofileService } from 'src/miniofile/miniofile.service';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import User from './entity/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly minioFileService: MiniofileService,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne(id, {
      relations: ['avatar'],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async addAvatar(userId: number, imageBuffer: BufferedFile) {
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.minioFileService.deleteFile(user.avatar.id);
    }
    const avatar = await this.minioFileService.uploadFile(imageBuffer);
    await this.usersRepository.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.minioFileService.deleteFile(fileId);
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    /**
     * Hash refresh token before save to database
     */
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  /**
   * Check token matching with token in database
   */

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
