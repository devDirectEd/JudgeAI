import { IsDate, IsString, IsArray, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @IsMongoId()
  @IsNotEmpty()
  roundId: string;

  @IsString()
  @IsNotEmpty()
  startupId: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  room: string;

  @IsOptional()
  @IsString()
  remoteRoom?: string;

  @IsArray()
  @IsMongoId({ each: true })
  judges: string[];
}

export class AssignJudgesDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  judgeIds: string[];
}

export class QueryScheduleDto {
  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ascending' | 'descending';
}