import { IsString } from 'class-validator';
export class CreateImageDto {
  @IsString()
  fileName: string;
  vector: number[];
}
