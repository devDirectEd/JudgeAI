import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EvaluationDocument = Evaluation & Document;

@Schema()
class CriterionScore {
  @Prop()
  score: number;

  @Prop()
  question: string;

  @Prop()
  skipped: boolean;
}

@Schema()
class InduvidualScore {
  @Prop({ type: Types.ObjectId, ref: 'Round' })
  roundId: Types.ObjectId;

  @Prop()
  average: number;

  @Prop([CriterionScore])
  criteria: CriterionScore[];

  @Prop({ required: false })
  feedback?: string;
}

@Schema({ timestamps: true })
export class Evaluation {
  @Prop({ type: Types.ObjectId, ref: 'Startup' })
  startupId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Judge' })
  judgeId: Types.ObjectId;

  @Prop()
  averageScore: number;

  @Prop()
  feedback: string;

  @Prop([InduvidualScore])
  induvidualScores: InduvidualScore[];

  @Prop()
  isNominated: boolean;

  @Prop()
  willBeMentored: boolean;

  @Prop()
  willBeMet: boolean;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);
