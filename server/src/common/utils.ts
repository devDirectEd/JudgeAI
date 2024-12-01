import { Parser } from 'json2csv';

export interface ExportResult {
  csv: string;
  json: any;
}

export type ExportFieldHeader = {
  label: string;
  value: string | ((row: any) => string);
};
interface ConvertProps {
  fields: ExportFieldHeader[];
  data: any;
}
export function generateRandomPassword(length = 8) {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export function convertToCSV({ fields, data }: ConvertProps) {
  try {
    const json2csvParser = new Parser({
      fields,
      defaultValue: 'N/A',
    });

    return json2csvParser.parse(data);
  } catch (error) {
    throw error;
  }
}
