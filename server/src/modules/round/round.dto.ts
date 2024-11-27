import { IsString, IsNumber, IsArray, IsNotEmpty, ValidateNested, Min, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;
}

class CriteriaDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  sub_questions: QuestionDto[];
}

export class CreateRoundDto {
  @IsString()
  @IsNotEmpty()
  name: string;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriteriaDto)
  criteria: CriteriaDto[];

}
