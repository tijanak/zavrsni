import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Image } from '../image/image.entity';

@Entity({ name: 'dog_faces' })
export class DogFace {
  @PrimaryGeneratedColumn()
  face_id: number;

  @ManyToOne(() => Image, (image) => image.dogFaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'image_id' })
  image: Image;
  
   @Column({ type: 'text', nullable: true, insert: false, update: false, select: false })
  embedding: string;
}
