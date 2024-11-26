import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleSheetsConfig } from '../../config/google-sheets.config';
import * as bcrypt from 'bcrypt';
import { JWT } from 'google-auth-library';
import {
  welcomeJudgeEmailTemplate,
  welcomeTeamEmailTemplate,
} from 'src/modules/notifications/templates/email.templates';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { JudgeService } from 'src/modules/judge/judge.service';
import { StartupService } from 'src/modules/startup/startup.service';
import { ScheduleService } from 'src/modules/schedule/schedule.service';
import { RoundService } from 'src/modules/round/round.service';
import { generateRandomPassword } from 'src/common/utils';

@Injectable()
export class SpreadsheetService {
  constructor(
    private googleSheetsConfig: GoogleSheetsConfig,
    private notificationsService: NotificationsService,
    private judgeService: JudgeService,
    private startupService: StartupService,
    private scheduleService: ScheduleService,
    private roundService: RoundService,
  ) {
    this.auth = this.googleSheetsConfig.getAuth();
  }
  auth: JWT;
  logger: Logger = new Logger('SpreadsheetService');

  private extractSheetId(sheetUrl: string): string {
    const regex = /\/d\/([a-zA-Z0-9-_]+)/;
    const match = sheetUrl.match(regex);
    if (match?.[1]) {
      return match[1];
    }
    throw new BadRequestException('Invalid Google Sheets URL');
  }

  private async getAllSheetData(spreadsheetId: string) {
    try {
      const sheets = google.sheets({
        version: 'v4',
        auth: this.googleSheetsConfig.getAuth(),
      });
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });

      const allSheetsData = {};

      for (const sheet of spreadsheet.data.sheets) {
        const sheetName = sheet.properties.title;

        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!A1:BZ1000`,
        });

        allSheetsData[sheetName] = response.data;

        if (response.data.values && response.data.values.length > 1) {
          const headerRow = response.data.values[0];
          const jsonData = response.data.values.slice(1).map((row) => {
            const obj = {};
            headerRow.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });
          allSheetsData[sheetName] = {
            processedData: jsonData,
          };
        } else {
          console.log(
            `No data or only header row found in sheet "${sheetName}"`,
          );
          allSheetsData[sheetName] = {
            processedData: [],
          };
        }
      }

      return allSheetsData;
    } catch (error) {
      console.error('Error getting sheet data:', error);
      if (error.code === 404) {
        throw new BadRequestException('Spreadsheet not found');
      }
      if (error.code === 403) {
        throw new InternalServerErrorException('Spreadsheet is private, or you do not have access');
      }
      throw new Error(error?.message || 'An error occured');
    }
  }

  refineJudgeData(rawData) {
    const refinedData = {
      entityId: rawData['Id'] || null,
      firstname: rawData['Judge First Name'] || null,
      lastname: rawData['Judge Last Name'] || null,
      email: rawData['Email'] || null,
      expertise: rawData['Expertise'] || null,
    };
    return refinedData;
  }

  refineRoundData(rawData) {
    const refinedData = {
      question: rawData['Primary Question / Criteria'] || null,
      weight: rawData['Weight %'] || null,
      active: true
    };
    const sub_questions = Array.from({ length: 10 }, (_, i) => i + 1)
      .map((i) => rawData[`sq${i}`])
      .filter((question) => question)
      .map((question) => ({ question }));
    refinedData['sub_questions'] =
      sub_questions.length > 0 ? sub_questions : null;
    return refinedData;
  }

  refineStartupData(rawData) {
    const refinedData = {
      startupID: rawData['Id'] || null,
      name: rawData['Start-Up Name'] || null,
      teamLeader: rawData['Team Leader Name'] || null,
      email: rawData['Email'] || null,
      category: rawData['Category (Dropdown)'] || null,
    };
    return refinedData;
  }

  refineScheduleData(rawData) {
    const refinedData = {
      startupId: rawData['Startup ID'] || null,
      date: rawData['Date'] || null,
      startTime: rawData['Start time'] || null,
      endTime: rawData['End time'] || null,
      roundId: rawData['Round Name / Id'] || null,
      room: rawData['Room'] || null,
      remoteRoom: rawData['Remote Room (if remote pitch available)'] || null,
    };
    const judges = Array.from({ length: 50 }, (_, i) => i + 1)
      .map((i) => rawData[`Judge ${i}`])
      .filter((judge) => judge);
    refinedData['judges'] = judges.length > 0 ? judges : null;
    console.log(judges, judges.length)
    return refinedData;
  }
  parseScheduleDataFromSheet = async (sheetUrl:string) => {
    try {
      const sheetId = this.extractSheetId(sheetUrl);
      const allSheetData = await this.getAllSheetData(sheetId);
      const scheduleData = allSheetData['Schedule']['processedData'] || [];
      return scheduleData.map((rawData) => this.refineScheduleData(rawData));
    } catch (error) {
      throw error;
    }
  };

  parseRoundDataFromSheet = async (sheetUrl:string) => {
    try {
      const rounds = [];
      const sheetId = this.extractSheetId(sheetUrl);
      const allSheetData = await this.getAllSheetData(sheetId);
      const roundsData = allSheetData;
      for (const roundName in roundsData) {
        const roundData = roundsData[roundName]['processedData'] || [];
        const refinedRoundData = roundData.map((rawData) =>
          this.refineRoundData(rawData),
        );
        rounds.push({ name: roundName, criteria: refinedRoundData });
      }
      return rounds;
    } catch (error) {
      throw error;
    }
  };

  parseStartupDataFromSheet = async (sheetUrl: string) => {
    try {
      const sheetId = this.extractSheetId(sheetUrl);
      const allSheetData = await this.getAllSheetData(sheetId);
      const startupData = allSheetData['Startups']['processedData'] || [];
      return startupData.map((rawData) => this.refineStartupData(rawData));
    } catch (error) {
      throw error;
    }
  };

  parseJudgeDataFromSheet = async (sheetUrl:string) => {
    try {
      const sheetId = this.extractSheetId(sheetUrl);
      const allSheetData = await this.getAllSheetData(sheetId);
      const judgeData = allSheetData['Judges']['processedData'] || [];
      return judgeData.map((rawData) => this.refineJudgeData(rawData));
    } catch (error) {
      throw error;
    }
  };
  parseAndSaveJudgeData = async (sheetUrl:string) => {
    try {
      const judgeData = await this.parseJudgeDataFromSheet(sheetUrl);
      //add a password prop to each judge
      judgeData.forEach((judge) => {
        const password = generateRandomPassword();
        const encryptedPassword = bcrypt.hashSync(password, 10);
        judge['password'] = encryptedPassword;
        judge['passwordToken'] = password;
      });

      const emailConfigs = judgeData.map((judge) => ({
        from: process.env.FROM_ADDRESS,
        to: judge.email,
        subject: 'Welcome to the Startup Competition!',
        html: welcomeJudgeEmailTemplate(judge),
      }));
      //send a email to each judge with their password
      await this.notificationsService.sendBatchEmails(emailConfigs);
      //remove the passwordToken from the data
      const sanitizedData = judgeData.map((judge) => {
        delete judge.passwordToken;
        return judge;
      });
      //then save the data to the database
      const result = await this.judgeService.bulkRegisterJudges(sanitizedData);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  parseAndSaveStartupData = async (sheetUrl: string) => {
    try {
      const startupData = await this.parseStartupDataFromSheet(sheetUrl);
      //send emails to each startup
      const emailConfigs = startupData.map((startup) => ({
        from: process.env.FROM_ADDRESS,
        to: startup.email,
        subject: 'Welcome to the Startup Competition!',
        html: welcomeTeamEmailTemplate(startup),
      }));
      await this.notificationsService.sendBatchEmails(emailConfigs);
      //save the data to the database
      await this.startupService.bulkRegisterStartups(startupData);
      return startupData;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('One or more startups already exist');
      }
      throw error;
    }
  };

  parseAndSaveScheduleData = async (sheetUrl: string) => {
    try {
      const scheduleData = await this.parseScheduleDataFromSheet(sheetUrl);
      //save the data to the database
      await this.scheduleService.bulkAddSchedules(scheduleData);
      return scheduleData;
    } catch (error) {
      throw error;
    }
  };
  parseAndSaveRoundData = async (sheetUrl:string) => {
    try {
      const roundData = await this.parseRoundDataFromSheet(sheetUrl);
      //save the data to the database
      await this.roundService.bulkAddRounds(roundData);
      return roundData;
    } catch (error) {
      throw error;
    }
  };
}
