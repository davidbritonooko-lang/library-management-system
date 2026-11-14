import { IsEmail, IsString, IsByteLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsByteLength(1, 72)
  password!: string;
}
