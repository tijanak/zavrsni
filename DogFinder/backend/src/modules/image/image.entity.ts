import { IImage } from '@dog-finder/models';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../post/post.entity';
@Entity()
export class Image implements IImage {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;
  @Column()
  @IsString()
  fileName: string;
  @Column('jsonb', { nullable: true })
  vector: number[];
  @ManyToOne(() => Post, (post) => post.images)
  post: Post;
}
