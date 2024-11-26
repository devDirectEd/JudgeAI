import { IsNotEmpty, IsUrl } from 'class-validator';

export class SpreadsheetUrlDto {
  @IsNotEmpty()
  @IsUrl()
  spreadsheetUrl: string;
}
