import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Evaluation } from 'src/models/evaluation.schema';
import { firstValueFrom } from 'rxjs';
import * as JSZip from 'jszip';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Round } from 'src/models/round.schema';
import { Startup } from 'src/models/startup.schema';

interface StartupRanking {
  startupId: string;
  startupName: string;
  startupDetails: {
    name: string;
    email?: string;
    industry?: string;
    // Add other relevant startup fields
  };
  judgeId: string;
  overallScore: number;
  overallFeedback: string;
  roundScores: {
    roundId: string;
    average: number;
    feedback: string;
    questions: {
      question: string;
      score: number;
      skipped: boolean;
    }[];
  }[];
}
interface StartupEvaluation {
  averageScore: number;
  feedback: string;
  isNominated: boolean;
  judgeId: string;
  startupId: string;
  willBeMet: boolean;
  willBeMentored: boolean;
  individualScores: {
    roundId: string;
    average: number;
    feedback: string;
    criteria: {
      question: string;
      score: number;
      skipped: boolean;
    }[];
  }[];
}
export interface AggregatedRankings {
  rankings: StartupRanking[];
  groupedRankings: Record<string, StartupRanking>;
  summary: {
    totalEvaluations: number;
    totalStartups: number;
    averageScore: number;
  };
}
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
    @InjectModel(Evaluation.name) private evaluationModel: Model<Evaluation>,
    @InjectModel(Round.name) private roundModel: Model<Round>,
    @InjectModel(Startup.name) private startupModel: Model<Startup>,
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

  async listAllResults({
    round,
    startups,
  }: {
    round: string;
    startups: number;
  }) {
    if (!Types.ObjectId.isValid(round)) {
      throw new HttpException('Invalid round ID format', 400);
    }
    const evaluations = await this.evaluationModel
      .find({
        roundId: round,
      })
      .lean()
      .exec();
    return await this.fetchRankings(evaluations);
  }

  async exportAllResults({
    round,
    startups,
  }: {
    round: string;
    startups: number;
  }) {
    const evaluations = await this.evaluationModel
      .find({
        roundId: round,
      })
      .lean()
      .exec();
    return await this.exportRankings(evaluations);
  }

  async getSingleResult(evaluationId: string) {
    const evaluation = await this.evaluationModel
      .findById(evaluationId)
      .lean()
      .exec();
    if (!evaluation) {
      throw new HttpException('Evaluation not found', 404);
    }

    return await this.fetchSingleRanking(evaluation);
  }

  async exportSingleResult(evaluationId: string) {
    const evaluation = await this.evaluationModel
      .findById(evaluationId)
      .lean()
      .exec();
    if (!evaluation) {
      throw new HttpException('Evaluation not found', 404);
    }

    return await this.exportSingleRanking(evaluation);
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

      const relatedRound = await this.roundModel
        .findById(evaluation.roundId)
        .lean()
        .exec();

      const requestPayload: StartupEvaluation = this.mapEvaluation(
        evaluation,
        relatedRound,
      );

      if (jsonFormat) {
        requests.push(
          firstValueFrom(
            this.httpService.post<RankingResponse>(
              endpoints.AI_RANKINGS,
              requestPayload,
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
            this.httpService.post(
              endpoints.AI_RANKINGS_EXPORT,
              requestPayload,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',
              },
            ),
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
      console.log({ error });
      throw error;
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
      console.log({ error });
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

  // private async aggregateStartupRankings(
  //   rankings: RankingResponse['rankings'],
  // ): Promise<AggregatedRankings> {
  //   const startupMap = new Map<string, StartupRanking>();

  //   rankings.forEach(async (ranking) => {
  //     const startupId = ranking['Startup ID'];
  //     const relatedStartup = await this.startupModel
  //       .findById(startupId)
  //       .select('name');
  //     if (!startupMap.has(startupId)) {
  //       startupMap.set(startupId, {
  //         startupId: relatedStartup?.name || startupId,
  //         judgeId: ranking['Judge ID'],
  //         overallScore: ranking['Overall Score'],
  //         overallFeedback: ranking['Overall Feedback'],
  //         roundScores: [],
  //       });
  //     }

  //     const startup = startupMap.get(startupId)!;
  //     const roundId = ranking['Round ID'];

  //     let roundScore = startup.roundScores.find((r) => r.roundId === roundId);
  //     if (!roundScore) {
  //       roundScore = {
  //         roundId,
  //         average: ranking['Round Average'],
  //         feedback: ranking['Round Feedback'],
  //         questions: [],
  //       };
  //       startup.roundScores.push(roundScore);
  //     }

  //     roundScore.questions.push({
  //       question: ranking.Question,
  //       score: ranking.Score,
  //       skipped: ranking.Skipped,
  //     });
  //   });

  //   const sortedRankings = Array.from(startupMap.values()).sort(
  //     (a, b) => b.overallScore - a.overallScore,
  //   );

  //   const groupedRankings = sortedRankings.reduce(
  //     (acc, ranking) => {
  //       acc[ranking.startupId] = ranking;
  //       return acc;
  //     },
  //     {} as Record<string, StartupRanking>,
  //   );

  //   const averageScore =
  //     sortedRankings.reduce((sum, r) => sum + r.overallScore, 0) /
  //     sortedRankings.length;

  //   return {
  //     rankings: sortedRankings,
  //     groupedRankings,
  //     summary: {
  //       totalEvaluations: rankings.length / Object.keys(groupedRankings).length,
  //       totalStartups: sortedRankings.length,
  //       averageScore,
  //     },
  //   };
  // }
  private async aggregateStartupRankings(
    rankings: RankingResponse['rankings'],
  ): Promise<AggregatedRankings> {
    const startupIds = [...new Set(rankings.map(r => r['Startup ID']))];
    const judgeIds = [...new Set(rankings.map(r => r['Judge ID']))];
  
    const [startups] = await Promise.all([
      this.startupModel.find({ _id: { $in: startupIds } }).lean().exec()
    ]);
  
    const startupMap = new Map(startups.map(s => [s['_id'].toString(), s]));
  
    const rankingsByStartup = new Map<string, StartupRanking>();
  
    rankings.forEach(ranking => {
      const startupId = ranking['Startup ID'];
      const startup = startupMap.get(startupId) as unknown as Startup
  
      if (!rankingsByStartup.has(startupId)) {
        rankingsByStartup.set(startupId, {
          startupId,
          startupName: startup?.name || 'Unknown Startup',
          startupDetails: {
            name: startup?.name || 'Unknown Startup',
            email: startup?.email,
          },
          judgeId: ranking['Judge ID'],
          overallScore: ranking['Overall Score'],
          overallFeedback: ranking['Overall Feedback'],
          roundScores: []
        });
      }
  
      const startupRanking = rankingsByStartup.get(startupId)!;
      const roundId = ranking['Round ID'];
  
      let roundScore = startupRanking.roundScores.find(r => r.roundId === roundId);
      if (!roundScore) {
        roundScore = {
          roundId,
          average: ranking['Round Average'],
          feedback: ranking['Round Feedback'],
          questions: []
        };
        startupRanking.roundScores.push(roundScore);
      }
  
      roundScore.questions.push({
        question: ranking.Question,
        score: ranking.Score,
        skipped: ranking.Skipped
      });
    });
  
    const sortedRankings = Array.from(rankingsByStartup.values())
      .sort((a, b) => b.overallScore - a.overallScore);
  
    const groupedRankings = sortedRankings.reduce((acc, ranking) => {
      acc[ranking.startupId] = ranking;
      return acc;
    }, {} as Record<string, StartupRanking>);
  
    const averageScore = sortedRankings.reduce((sum, r) => sum + r.overallScore, 0) / sortedRankings.length;
  
    return {
      rankings: sortedRankings,
      groupedRankings,
      summary: {
        totalEvaluations: rankings.length / startupIds.length,
        totalStartups: sortedRankings.length,
        averageScore,
      }
    };
  }
  

  private async fetchRankings(evaluations: Evaluation[]) {
    try {
      const rankingPromises = evaluations.map((evaluation) =>
        this.generateRankings(evaluation, true, false),
      );

      const results = await Promise.all(rankingPromises);

      const allRankings = results
        .filter((result) => result.json)
        .flatMap((result) => result.json.rankings);

      return this.aggregateStartupRankings(allRankings);
    } catch (error) {
      throw new HttpException('Error processing multiple evaluations', 500, {
        cause: error,
      });
    }
  }

  private async exportRankings(
    evaluations: Evaluation[],
    jsonFormat = false,
    csvFormat = true,
  ) {
    try {
      const csvPromises = evaluations.map((evaluation) =>
        this.generateRankings(evaluation, jsonFormat, csvFormat),
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

  private async exportSingleRanking(
    evaluation: Evaluation,
    jsonFormat = false,
    csvFormat = true,
  ) {
    try {
      const result = await this.generateRankings(
        evaluation,
        jsonFormat,
        csvFormat,
      );

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

  private mapEvaluation(evaluation: any, round: Round): StartupEvaluation {
    const questionMap = new Map<string, string>();

    round.criteria.forEach((criterion) => {
      questionMap.set(criterion?.['_id']?.toString(), criterion.question);
      criterion.sub_questions.forEach((subQ) => {
        questionMap.set(subQ?.['_id']?.toString(), subQ.question);
      });
    });

    return {
      averageScore: evaluation.totalScore,
      feedback: evaluation.overallFeedback || '',
      isNominated: evaluation.nominateNextRound || false,
      judgeId: evaluation.judgeId,
      startupId: evaluation.startupId,
      willBeMet: evaluation.meetStartup || false,
      willBeMentored: evaluation.mentorStartup || false,
      individualScores: Object.entries(evaluation.sectionScores).map(
        ([roundId, scores]: [string, any]) => {
          if (
            !scores?.individualScores ||
            typeof scores.individualScores !== 'object'
          ) {
            return {
              roundId,
              average: 0,
              feedback: '',
              criteria: [],
            };
          }

          return {
            roundId,
            average: scores.rawAverage || 0,
            feedback: scores.feedback || '',
            criteria: Object.entries(scores.individualScores).map(
              ([questionId, score]: [string, any]) => ({
                question: questionMap.get(questionId) || questionId,
                score: typeof score === 'number' ? score : 0,
                skipped: scores.isSkipped || false,
              }),
            ),
          };
        },
      ),
    };
  }
}
