import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
class Feedback {
  @Prop({ type: Types.ObjectId, ref: 'Schedule' })
  scheduleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Startup' })
  startupId: Types.ObjectId;

  @Prop({ type: Map, of: Number })
  score: Map<string, number>;
}

export type JudgeDocument = Judge & Document;

@Schema({ timestamps: true })
export class Judge {
  @Prop()
  firstname: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required:false})
  entityId?: string

  @Prop()
  lastname: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  expertise: string;

  @Prop()
  password: string;


  @Prop({ type: [{ type: Types.ObjectId, ref: 'Schedule' }] })
  schedules: Types.ObjectId[];
}

export const JudgeSchema = SchemaFactory.createForClass(Judge);