import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminSchema } from 'src/models/admin.schema';
import { JudgeSchema } from 'src/models/judge.schema';
import { StartupSchema } from 'src/models/startup.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: 'Judge', schema: JudgeSchema }]),
    MongooseModule.forFeature([{ name: 'Startup', schema: StartupSchema }])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService, MongooseModule]
})
export class AdminModule {}