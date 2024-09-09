import { IPost } from '@dog-finder/models';
import { User } from '../user/user.entity';
import {
  OneToMany,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../image/image.entity';
@Entity()
export class Post implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  looking_for: boolean;

  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @OneToMany(() => Image, (image) => image.post)
  images: Image[];
}
