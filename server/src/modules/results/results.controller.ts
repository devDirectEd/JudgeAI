import {
  Controller,
  Get,
  Param,
  Query,
  Response,
  Header,
  HttpException,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { Auth } from 'src/common/decorators/role.decorators';
import { Permission } from 'src/types/permission.types';
import { Response as ExpressResponse } from 'express';
import * as JSZip from 'jszip';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('')
  @Auth(['admin'], [Permission.MANAGE_EVALUATIONS])
  @Header('Content-Type', 'application/json')
  async listAllResults(
    @Query('round') round: string,
    @Query('startups') startups: number,
  ) {
    if (!round) {
      throw new HttpException('Round required for analysis', 500);
    }
    return this.resultsService.listAllResults({ round, startups });
  }

  @Get('export')
  @Auth(['admin'], [Permission.MANAGE_EVALUATIONS])
  async exportResults(
    @Query('round') round: string,
    @Query('startups') startups: number,
    @Response() res: ExpressResponse,
  ) {
    const result = await this.resultsService.exportAllResults({
      round,
      startups,
    });
    const exportTimestamp = new Date().toISOString().replace(/:/g, '-');

    const zip = new JSZip();

    if (result.csv.comprehensive) {
      zip.file(
        `comprehensive_results_${exportTimestamp}.csv`,
        result.csv.comprehensive,
      );
    }

    if (result.csv.summary) {
      zip.file(`summary_results_${exportTimestamp}.csv`, result.csv.summary);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Set headers for zip download
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=results.zip',
      'Content-Length': zipBuffer.length,
    });

    return res.send(zipBuffer);
  }

  @Get('single/:evaluationId')
  @Auth(['admin'], [Permission.MANAGE_EVALUATIONS])
  @Header('Content-Type', 'application/json')
  async getSingleResult(@Param('evaluationId') evaluationId: string) {
    return this.resultsService.getSingleResult(evaluationId);
  }

  @Get('single/:evaluationId/export')
  @Auth(['admin'], [Permission.MANAGE_EVALUATIONS])
  async exportSingleResult(
    @Param('evaluationId') evaluationId: string,
    @Response() res: ExpressResponse,
  ) {
    const result = await this.resultsService.exportSingleResult(evaluationId);

    // Create a zip buffer containing both CSV files
    const zip = new JSZip();
    const exportTimestamp = new Date().toISOString().replace(/:/g, '-');

    if (result.csv.comprehensive) {
      zip.file(
        `comprehensive_results_${exportTimestamp}.csv`,
        result.csv.comprehensive,
      );
    }

    if (result.csv.summary) {
      zip.file(`summary_results_${exportTimestamp}.csv`, result.csv.summary);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Set headers for zip download
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition':
        'attachment; filename=single_evaluation_result.zip',
      'Content-Length': zipBuffer.length,
    });

    return res.send(zipBuffer);
  }

  @Get('export/raw')
  @Auth(['admin'], [Permission.MANAGE_EVALUATIONS])
  async exportRawResults(
    @Query('round') round: string,
    @Query('startups') startups: number,
    @Response() res: ExpressResponse,
  ) {
    if (!round) {
      throw new HttpException('Round required for export', 400);
    }

    const evaluations = await this.resultsService.getRawResults({
      round,
      startups,
    });

    const exportTimestamp = new Date().toISOString().replace(/:/g, '-');

    const zipBuffer =
      await this.resultsService.generateEvaluationCSVs(evaluations);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=raw_results_${exportTimestamp}.zip`,
      'Content-Length': zipBuffer.length,
    });

    return res.send(zipBuffer);
  }
}
