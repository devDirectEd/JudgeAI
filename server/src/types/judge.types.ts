import { Document, Types } from 'mongoose';

export interface IFeedback {
  scheduleId: Types.ObjectId;
  startupId: Types.ObjectId;
  score: Map<string, number>;
}

export interface IJudge extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  expertise: string[];
  schedules: Types.ObjectId[];
  feedback: IFeedback[];
  entityId: string;
  userId: Types.ObjectId;
}