import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop()
  fullname: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'admin' })
  role: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);