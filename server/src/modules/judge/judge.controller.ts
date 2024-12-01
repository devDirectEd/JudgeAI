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
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JudgeService } from './judge.service';
import { SpreadsheetService } from 'src/services/spreadsheet/spreadsheet.service';
import { SpreadsheetUrlDto } from 'src/common/dto';
import { Auth } from 'src/common/decorators/role.decorators';
import { Permission } from 'src/types/permission.types';
import { CreateJudgeDto } from './judge.dto';
import { Request as ExpressRequest } from 'express';

@Controller('judges')
export class JudgeController {
  constructor(
    private readonly judgeService: JudgeService,
    private readonly spreadsheetService: SpreadsheetService,
  ) {}

  @Post('schedules/evaluation/test')
  async testEvaluation(@Body() body: any) {
    const { judgeId, scheduleId } = body;
    return this.judgeService.updateJudgeEvaluationStatus(judgeId, scheduleId);
  }

  @Get('schedules')
  @Auth(['judge'], [Permission.VIEW_SCHEDULE])
  async getJudgeSchedules(
    @Request() req: ExpressRequest,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('self') self?: boolean,
    @Query('id') id?: string,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid start and/or end format');
    }

    if (self) {
      const judgeId = req?.user['roleId'];
      return this.judgeService.getJudgeSchedules(judgeId, startDate, endDate);
    }

    if (id) {
      return this.judgeService.getJudgeSchedules(id, startDate, endDate);
    }

    throw new BadRequestException(
      'Either self or id query parameter is required',
    );
  }

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
