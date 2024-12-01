import { Type } from 'class-transformer';
import { 
  IsString, 
  IsBoolean, 
  IsNumber, 
  IsObject,
  ValidateNested,
  Min,
  Max,
  IsOptional
} from 'class-validator';

class RawFormSectionDto {
  @IsObject()
  scores: Record<string, number>;

  @IsString()
  feedback: string;

  @IsBoolean()
  isSkipped: boolean;
}

class SectionScoreDto {
  @IsNumber()
  rawAverage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentageScore: number;

  @IsNumber()
  weightedScore: number;

  @IsNumber()
  maxPoints: number;

  @IsString()
  @IsOptional()
  feedback: string;

  @IsBoolean()
  isSkipped: boolean;

  @IsObject()
  individualScores: Record<string, number>;

  @IsNumber()
  totalPossibleQuestions: number;

  @IsNumber()
  answeredQuestions: number;
}

export class CreateEvaluationDto {
  @IsString()
  timestamp: string;

  @IsString()
  scoringTime: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  totalScore: number;

  @IsBoolean()
  meetStartup: boolean;

  @IsBoolean()
  mentorStartup: boolean;

  @IsBoolean()
  nominateNextRound: boolean;

  @IsString()
  overallFeedback: string;

  @IsString()
  judgeId: any 

  @IsObject()
  @ValidateNested()
  @Type(() => SectionScoreDto)
  sectionScores: Record<string, SectionScoreDto>;

  @IsObject()
  @ValidateNested()
  @Type(() => RawFormSectionDto)
  rawFormData: Record<string, RawFormSectionDto>;
}

