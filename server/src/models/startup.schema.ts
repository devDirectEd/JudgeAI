import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StartupDocument = Startup & Document;

@Schema({ timestamps: true })
export class Startup {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: false, default:null })
  startupID?: string;

  @Prop()
  teamLeader: string;

  @Prop()
  email: string;

  @Prop()
  category: string;
}

export const StartupSchema = SchemaFactory.createForClass(Startup);

StartupSchema.index({ name: 1 }, { unique: true });
