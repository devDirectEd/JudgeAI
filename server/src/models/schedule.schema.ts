import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ type: Types.ObjectId, ref: 'Round', required: true })
  roundId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Startup' })
  startupId: Types.ObjectId;

  @Prop({
    required: true,
    validate: {
      validator: function (v: Date) {
        return v >= new Date();
      },
      message: 'Date cannot be in the past',
    },
  })
  date: Date;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  room: string;

  @Prop({ required: false, default: null })
  remoteRoom?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Judge' }],

    validate: {
      validator: function (v: any[]) {
        return v.length >= 3;
      },
      message: 'Judges array must have at least 3 judges',
    },
    required: true,
  })
  judges: Types.ObjectId[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

ScheduleSchema.virtual('startup', {
  ref: 'Startup',
  localField: 'startupId',
  foreignField: 'startupID',
  justOne: true,
});
