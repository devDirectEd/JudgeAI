import { Global, Module } from '@nestjs/common';
import { GoogleSheetsConfig } from 'src/config/google-sheets.config';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { JudgeService } from 'src/modules/judge/judge.service';
import { StartupService } from 'src/modules/startup/startup.service';
import { ScheduleService } from 'src/modules/schedule/schedule.service';
import { RoundService } from 'src/modules/round/round.service';
import { JudgeModule } from 'src/modules/judge/judge.module';
import { StartupModule } from 'src/modules/startup/startup.module';
import { ScheduleModule } from 'src/modules/schedule/schedule.module';
import { RoundModule } from 'src/modules/round/round.module';
import { SpreadsheetService } from './spreadsheet.service';

@Global()
@Module({
  imports: [NotificationsModule, JudgeModule, StartupModule, ScheduleModule, RoundModule, ],
  providers: [
    SpreadsheetService,
    GoogleSheetsConfig,
    JudgeService,
    StartupService,
    ScheduleService,
    RoundService,
  ],
  exports: [SpreadsheetService, GoogleSheetsConfig],
})
export class SpreadsheetModule {}
