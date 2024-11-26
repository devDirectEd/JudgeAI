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
  question:string

  @Prop()
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

  @Prop([Criteria])
  criteria: Criteria[];
}

export const RoundSchema = SchemaFactory.createForClass(Round);