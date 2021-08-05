import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class MinioFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public key: string;
}

export default MinioFile;
