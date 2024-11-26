import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Round, RoundDocument } from 'src/models/round.schema';
import { CreateRoundDto } from './round.dto';

@Injectable()
export class RoundService {
  constructor(
    @InjectModel(Round.name) private roundModel: Model<RoundDocument>
  ) {}

  async createRound(createRoundDto: CreateRoundDto): Promise<Round> {
    try {
      const round = new this.roundModel(createRoundDto);
      return await round.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Round with this name already exists');
      }
      throw error;
    }
  }
  async updateRound(roundId: string, updateRoundDto: CreateRoundDto): Promise<Round> {
    try {
      const round = await this.roundModel.findByIdAndUpdate(roundId, updateRoundDto, { new: true });
      if (!round) {
        throw new BadRequestException('Round not found');
      }
      return round;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Round with this name already exists');
      }
      throw error;
    }
  }

  async listAllRounds() {
    return this.roundModel.find();
  }
  async deleteRound(roundId: string) {
    const round = await this.roundModel.findByIdAndDelete(roundId);
    if (!round) {
      throw new BadRequestException('Round not found');
    }
    return round;
  }

  async bulkAddRounds(rounds: CreateRoundDto[]): Promise<Round[]> {
    try {
      const insertedRounds = await this.roundModel.insertMany(rounds);
      return insertedRounds.map(round => round.toObject() as Round);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('One or more rounds with duplicate names');
      }
      throw new BadRequestException(error?.message || 'Failed to create the rounds');
    }
  }
}
