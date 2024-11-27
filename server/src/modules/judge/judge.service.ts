import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateJudgeDto } from './judge.dto';
import { Judge, JudgeDocument } from 'src/models/judge.schema';
import { generateRandomPassword } from 'src/common/utils';
import { User, UserDocument } from 'src/models/user.schema';
import { UserRole } from 'src/types/auth.types';
import { NotificationsService } from '../notifications/notifications.service';
import { Schedule } from 'src/models/schedule.schema';
import { welcomeJudgeEmailTemplate } from '../notifications/templates/email.templates';

@Injectable()
export class JudgeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Judge.name) private judgeModel: Model<JudgeDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    private mailService: NotificationsService,
  ) {}

  async listAllJudges(
    sortBy: string = 'createdAt',
    sortOrder: SortOrder = 'desc',
  ) {
    return this.judgeModel.find().sort({ [sortBy]: sortOrder });
  }

  async createJudge(createJudgeDto: CreateJudgeDto) {
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      // Generate random password for judge
      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create judge record
      const judge = new this.judgeModel({
        firstname: createJudgeDto.firstname,
        lastname: createJudgeDto.lastname,
        email: createJudgeDto.email,
        expertise: createJudgeDto.expertise,
        entityId: createJudgeDto?.entityId || null,
      });
      const savedJudge = await judge.save({ session });

      // Create user record linking to judge
      const user = new this.userModel({
        name: `${createJudgeDto.firstname} ${createJudgeDto.lastname}`,
        email: createJudgeDto.email,
        password: hashedPassword,
        role: UserRole.JUDGE,
        roleId: savedJudge._id,
      });
      await user.save({ session });

      await session.commitTransaction();
      judge['passwordToken'] = password;
      //  Send credentials email
      await this.mailService.sendEmail({
        from: process.env.FROM_ADDRESS,
        subject: 'Welcome to the Startup Competition!',
        body: welcomeJudgeEmailTemplate(judge),
        to: createJudgeDto.email,
      });

      return {
        '_id': savedJudge._id.toString(),
        firstname: savedJudge.firstname,
        lastname: savedJudge.lastname,
        email: savedJudge.email,
        expertise: savedJudge.expertise,
        entityId: savedJudge?.entityId || null,
      };
    } catch (error) {
      await session.abortTransaction();
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateJudge(judgeId: string, updateJudgeDto: CreateJudgeDto) {
    try {
      const judge = await this.judgeModel.findByIdAndUpdate(
        judgeId,
        updateJudgeDto,
        { new: true },
      );
      if (!judge) {
        throw new BadRequestException('Judge not found');
      }
      return judge;
    } catch (error) {
      throw error;
    }
  }

  async deleteJudge(judgeId: string) {
    const judge = await this.judgeModel.findByIdAndDelete(judgeId);
    if (!judge) {
      throw new BadRequestException('Judge not found');
    }
    //delete corresponding user
    await this.userModel.deleteOne({ roleId: judge._id });
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
    const existingJudges = await this.judgeModel.find({
      email: { $in: judges.map((judge) => judge.email) },
    });
    if (existingJudges.length > 0) {
      throw new ConflictException(
        'One or more judges with these emails already exist',
      );
    }

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const judgesWithPassword = judges.map((judge) => ({
      ...judge,
      password: hashedPassword,
    }));
    const savedJudges = await this.judgeModel.create(judgesWithPassword);

    return savedJudges.map((judge) => ({
      firstname: judge.firstname,
      lastname: judge.lastname,
      email: judge.email,
      expertise: judge.expertise,
    }));
  }
}
