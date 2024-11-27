import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { RoundService } from './round.service';
import { CreateRoundDto } from './round.dto';
import { SpreadsheetUrlDto } from 'src/common/dto';
import { SpreadsheetService } from 'src/services/spreadsheet/spreadsheet.service';
import { Auth } from 'src/common/decorators/role.decorators';
import { Permission } from 'src/types/permission.types';

@Controller('rounds')
export class RoundController {
  constructor(
    private readonly roundService: RoundService,
    private readonly spreadsheetService: SpreadsheetService,
  ) {}

  @Get()
  @Auth(['admin'], [Permission.MANAGE_ROUNDS])
  @HttpCode(HttpStatus.OK)
  async listRounds() {
    return this.roundService.listAllRounds();
  }
  
  @Post()
  @Auth(['admin'], [Permission.MANAGE_ROUNDS])
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createRound(@Body() createRoundDto: CreateRoundDto) {
    const round = await this.roundService.createRound(createRoundDto);
    return {
      message: 'Round created successfully',
      round,
    };
  }

  @Put(':id')
  @Auth(['admin'], [Permission.MANAGE_ROUNDS])
  @HttpCode(HttpStatus.OK)
  async updateRound(
    @Body() updateRoundDto: CreateRoundDto,
    @Param('id') roundId: string,
  ) {
    const round = await this.roundService.updateRound(roundId, updateRoundDto);
    return {
      message: 'Round updated successfully',
      round,
    };
  }

  @Delete(':id')
  @Auth(['admin'], [Permission.MANAGE_ROUNDS])
  @HttpCode(HttpStatus.OK)
  async deleteRound(@Param('id') roundId: string) {
    const round = await this.roundService.deleteRound(roundId);
    return {
      message: 'Round deleted successfully',
      round,
    };
  }

  @Post('import')
  @Auth(['admin'], [Permission.MANAGE_ROUNDS])
  @HttpCode(HttpStatus.CREATED)
  async uploadRounds(@Body() body: SpreadsheetUrlDto) {
    try {
      const data = await this.spreadsheetService.parseAndSaveRoundData(
        body.spreadsheetUrl,
      );
      return { data };
    } catch (error) {
      throw error;
    }
  }
}
