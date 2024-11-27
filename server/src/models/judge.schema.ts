import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JudgeDocument = Judge & Document;

@Schema({ timestamps: true })
export class Judge {
  @Prop()
  firstname: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required:false, default:null})
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