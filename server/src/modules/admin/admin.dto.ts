import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @IsString({ message: 'Firstname should be a string' })
  @IsNotEmpty({ message: 'Firstname is required' })
  firstname: string;

  @IsString({ message: 'Lastname should be a string' })
  @IsNotEmpty({ message: 'Lastname is required' })
  lastname: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password should be a string' })
  @MinLength(6, { message: 'Password should be at least 6 characters' })
  password: string;
}

export class LoginAdminDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class AdminResponseDto {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}