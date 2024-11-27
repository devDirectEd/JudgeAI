import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/models/user.schema';
import { JwtStrategy } from './auth.strategy';
import { AuthInterceptor } from 'src/common/interceptors/auth.interceptor';
import { Admin, AdminSchema } from 'src/models/admin.schema';
import { Judge, JudgeSchema } from 'src/models/judge.schema';
import { NotificationsService } from 'src/modules/notifications/notifications.service';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Judge.name, schema: JudgeSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthInterceptor],
  exports: [AuthService, AuthInterceptor],
})
export class AuthModule {}