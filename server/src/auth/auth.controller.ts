import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './auth.dto';
import { Public } from 'src/common/decorators/public.decorators';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { RegisterAdminDto } from 'src/modules/admin/admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('admin/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: RegisterAdminDto) {
    return this.authService.registerAdmin(signupDto);
  }

  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'admin');
  }
  

  @Public()
  @Post('judge/login')
  @HttpCode(HttpStatus.CREATED)
  async loginJudge(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'judge');
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['userId']);
    return { message: 'Successfully logged out' };
  }
}
