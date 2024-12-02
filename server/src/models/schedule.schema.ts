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
    // validate: {
    //   validator: function (v: Date) {
    //     const today = new Date();
    //     today.setHours(0,0,0,0);
    //     const inputDate = new Date(v);
    //     inputDate.setHours(0,0,0,0);
    //     return inputDate >= today;
    //   },
    //   message: 'Date cannot be in the past',
    // },
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
    type: [
      {
        judge: { type: Types.ObjectId, ref: 'Judge' },
        evaluated: { type: Boolean, default: false },
      },
    ],

    validate: {
      validator: function (v: { judge: Types.ObjectId; evaluated: boolean }[]) {
        return v.length >= 3;
      },
      message: 'At least 3 judges are required',
    },
    required: true,
  })
  judges: { judge: Types.ObjectId; evaluated: boolean }[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

ScheduleSchema.virtual('startup', {
  ref: 'Startup',
  localField: 'startupId',
  foreignField: 'startupID',
  justOne: true,
});
