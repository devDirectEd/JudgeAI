import { IsEmail, IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateJudgeDto {
  @IsString({ message: 'Firstname should be a string' })
  @IsNotEmpty({ message: 'Firstname is required' })
  firstname: string;

  @IsString({ message: 'Lastname should be a string' })
  @IsNotEmpty({ message: 'Lastname is required' })
  lastname: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Expertise should be a string' })
  @IsNotEmpty({ message: 'Expertise is required' })
  expertise: string;
}

export class LoginJudgeDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class JudgeResponseDto {
  id: string;
  name: string;
  email: string;
}
