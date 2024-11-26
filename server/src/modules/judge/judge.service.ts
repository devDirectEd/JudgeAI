import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateJudgeDto } from './judge.dto';
import { Judge, JudgeDocument } from 'src/models/judge.schema';
import { generateRandomPassword } from 'src/common/utils';

@Injectable()
export class JudgeService {
  constructor(
    @InjectModel(Judge.name) private judgeModel: Model<JudgeDocument>,
    @InjectModel('Schedule') private scheduleModel: Model<any>  ) {}


   async listAllJudges(sortBy: string = 'createdAt', sortOrder: SortOrder = 'desc') {
    return this.judgeModel.find().sort({ [sortBy]: sortOrder });
  }

  async updateJudge(judgeId: string, updateJudgeDto: CreateJudgeDto) {
    const judge = await this.judgeModel.findByIdAndUpdate(judgeId, updateJudgeDto, { new: true });
    if (!judge) {
      throw new BadRequestException('Judge not found');
    }
    return judge;
  }

  async deleteJudge(judgeId: string) {
    const judge = await this.judgeModel.findByIdAndDelete(judgeId);
    if (!judge) {
      throw new BadRequestException('Judge not found');
    }
    return judge;
  }

  async getJudgeById(id: string) {
    return this.judgeModel.findById(id);
  }

  async getJudgeSchedules(judgeId: string) {
    return this.scheduleModel
      .find({ judges: judgeId })
      .select('roundId startupId date startTime endTime room')
      .populate('startupId', 'name');
  }
  async bulkRegisterJudges(judges: CreateJudgeDto[]) {
    const existingJudges = await this.judgeModel.find({ email: { $in: judges.map((judge) => judge.email) } });
    if (existingJudges.length > 0) {
      throw new ConflictException('One or more judges with these emails already exist');
    }

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const judgesWithPassword = judges.map((judge) => ({ ...judge, password: hashedPassword }));
    const savedJudges = await this.judgeModel.create(judgesWithPassword);

    return savedJudges.map((judge) => ({
      firstname: judge.firstname,
      lastname: judge.lastname,
      email: judge.email,
      expertise: judge.expertise,
    }));
  }
}