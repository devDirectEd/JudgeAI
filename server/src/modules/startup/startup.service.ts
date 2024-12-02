import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Startup, StartupDocument } from 'src/models/startup.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateStartupDto, QueryStartupDto } from './startup.dto';
import { convertToCSV, ExportFieldHeader, ExportResult } from 'src/common/utils';
import { randomUUID } from 'crypto';



@Injectable()
export class StartupService {
  constructor(
    @InjectModel(Startup.name) private startupModel: Model<StartupDocument>,
    private notificationsService: NotificationsService,
  ) {}
  async registerStartup(createStartupDto: CreateStartupDto): Promise<Startup> {
    try {
      let startupID: string;
      let existing: Startup | null;
      
      do {
        startupID = randomUUID();
        existing = await this.startupModel.findOne({ startupID });
      } while (existing);
  
      const startup = new this.startupModel({ startupID, ...createStartupDto });
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

  async bulkExportStartups(
    format: 'csv' | 'json' | 'both' = 'both',
  ): Promise<ExportResult | string | Startup[]> {
    try {
      const startups = await this.startupModel.find().lean().exec();
      const fields: ExportFieldHeader[] = [
        {
          label: 'Name',
          value: 'name',
        },
        {
          label: 'Startup ID',
          value: 'startupID',
        },
        {
          label: 'Team Leader',
          value: 'teamLeader',
        },
        {
          label: 'Email',
          value: 'email',
        },
        {
          label: 'Category',
          value: 'category',
        },
        {
          label: 'Created At',
          value: (row) =>
            row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '',
        },
        {
          label: 'Updated At',
          value: (row) =>
            row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : '',
        },
      ];
      if (format === 'json') {
        return startups;
      }

      if (format === 'csv') {
        return convertToCSV({ fields, data: startups });
      }

      return {
        csv: convertToCSV({ fields, data: startups }),
        json: startups,
      };
    } catch (error) {
      throw new HttpException(
        `Error exporting startups: ${error.message}`,
        500,
      );
    }
  }
}
