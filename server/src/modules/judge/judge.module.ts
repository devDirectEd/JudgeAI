import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Judge, JudgeSchema } from 'src/models/judge.schema';
import { Schedule, ScheduleSchema } from 'src/models/schedule.schema';
import { JudgeController } from './judge.controller';
import { JudgeService } from './judge.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Judge.name, schema: JudgeSchema },
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [JudgeController],
  providers: [JudgeService, NotificationsService],
  exports: [JudgeService, MongooseModule],
})
export class JudgeModule {}