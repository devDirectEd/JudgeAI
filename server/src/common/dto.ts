import { IsNotEmpty, IsUrl } from 'class-validator';

export class SpreadsheetUrlDto {
  @IsNotEmpty({message: "Spreadsheet URL is required"})
  @IsUrl({}, { message: 'Invalid URL' })
  spreadsheetUrl: string;
}
