import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Evaluation } from 'src/models/evaluation.schema';
import { firstValueFrom } from 'rxjs';
import JSZip from 'jszip';

interface RankingResponse {
  message: string;
  rankings: {
    'Startup ID': string;
    'Judge ID': string;
    'Overall Score': number;
    Question: string;
    'Round Average': number;
    'Round Feedback': string;
    'Round ID': string;
    Score: number;
    Skipped: boolean;
  }[];
}

interface RankingsResult {
  json: RankingResponse;
  csv: {
    comprehensive: string;
    summary: string;
  };
}

@Injectable()
export class ResultsService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  private aiEndpoints() {
    const AI_BASE_URL = this.configService.get('AI_ENDPOINT');
    const endpoints_map = {
      AI_RANKINGS: `${AI_BASE_URL}/rankings/generate`,
      AI_RANKINGS_EXPORT: `${AI_BASE_URL}/rankings/download`,
      AI_QUESTIONS_CONFIG: `${AI_BASE_URL}/api/configure-questions`,
    };

    return { AI_BASE_URL, ...endpoints_map };
  }

  async generateRankings(
    evaluation: Evaluation,
    jsonFormat: boolean = true,
    csvFormat: boolean = false,
  ): Promise<Partial<RankingsResult>> {
    try {
      const endpoints = this.aiEndpoints();
      const requests = [];
      let jsonResponse = null;
      let csvResponse = null;

      if (jsonFormat) {
        requests.push(
          firstValueFrom(
            this.httpService.post<RankingResponse>(
              endpoints.AI_RANKINGS,
              evaluation,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            ),
          ),
        );
      }

      if (csvFormat) {
        requests.push(
          firstValueFrom(
            this.httpService.post(endpoints.AI_RANKINGS_EXPORT, evaluation, {
              headers: {
                'Content-Type': 'application/json',
              },
              responseType: 'arraybuffer',
            }),
          ),
        );
      }

      if (requests.length > 0) {
        const responses = await Promise.all(requests);

        if (jsonFormat) {
          jsonResponse = responses[0];
          if (csvFormat) {
            csvResponse = responses[1];
          }
        } else if (csvFormat) {
          csvResponse = responses[0];
        }
      }

      const result: Partial<RankingsResult> = {};

      if (jsonFormat && jsonResponse) {
        result.json = jsonResponse.data;
      }

      if (csvFormat && csvResponse) {
        result.csv = await this.processZipResponse(csvResponse.data);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error generating rankings',
        error.response?.status || 500,
      );
    }
  }

  private async processZipResponse(
    zipBuffer: ArrayBuffer,
  ): Promise<{ comprehensive: string; summary: string }> {
    try {
      const zip = new JSZip();

      const zipContent = await zip.loadAsync(zipBuffer);

      const csvFiles = {
        comprehensive: '',
        summary: '',
      };

      for (const [filename, file] of Object.entries(zipContent.files)) {
        const content = await file.async('string');

        if (filename.includes('comprehensive')) {
          csvFiles.comprehensive = content;
        } else if (filename.includes('summary')) {
          csvFiles.summary = content;
        }
      }

      return csvFiles;
    } catch (error) {
      throw new HttpException('Error processing rankings ZIP file', 500);
    }
  }

  async configureQuestions(categories: any) {
    try {
      const endpoints = this.aiEndpoints();
      const response = await firstValueFrom(
        this.httpService.post(
          endpoints.AI_QUESTIONS_CONFIG,
          { categories },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Error configuring questions',
        error.response?.status || 500,
      );
    }
  }

  private async fetchRankings(evaluations: Evaluation[]) {
    try {
      const rankingPromises = evaluations.map((evaluation) =>
        this.generateRankings(evaluation, true, false),
      );

      const results = await Promise.all(rankingPromises);

      const allRankings = results
        .filter((result) => result.json)
        .flatMap((result) => result.json.rankings)
        .sort((a, b) => b['Overall Score'] - a['Overall Score']);

      const groupedRankings = allRankings.reduce(
        (groups, ranking) => {
          const startupId = ranking['Startup ID'];
          if (!groups[startupId]) {
            groups[startupId] = [];
          }
          groups[startupId].push(ranking);
          return groups;
        },
        {} as Record<string, typeof allRankings>,
      );

      return {
        rankings: allRankings,
        groupedRankings: groupedRankings,
        summary: {
          totalEvaluations: evaluations.length,
          totalRankings: allRankings.length,
          uniqueStartups: Object.keys(groupedRankings).length,
        },
      };
    } catch (error) {
      throw new HttpException('Error processing multiple evaluations', 500, {
        cause: error,
      });
    }
  }

  private async exportRankings(evaluations: Evaluation[]) {
    try {
      const csvPromises = evaluations.map((evaluation) =>
        this.generateRankings(evaluation, false, true),
      );

      const results = await Promise.all(csvPromises);

      // Combine all CSV content
      const combinedCSV = {
        comprehensive: results
          .filter((result) => result.csv)
          .map((result) => result.csv.comprehensive)
          .join('\n'),
        summary: results
          .filter((result) => result.csv)
          .map((result) => result.csv.summary)
          .join('\n'),
      };

      return {
        csv: combinedCSV,
        summary: {
          totalEvaluations: evaluations.length,
          hasComprehensive: !!combinedCSV.comprehensive,
          hasSummary: !!combinedCSV.summary,
        },
      };
    } catch (error) {
      throw new HttpException('Error exporting multiple evaluations', 500, {
        cause: error,
      });
    }
  }

  private async fetchSingleRanking(evaluation: Evaluation) {
    try {
      const result = await this.generateRankings(evaluation, true, false);

      if (!result.json) {
        throw new HttpException('No JSON data received', 500);
      }

      const rankings = result.json.rankings.sort(
        (a, b) => b['Overall Score'] - a['Overall Score'],
      );

      return {
        rankings,
        summary: {
          totalScores: rankings.length,
          averageScore:
            rankings.reduce((sum, r) => sum + r['Overall Score'], 0) /
            rankings.length,
          startupId: rankings[0]?.['Startup ID'],
        },
      };
    } catch (error) {
      throw new HttpException('Error processing single evaluation', 500, {
        cause: error,
      });
    }
  }

  private async exportSingleRanking(evaluation: Evaluation) {
    try {
      const result = await this.generateRankings(evaluation, false, true);

      if (!result.csv) {
        throw new HttpException('No CSV data received', 500);
      }

      return {
        csv: result.csv,
        summary: {
          hasComprehensive: !!result.csv.comprehensive,
          hasSummary: !!result.csv.summary,
        },
      };
    } catch (error) {
      throw new HttpException('Error exporting single evaluation', 500, {
        cause: error,
      });
    }
  }
}
