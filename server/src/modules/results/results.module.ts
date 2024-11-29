import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from 'src/models/evaluation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Evaluation.name, schema: EvaluationSchema}
    ])
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
