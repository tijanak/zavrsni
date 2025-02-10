import { IPost } from '@dog-finder/models';
import { User } from '../user/user.entity';
import {
  OneToMany,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,CreateDateColumn
} from 'typeorm';
import { Image } from '../image/image.entity';
@Entity()
export class Post implements IPost {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({ type: 'timestamptz' })
  time_created: Date;

  @Column()
  description: string;

  @Column()
  looking_for: boolean;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  creator: User;

  @OneToMany(() => Image, (image) => image.post)
  images: Image[];
}
