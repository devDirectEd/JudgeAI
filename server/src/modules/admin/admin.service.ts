import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from 'src/models/admin.schema';
import { AdminMetrics } from 'src/types/admin.types';
import { Judge } from 'src/models/judge.schema';
import { Startup } from 'src/models/startup.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Judge.name) private judgeModel: Model<Judge>,
    @InjectModel(Startup.name) private startupModel: Model<Startup>,
    private readonly jwtService: JwtService,
  ) {}
  async getMetrics(): Promise<AdminMetrics> {
    const metrics: AdminMetrics = {
      averageScore: 0,
      totalJudges: 0,
      totalStartups: 0,
      upcomingPitches: 0,
    }

    //get the total number of judges
    metrics.totalJudges = await this.judgeModel.countDocuments();
    metrics.totalStartups = await this.startupModel.countDocuments();
    return metrics;
  }
  async getAdminById(id: string): Promise<AdminDocument> {
    try {
      return this.adminModel.findById(id);
    } catch (error) {
      throw error;
    }
  }
}
