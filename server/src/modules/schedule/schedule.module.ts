import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Judge, JudgeSchema } from 'src/models/judge.schema';
import { Schedule, ScheduleSchema } from 'src/models/schedule.schema';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Startup, StartupSchema } from 'src/models/startup.schema';
import { Round, RoundSchema } from 'src/models/round.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Judge.name, schema: JudgeSchema },
      { name: Startup.name, schema:StartupSchema},
      { name: Round.name, schema:RoundSchema}
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService, MongooseModule],
})
export class ScheduleModule {}