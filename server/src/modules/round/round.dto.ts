import { IsString, IsNumber, IsArray, IsNotEmpty, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  question: string;
}

class CriteriaDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsNumber()
  @Min(0)
  weight: number;

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
