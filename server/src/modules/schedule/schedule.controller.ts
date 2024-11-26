import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  HttpCode, 
  HttpStatus,
  UseGuards 
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto, QueryScheduleDto, AssignJudgesDto } from './schedule.dto';
import { SpreadsheetUrlDto } from 'src/common/dto';
import { SpreadsheetService } from 'src/services/spreadsheet/spreadsheet.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService,
    private readonly spreadsheetService: SpreadsheetService
  ) {}

  @Get()
  async listAllSchedules(@Query() query: QueryScheduleDto) {
    return this.scheduleService.listSchedules(query);
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
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Post(':id/assignJudges')
  async assignJudges(
    @Param('id') id: string,
    @Body() assignJudgesDto: AssignJudgesDto,
  ) {
    return this.scheduleService.assignJudges(id, assignJudgesDto);
  }

  @Post('import')
  @HttpCode(HttpStatus.CREATED)
  async uploadSchedules(@Body() body: SpreadsheetUrlDto) {
    try {
      const data = await this.spreadsheetService.parseAndSaveScheduleData(body.spreadsheetUrl);
      return { data };
    } catch (error) {
      throw error;
    }
  }
}
