import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entity/users.entity';
import { MiniofileModule } from 'src/miniofile/miniofile.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MiniofileModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
