import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
import MinioFile from './minioFile.entity';
import { MiniofileService } from './miniofile.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get('MINIO_HOST'),
        port: configService.get('MINIO_PORT'),
        useSSL: false,
        accessKey: configService.get('MINIO_ACCESS_KEY'),
        secretKey: configService.get('MINIO_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([MinioFile]),
    ConfigModule,
  ],
  providers: [MiniofileService],
  exports: [MiniofileService],
})
export class MiniofileModule {}
