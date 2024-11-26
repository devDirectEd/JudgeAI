import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Startup, StartupSchema } from 'src/models/startup.schema';
import { StartupController } from './startup.controller';
import { StartupService } from './startup.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Startup.name, schema: StartupSchema }]),
  ],
  controllers: [StartupController],
  providers: [StartupService, NotificationsService],
  exports: [StartupService, MongooseModule],
})
export class StartupModule {}