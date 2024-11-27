import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class Question {
  @Prop()
  id: string;

  @Prop()
  question: string;
}

@Schema()
class Criteria {
  @Prop()
  id: string;

  @Prop()
  question: string;

  @Prop({default: true})
  active: boolean;

  @Prop()
  weight: number;

  @Prop([Question])
  sub_questions: Question[];
}

export type RoundDocument = Round & Document;

@Schema({ timestamps: true })
export class Round {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: false })
  entityId?: string;

  @Prop([Criteria])
  criteria: Criteria[];
}

export const RoundSchema = SchemaFactory.createForClass(Round);
