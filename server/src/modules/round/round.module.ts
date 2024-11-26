import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Round, RoundSchema } from 'src/models/round.schema';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Round.name, schema: RoundSchema }]),
  ],
  controllers: [RoundController],
  providers: [RoundService],
  exports: [RoundService, MongooseModule],
})
export class RoundModule {}