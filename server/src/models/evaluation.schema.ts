import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EvaluationDocument = Evaluation & Document;

@Schema()
class RawFormSection {
  @Prop({ type: Map, of: Number })
  scores: Record<string, number>;

  @Prop()
  feedback: string;

  @Prop()
  isSkipped: boolean;
}

@Schema()
class SectionScore {
  @Prop()
  rawAverage: number;

  @Prop()
  percentageScore: number;

  @Prop()
  weightedScore: number;

  @Prop()
  maxPoints: number;

  @Prop({ required: false })
  feedback?: string;

  @Prop()
  isSkipped: boolean;

  @Prop({ type: Map, of: Number })
  individualScores: Record<string, number>;

  @Prop()
  totalPossibleQuestions: number;

  @Prop()
  answeredQuestions: number;
}

@Schema({ timestamps: true })
export class Evaluation {

  @Prop()
  scoringTime: string;

  @Prop({
    min: 0,
    max: 100
  })
  totalScore: number;

  @Prop()
  meetStartup: boolean;

  @Prop()
  mentorStartup: boolean;

  @Prop()
  nominateNextRound: boolean;

  @Prop()
  overallFeedback: string;

  @Prop({ type: Types.ObjectId, ref: 'Judge' })
  judgeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Startup' })
  startupId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Round' })
  roundId: Types.ObjectId;

  @Prop({
    type: Map,
    of: {
      type: {
        rawAverage: Number,
        percentageScore: Number,
        weightedScore: Number,
        maxPoints: Number,
        feedback: String,
        isSkipped: Boolean,
        individualScores: {
          type: Map,
          of: Number
        },
        totalPossibleQuestions: Number,
        answeredQuestions: Number
      }
    }
  })
  sectionScores: Record<string, SectionScore>;

  @Prop({
    type: Map,
    of: {
      type: {
        scores: {
          type: Map,
          of: Number
        },
        feedback: String,
        isSkipped: Boolean
      }
    }
  })
  rawFormData: Record<string, RawFormSection>;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);