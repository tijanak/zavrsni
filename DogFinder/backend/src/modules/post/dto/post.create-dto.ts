import { IsBoolean, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  body: string;
  @IsBoolean()
  looking_for: boolean;
}
