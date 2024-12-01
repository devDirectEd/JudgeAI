import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  sub_questions: QuestionDto[];
}

export class QuestionsConfigDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriteriaDto)
  categories: CriteriaDto[];
}
