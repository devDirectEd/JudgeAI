import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateScheduleDto, QueryScheduleDto, AssignJudgesDto } from './schedule.dto';
import { Schedule, ScheduleDocument } from 'src/models/schedule.schema';
import { Judge } from 'src/models/judge.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Judge.name) private judgeModel: Model<Judge>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = new this.scheduleModel(createScheduleDto);
    return schedule.save();
  }

  async listSchedules(query: QueryScheduleDto = {}): Promise<Schedule[]> {
    const { sortBy = 'createdAt', sortOrder = 'descending' } = query;
    return this.scheduleModel.find().sort({ [sortBy]: sortOrder });
  }

  async getScheduleById(id: string): Promise<Schedule> {
    const schedule = await this.scheduleModel.findById(id);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  async assignJudges(scheduleId: string, { judgeIds }: AssignJudgesDto): Promise<Schedule> {
    if (!judgeIds?.length) {
      throw new BadRequestException('No judge IDs provided');
    }

    const validJudges = await this.judgeModel.find({ _id: { $in: judgeIds } });
    if (validJudges.length !== judgeIds.length) {
      throw new BadRequestException('One or more judge IDs are invalid');
    }

    const schedule = await this.scheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    schedule.judges = [...schedule.judges, ...judgeIds.map(id => new Types.ObjectId(id))];
    return schedule.save();
  }

  async getSchedulesByJudgeId(judgeId: string): Promise<Schedule[]> {
    return this.scheduleModel.find({ judges: new Types.ObjectId(judgeId) })
      .populate('roundId', 'name')
      .populate('startupId', 'name')
      .populate('judges', 'firstname lastname email')
      .select('-__v');
  }
  async bulkAddSchedules(schedules: CreateScheduleDto[]): Promise<Schedule[]> {
    const insertedSchedules = await this.scheduleModel.insertMany(schedules);
    return insertedSchedules.map(schedule => schedule.toObject() as Schedule);
  }
}
