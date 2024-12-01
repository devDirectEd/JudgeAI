import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from 'src/models/evaluation.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      {name: Evaluation.name, schema: EvaluationSchema}
    ])
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
