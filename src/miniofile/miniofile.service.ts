import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioService } from 'nestjs-minio-client';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import MinioFile from './minioFile.entity';
import { BufferedFile } from './minioFile.interface';

@Injectable()
export class MiniofileService {
  constructor(
    @InjectRepository(MinioFile)
    private minioFileRepository: Repository<MinioFile>,
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get config file for Minio
   */

  private readonly bucketName = this.configService.get('MINIO_BUCKET');
  private readonly MINIO_HOST = this.configService.get('MINIO_HOST');
  private readonly MINIO_PORT = this.configService.get('MINIO_PORT');

  /**
   * Set policy for access file
   */
  public async setPolicyFile() {
    // THIS IS THE POLICY
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:ListBucketMultipartUploads',
            's3:GetBucketLocation',
            's3:ListBucket',
          ],
          Resource: ['arn:aws:s3:::nestbucket'],
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:PutObject',
            's3:AbortMultipartUpload',
            's3:DeleteObject',
            's3:GetObject',
            's3:ListMultipartUploadParts',
          ],
          Resource: ['arn:aws:s3:::nestbucket/*'],
        },
      ],
    };
    await this.minio.client.setBucketPolicy(
      this.bucketName,
      JSON.stringify(policy),
      function (err) {
        if (err) throw err;

        console.log('Bucket policy set');
      },
    );
  }
  /**
   *
   * @param file
   * @param bucketName
   * @returns
   *
   * url: url of file
   * key: key of file
   */
  public async uploadFile(
    file: BufferedFile,
    bucketName: string = this.bucketName,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }

    /**
     * Add policy the same s3
     *
     */
    await this.setPolicyFile();

    /**
     * Handle file extension
     *
     */

    const timestamp = Date.now().toString();
    const uuidFile = `${uuid()}-${timestamp}`;
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };
    const fileName = uuidFile + extension;

    await this.minio.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
      function (err: any, res: any) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    const urlFile = `${this.MINIO_HOST}:${this.MINIO_PORT}/${this.bucketName}/${fileName}`;
    const newFile = {
      key: uuidFile,
      url: urlFile,
    };
    try {
      await this.minioFileRepository.save(newFile);
      return newFile;
    } catch (e) {
      console.log('add file error', e);
    }
  }
  public async deleteFile(fileId: number) {
    const file = await this.minioFileRepository.findOne({ id: fileId });
    const fileUrl = file.url;
    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    await this.minio.client.removeObject(
      this.bucketName,
      fileName,
      function (err: any) {
        if (err) {
          console.log('err remove', err);
        }
      },
    );
    await this.minioFileRepository.delete(fileId);
  }
}
