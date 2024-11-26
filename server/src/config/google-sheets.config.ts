import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

@Injectable()
export class GoogleSheetsConfig {
  private auth: JWT;

  constructor(private configService: ConfigService) {
    this.initializeGoogleSheets();
  }

  private initializeGoogleSheets() {
    const privateKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY');
    const formattedKey = privateKey
      .replace(/^'|'$/g, '')
      .replace(/\\n/g, '\n')
      .trim();

    this.auth = new google.auth.JWT({
      email: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
      key: formattedKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  }

  getAuth(): JWT {
    return this.auth;
  }
}
