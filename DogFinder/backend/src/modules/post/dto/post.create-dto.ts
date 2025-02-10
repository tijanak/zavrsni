import { IsBoolean, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  description: string;
  @IsBoolean()
  looking_for: boolean;
}
