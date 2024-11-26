import { Document, Types } from 'mongoose';

interface IQuestion {
  id: Types.ObjectId;
  question: string;
}

interface ICriteria {
  id: Types.ObjectId;
  question: string;
  weight: number;
  sub_questions: IQuestion[];
}

export interface IRound extends Document {
  name: string;
  criteria: ICriteria[];
}