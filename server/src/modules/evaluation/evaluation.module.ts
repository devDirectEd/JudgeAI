import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from 'src/models/evaluation.schema';
import { JudgeService } from '../judge/judge.service';
import { JudgeModule } from '../judge/judge.module';
import { Schedule, ScheduleSchema } from 'src/models/schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Evaluation.name, schema: EvaluationSchema},
      {name: Schedule.name, schema: ScheduleSchema},
    ]),
    JudgeModule
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService, JudgeService],
})
export class EvaluationModule {}
