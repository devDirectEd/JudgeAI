import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  CreateScheduleDto,
  QueryScheduleDto,
  AssignJudgesDto,
  CreateScheduleViaUploadDto,
} from './schedule.dto';
import { Schedule, ScheduleDocument } from 'src/models/schedule.schema';
import { Judge } from 'src/models/judge.schema';
import { Startup } from 'src/models/startup.schema';
import { Round } from 'src/models/round.schema';
import { JudgeService } from '../judge/judge.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Judge.name) private judgeModel: Model<Judge>,
    @InjectModel(Startup.name) private startupModel: Model<Startup>,
    @InjectModel(Round.name) private roundModel: Model<Round>,
    private judgeService: JudgeService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    // Transform judges array to new format
    const formattedJudges = createScheduleDto.judges.map(judgeId => ({
      judge: judgeId,
      evaluated: false
    }));
    
    const schedule = new this.scheduleModel({
      ...createScheduleDto,
      judges: formattedJudges
    });
    
    await schedule.save();
    
    // Update to pass only judge IDs
    await this.judgeService.addAndNotifyJudgeofSchedule(
      schedule.judges.map(judge => judge.judge.toString()),
      schedule._id as string,
    );
    
    return schedule;
  }

  async listSchedules(query: QueryScheduleDto = {}): Promise<Schedule[]> {
    const { sortBy = 'createdAt', sortOrder = 'descending' } = query;
    return this.scheduleModel.find().sort({ [sortBy]: sortOrder });
  }

  async getSchedulesByDate(start: Date, end: Date) {
    try {
      if (start > end) {
        throw new BadRequestException('Start date must be before end date');
      }
      const schedules = await this.scheduleModel
        .find({
          date: {
            $gte: start,
            $lte: end,
          },
        })
        .select('roundId startupId date startTime endTime room')
        .populate('startupId', 'name')
        .populate('roundId', 'name')
        .populate({
          path: 'judges.judge',
          select: 'firstname lastname email',
          model: 'Judge',
        })
        .sort({ date: 1 });
      return schedules;
    } catch (error) {
      throw error;
    }
  }

  async getScheduleById(id: string): Promise<Schedule> {
    const schedule = await this.scheduleModel.findById(id);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  async getSchedulesByJudgeId(judgeId: string): Promise<Schedule[]> {
    return this.scheduleModel
      .find({ 'judges.judge': new Types.ObjectId(judgeId) })
      .populate('roundId', 'name')
      .populate('startupId', 'name')
      .populate('judges.judge', 'firstname lastname email')
      .select('-__v');
  }

  async bulkAddSchedules(
    schedules: CreateScheduleViaUploadDto[],
  ): Promise<Schedule[]> {
    // Validate and collect entity data in parallel
    const validationResults = await Promise.all(
      schedules.map(async (schedule) => {
        const { roundId, startupId, judges } = schedule;

        // Check if round exists
        const round = await this.roundModel.findOne({
          $or: [{ name: roundId }, { entityId: roundId }],
        });

        // Find all valid judges
        const validJudges = await this.judgeModel.find({
          entityId: {
            $in: judges
          },
        });

        // Check if startup exists
        const startup = await this.startupModel.findOne({
          startupID: startupId,
        });

        // If any required entity is missing, return the invalid schedule
        if (!round || judges.length !== validJudges.length || !startup) {
          return {
            isValid: false,
            schedule,
            entities: null,
          };
        }

        return {
          isValid: true,
          schedule,
          entities: {
            round,
            validJudges,
            startup,
          },
        };
      }),
    );

    // Find any invalid schedules
    const invalidSchedules = validationResults
      .filter((result) => !result.isValid)
      .map((result) => result.schedule);

    if (invalidSchedules.length > 0) {
      throw new BadRequestException(
        `${invalidSchedules.length} schedule${
          invalidSchedules.length === 1 ? ' has' : 's have'
        } invalid data`,
      );
    }

    // Transform schedules with MongoDB _ids and new judges format
    const transformedSchedules = validationResults.map((result) => {
      if (!result.isValid || !result.entities) return result.schedule;

      const { round, validJudges, startup } = result.entities;

      return {
        ...result.schedule,
        roundId: round._id,
        startupId: startup._id,
        judges: validJudges.map(judge => ({
          judge: judge._id,
          evaluated: false
        })),
      };
    });

    const insertedSchedules = await this.scheduleModel.insertMany(transformedSchedules);

    // Update to pass only judge IDs
    for (const schedule of insertedSchedules) {
      await this.judgeService.addAndNotifyJudgeofSchedule(
        schedule.judges.map(judge => judge.judge.toString()),
        schedule._id as string,
      );
    }
    
    return insertedSchedules.map((schedule) => schedule.toObject() as Schedule);
  }
}