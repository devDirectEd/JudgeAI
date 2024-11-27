import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import {
  CreateScheduleDto,
  QueryScheduleDto,
  AssignJudgesDto,
} from './schedule.dto';
import { SpreadsheetUrlDto } from 'src/common/dto';
import { SpreadsheetService } from 'src/services/spreadsheet/spreadsheet.service';
import { Auth } from 'src/common/decorators/role.decorators';
import { Permission } from 'src/types/permission.types';

@Controller('schedules')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly spreadsheetService: SpreadsheetService,
  ) {}

  @Get()
  async listAllSchedules(@Query() query: QueryScheduleDto) {
    return this.scheduleService.listSchedules(query);
  }

  @Get(':date')
  @Auth(['admin'], [Permission.MANAGE_SCHEDULES])
  async getSchedulesByDate(@Param('date') eventDate: Date) {
    return this.scheduleService.getSchedulesByDate(eventDate);
  }

  @Get('judges/:id')
  async getSchedulesByJudgeId(@Param('id') id: string) {
    return this.scheduleService.getSchedulesByJudgeId(id);
  }

  @Get(':id')
  async getScheduleById(@Param('id') id: string) {
    return this.scheduleService.getScheduleById(id);
  }

  @Post()
  @Auth(['admin'], [Permission.MANAGE_SCHEDULES])
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Post(':id/assignJudges')
  @Auth(['admin'], [Permission.MANAGE_SCHEDULES])
  async assignJudges(
    @Param('id') id: string,
    @Body() assignJudgesDto: AssignJudgesDto,
  ) {
    return this.scheduleService.assignJudges(id, assignJudgesDto);
  }

  @Post('import')
  @Auth(['admin'], [Permission.MANAGE_SCHEDULES])
  @HttpCode(HttpStatus.CREATED)
  async uploadSchedules(@Body() body: SpreadsheetUrlDto) {
    try {
      const data = await this.spreadsheetService.parseAndSaveScheduleData(
        body.spreadsheetUrl,
      );
      return { data };
    } catch (error) {
      throw error;
    }
  }
}
