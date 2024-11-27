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

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Judge.name) private judgeModel: Model<Judge>,
    @InjectModel(Startup.name) private startupModel: Model<Startup>,
    @InjectModel(Round.name) private roundModel: Model<Round>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = new this.scheduleModel(createScheduleDto);
    return schedule.save();
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
          path: 'judges',
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

  async assignJudges(
    scheduleId: string,
    { judgeIds }: AssignJudgesDto,
  ): Promise<Schedule> {
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

    schedule.judges = [
      ...schedule.judges,
      ...judgeIds.map((id) => new Types.ObjectId(id)),
    ];
    return schedule.save();
  }

  async getSchedulesByJudgeId(judgeId: string): Promise<Schedule[]> {
    return this.scheduleModel
      .find({ judges: new Types.ObjectId(judgeId) })
      .populate('roundId', 'name')
      .populate('startupId', 'name')
      .populate('judges', 'firstname lastname email')
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
            $in: judges,
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

        // Return both validation status and entity data
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

    // Transform schedules with MongoDB _ids
    const transformedSchedules = validationResults.map((result) => {
      if (!result.isValid || !result.entities) return result.schedule; // This should never happen due to previous validation

      const { round, validJudges, startup } = result.entities;

      return {
        ...result.schedule,
        roundId: round._id,
        startupId: startup._id,
        judges: validJudges.map((judge) => judge._id),
      };
    });

    const insertedSchedules =
      await this.scheduleModel.insertMany(transformedSchedules);
    return insertedSchedules.map((schedule) => schedule.toObject() as Schedule);
  }
}
