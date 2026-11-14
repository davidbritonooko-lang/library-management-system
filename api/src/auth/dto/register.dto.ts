import { Transform } from 'class-transformer';
import { IsByteLength, IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsEmail()
  @Length(3, 254)
  email!: string;

  @IsString()
  @IsByteLength(8, 72)
  password!: string;
}
