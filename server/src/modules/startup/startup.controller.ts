import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { StartupService } from './startup.service';
import { CreateStartupDto, QueryStartupDto } from './startup.dto';
import { SpreadsheetUrlDto } from 'src/common/dto';
import { SpreadsheetService } from 'src/services/spreadsheet/spreadsheet.service';
import { Auth } from 'src/common/decorators/role.decorators';
import { Permission } from 'src/types/permission.types';

@Controller('startups')
export class StartupController {
  constructor(
    private readonly startupService: StartupService,
    private readonly spreadsheetService: SpreadsheetService,
  ) {}

  @Get()
  @Auth(['admin'], [Permission.MANAGE_STARTUPS])
  async listAllStartups(@Query() query: QueryStartupDto) {
    return this.startupService.listStartups(query);
  }

  @Get(':id')
  async getStartupById(@Param('id') id: string) {
    return this.startupService.getStartupById(id);
  }

  @Post()
  @Auth(['admin'], [Permission.MANAGE_STARTUPS])
  async registerStartup(@Body() createStartupDto: CreateStartupDto) {
    return this.startupService.registerStartup(createStartupDto);
  }

  @Put(':id')
  @Auth(['admin'], [Permission.MANAGE_STARTUPS])
  @HttpCode(HttpStatus.OK)
  async updateStartup(@Body() body: CreateStartupDto, @Param('id') id: string) {
    return this.startupService.updateStartup(id, body);
  }

  @Delete(':id')
  @Auth(['admin'], [Permission.MANAGE_STARTUPS])
  @HttpCode(HttpStatus.OK)
  async deleteStartup(@Param('id') id: string) {
    return this.startupService.deleteStartup(id);
  }

  @Post('import')
  @Auth(['admin'], [Permission.MANAGE_STARTUPS])
  @HttpCode(HttpStatus.CREATED)
  async uploadStartups(@Body() body: SpreadsheetUrlDto) {
    try {
      const data = await this.spreadsheetService.parseAndSaveStartupData(
        body.spreadsheetUrl,
      );
      return { data };
    } catch (error) {
      throw error;
    }
  }
}
