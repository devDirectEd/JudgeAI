import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  Put,
  Delete,
} from '@nestjs/common';
import { JudgeService } from './judge.service';
import { SpreadsheetService } from 'src/services/spreadsheet/spreadsheet.service';
import { SpreadsheetUrlDto } from 'src/common/dto';
import { Auth } from 'src/common/decorators/role.decorators';
import { Permission } from 'src/types/permission.types';
import { CreateJudgeDto } from './judge.dto';

@Controller('judges')
export class JudgeController {
  constructor(
    private readonly judgeService: JudgeService,
    private readonly spreadsheetService: SpreadsheetService,
  ) {}

  @Get()
  @Auth(['admin'], [Permission.MANAGE_JUDGES])
  async listAllJudges(
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.judgeService.listAllJudges(sortBy, sortOrder);
  }

  @Post()
  @Auth(['admin'], [Permission.MANAGE_JUDGES])
  @HttpCode(HttpStatus.CREATED)
  async createJudge(@Body() body: CreateJudgeDto) {
    return this.judgeService.createJudge(body);
  }

  @Put(':id')
  @Auth(['admin'], [Permission.MANAGE_JUDGES])
  @HttpCode(HttpStatus.OK)
  async updateJudge(@Body() body: CreateJudgeDto, @Param('id') id: string) {
    return this.judgeService.updateJudge(id, body);
  }

  @Delete(':id')
  @Auth(['admin'], [Permission.MANAGE_JUDGES])
  @HttpCode(HttpStatus.OK)
  async deleteJudge(@Param('id') id: string) {
    return this.judgeService.deleteJudge(id);
  }

  @Get(':id')
  async getJudgeById(@Param('id') id: string) {
    return this.judgeService.getJudgeById(id);
  }

  @Get(':id/schedules')
  async getJudgeSchedules(@Param('id') id: string) {
    return this.judgeService.getJudgeSchedules(id);
  }

  @Post('import')
  @Auth(['admin'], [Permission.MANAGE_JUDGES])
  @HttpCode(HttpStatus.CREATED)
  async importJudges(@Body() body: SpreadsheetUrlDto) {
    try {
      const data = await this.spreadsheetService.parseAndSaveJudgeData(
        body.spreadsheetUrl,
      );
      return { data };
    } catch (error) {
      throw error;
    }
  }
}
