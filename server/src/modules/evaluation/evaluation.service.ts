import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Evaluation } from 'src/models/evaluation.schema';
import { CreateEvaluationDto } from './evaluation.dto';
import { Judge } from 'src/models/judge.schema';
import { JudgeService } from '../judge/judge.service';
import { Schedule } from 'src/models/schedule.schema';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name)
    private readonly evaluationModel: Model<Evaluation>,
    @InjectModel(Judge.name) private readonly judgeModel: Model<Judge>,
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<Schedule>,
    private judgeService: JudgeService,
  ) {}

  async getPastEvaluations(judgeId: string): Promise<Evaluation[]> {
    return this.evaluationModel.find({ judgeId })
    .populate([{
      path: 'startupId',
      select: 'name'
    }])
    .lean().exec();
  }

  async addEvaluation(
    evaluation: CreateEvaluationDto,
    scheduleId: string,
  ): Promise<Evaluation> {

    const schedule = await this.scheduleModel.findById(scheduleId).exec();
    if (!schedule) {
      throw new Error('Error linking evaluation to schedule');
    }
    const newEvaluation: Omit<Evaluation, 'timestamp'> = {
      startupId: schedule.startupId,
      judgeId: evaluation.judgeId,
      roundId: schedule.roundId,
      ...evaluation,
    };

    const createdEvaluation = new this.evaluationModel(newEvaluation);
    await createdEvaluation.save();

    // since the evaluation is done for this schedule, we can update the schedule to reflect that
    await this.judgeService.updateJudgeEvaluationStatus(
      evaluation.judgeId,
      scheduleId,
    );

    //remove scheduleId from schedules array in judge
    await this.judgeModel.updateOne(
      { _id: evaluation.judgeId },
      { $pull: { schedules: new Types.ObjectId(scheduleId) } }
    );

    return createdEvaluation;
  }

  async getSingleEvaluation(evaluationId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationModel
      .findById(evaluationId)
      .populate('roundId')
      .exec();

    if (!evaluation) {
      throw new Error('Evaluation not found');
    }

    return evaluation;
  }

  async updateEvaluation(
    evaluationId: string,
    evaluation: CreateEvaluationDto,
  ): Promise<Evaluation> {
    const existingEvaluation = await this.evaluationModel
      .findById(evaluationId)
      .lean()
      .exec();


    if (!existingEvaluation) {
      throw new Error('Evaluation not found');
    }

    const updatedEvaluation: Omit<Evaluation, 'timestamp'> = {
      startupId: existingEvaluation.startupId,
      judgeId: existingEvaluation.judgeId,
      roundId: existingEvaluation.roundId,
      ...evaluation,
    };

    return await this.evaluationModel
      .findByIdAndUpdate(evaluationId, updatedEvaluation, { new: true })
      .exec();
  }
}
