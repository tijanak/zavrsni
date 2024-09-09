import { IUser } from '@dog-finder/models';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsString()
  name: string;
  @Column()
  @IsString()
  surname: string;
  @Column({ select: false })
  @IsString()
  password: string;
  @Column({ unique: true })
  @IsEmail(undefined, { message: 'Email je neispravan' })
  email: string;
  @Column()
  @IsPhoneNumber(undefined, { message: 'Broj je loseg formata' })
  phone_number: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];
}
