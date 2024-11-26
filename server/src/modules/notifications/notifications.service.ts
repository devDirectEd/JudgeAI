import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';


@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;
  private resend: Resend;
  private readonly BATCH_SIZE = 10;
  private readonly DELAY_MS = 1000;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASS'),
        },
      });
  }

 

  async sendCredentialsEmail(email: string, password: string, name: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'OXBRIDGE AIX JUDGE ACCOUNT.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <!-- Your existing HTML template -->
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendWelcomeEmail(email: string, teamName: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Welcome to OxbridgeAIX Community!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <!-- Your existing HTML template -->
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
  

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendBatchEmails(emailConfigs: Array<{
    from: string;
    to: string;
    subject: string;
    html: string;
  }>) {
    const results = [];

    for (let i = 0; i < emailConfigs.length; i += this.BATCH_SIZE) {
      const batch = emailConfigs.slice(i, i + this.BATCH_SIZE);

      try {
        const result = await this.resend.batch.send(batch);
        results.push(result);

        if (i + this.BATCH_SIZE < emailConfigs.length) {
          await this.sleep(this.DELAY_MS);
        }
      } catch (error) {
        console.error(`Error sending batch ${i / this.BATCH_SIZE + 1}:`, error);
        results.push({
          error,
          failedBatch: batch,
          batchIndex: i / this.BATCH_SIZE + 1,
        });
      }
    }

    return {
      totalBatches: Math.ceil(emailConfigs.length / this.BATCH_SIZE),
      totalEmails: emailConfigs.length,
      results,
    };
  }
}
