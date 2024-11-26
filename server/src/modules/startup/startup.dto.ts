import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStartupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  teamLeader: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}

export class QueryStartupDto {
  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ascending' | 'descending';
}
