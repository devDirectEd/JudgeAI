import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from 'src/models/evaluation.schema';
import { HttpModule } from '@nestjs/axios';
import { Round, RoundSchema } from 'src/models/round.schema';
import { Startup, StartupSchema } from 'src/models/startup.schema';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      {name: Evaluation.name, schema: EvaluationSchema},
      {name: Round.name, schema: RoundSchema},
      {name: Startup.name, schema: StartupSchema},
    ])
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
