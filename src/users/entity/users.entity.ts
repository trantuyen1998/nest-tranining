import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Address from './address.entity';
import Post from '../../posts/post.entity';
import MinioFile from '../../miniofile/minioFile.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column()
  public phoneNumber: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn() // hold key of address
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

  @JoinColumn()
  @OneToOne(() => MinioFile, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  public avatar?: MinioFile;
}

export default User;
