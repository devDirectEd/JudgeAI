import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
} from 'class-validator';

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

  @IsOptional()
  @IsString({ message: 'EntityId should be a string' })
  entityId?: string;
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

export class getJudgeScheduleDto {
  @IsNotEmpty({ message: 'Judge Id is required' })
  @IsMongoId({ message: 'Invalid Judge ID' })
  id: string;
}
