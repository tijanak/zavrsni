import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Lozinka mora imati barem 8 karaktera, jedno veliko slovo, jedno malo slovo, jedan broj i jedan specijalan znak.',
    }
  )
  @IsString()
  password: string;
  @IsEmail(undefined, { message: 'Email je neispravan' })
  @IsString()
  email: string;
  @IsPhoneNumber(undefined, { message: 'Broj je loseg formata' })
  @IsString()
  phone_number: string;
}
