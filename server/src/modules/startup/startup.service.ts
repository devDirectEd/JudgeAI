import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Startup, StartupDocument } from 'src/models/startup.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateStartupDto, QueryStartupDto } from './startup.dto';

@Injectable()
export class StartupService {
  constructor(
    @InjectModel(Startup.name) private startupModel: Model<StartupDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async registerStartup(createStartupDto: CreateStartupDto): Promise<Startup> {
    try {
      const startup = new this.startupModel(createStartupDto);
      await startup.save();
      // await this.notificationsService.sendWelcomeEmail(startup.email, startup.name);
      return startup;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Startup already exists');
      }
      throw error;
    }
  }
  async updateStartup(
    id: string,
    updateStartupDto: CreateStartupDto,
  ): Promise<Startup> {
    try {
      const startup = await this.startupModel.findByIdAndUpdate(
        id,
        updateStartupDto,
        { new: true },
      );
      if (!startup) {
        throw new NotFoundException('Startup not found');
      }
      return startup;
    } catch (error) {
      throw error;
    }
  }
  
  async deleteStartup(id: string): Promise<Startup> {
    const startup = await this.startupModel.findByIdAndDelete(id);
    if (!startup) {
      throw new NotFoundException('Startup not found');
    }
    return startup;
  }

  async listStartups(query: QueryStartupDto = {}): Promise<Startup[]> {
    const { sortBy = 'createdAt', sortOrder = 'descending' } = query;
    return this.startupModel.find().sort({ [sortBy]: sortOrder });
  }

  async getStartupById(id: string): Promise<Startup> {
    const startup = await this.startupModel.findById(id);
    if (!startup) {
      throw new NotFoundException('Startup not found');
    }
    return startup;
  }

  async bulkRegisterStartups(startups: CreateStartupDto[]): Promise<Startup[]> {
    try {
      return this.startupModel.insertMany(startups);
    } catch (error) {
      throw error;
    }
  }
}
