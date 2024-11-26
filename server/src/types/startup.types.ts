import { Document, Types } from 'mongoose';

interface IFeedback {
  judgeId: Types.ObjectId;
  score: Map<string, number>;
  comments: string;
}

export interface IStartup extends Document {
  name: string;
  teamLeader: string;
  email: string;
  feedback: IFeedback[];
  judgeIds: Types.ObjectId[];
  results: Types.ObjectId[];
}
