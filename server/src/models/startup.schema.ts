import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class Feedback {
  @Prop({ type: Types.ObjectId, ref: 'Judge' })
  judgeId: Types.ObjectId;

  @Prop({ type: Map, of: Number })
  score: Map<string, number>;

  @Prop()
  comments: string;
}

export type StartupDocument = Startup & Document;

@Schema({ timestamps: true })
export class Startup {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: false })
  startupID?: string;

  @Prop()
  teamLeader: string;

  @Prop()
  email: string;

  @Prop()
  category: string;

  @Prop([Feedback])
  feedback: Feedback[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Judge' }] })
  judgeIds: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Result' }] })
  results: Types.ObjectId[];
}

export const StartupSchema = SchemaFactory.createForClass(Startup);

StartupSchema.index({ name: 1 }, { unique: true });
