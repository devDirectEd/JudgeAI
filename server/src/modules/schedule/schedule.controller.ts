import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import {
  CreateScheduleDto,
  QueryScheduleDto,
  AssignJudgesDto,
  DateRangeDto,
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

  @Get('/range')
  @Auth(['admin'], [Permission.MANAGE_SCHEDULES])
  async getSchedulesByDate(@Query() dateRange: DateRangeDto) {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.scheduleService.getSchedulesByDate(startDate, endDate);
  }

  @Get('judges/:id')
  async getSchedulesByJudgeId(@Param('id') id: string) {
    return this.scheduleService.getSchedulesByJudgeId(id);
  }

  @Post()
  @Auth(['admin'], [Permission.MANAGE_SCHEDULES])
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
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
