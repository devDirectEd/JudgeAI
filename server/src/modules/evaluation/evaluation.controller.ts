import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { Evaluation } from 'src/models/evaluation.schema';
import { Auth } from 'src/common/decorators/role.decorators';
import { Permission } from 'src/types/permission.types';
import { Request } from 'express';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Get()
  @Auth(['judge', 'admin'], [Permission.MANAGE_EVALUATIONS])
  async getPastEvaluations(
    @Req() req: Request,
    @Query('self') self?: boolean,
    @Query('id') id?: string,
  ): Promise<Evaluation[]> {
    if (self) {
      const judgeId = req?.user['roleId'];
      return this.evaluationService.getPastEvaluations(judgeId);
    }

    if (id) {
      return this.evaluationService.getPastEvaluations(id);
    }

    if (!self && !id) {
      throw new Error('Either self or id must be provided');
    }
  }

  @Get('single/:evaluationId')
  @Auth(['judge', 'admin'], [Permission.MANAGE_EVALUATIONS])
  async getSingleEvaluation(
    @Param('evaluationId') evaluationId: string,
  ): Promise<Evaluation> {
    return this.evaluationService.getSingleEvaluation(evaluationId);
  }

  @Post(':scheduleId/add')
  @Auth(['judge'], [Permission.MANAGE_EVALUATIONS])
  async addEvaluation(
    @Body() evaluation: any,
    @Param('scheduleId') scheduleId: string,
  ): Promise<Evaluation> {
    return this.evaluationService.addEvaluation(evaluation, scheduleId);
  }

  @Put(':evaluationId/update')
  @Auth(['judge'], [Permission.MANAGE_EVALUATIONS])
  async updateEvaluation(
    @Body() evaluation: any,
    @Param('evaluationId') evaluationId: string,
  ): Promise<Evaluation> {
    return this.evaluationService.updateEvaluation(evaluationId, evaluation);
  }
}
