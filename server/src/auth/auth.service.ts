import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, SignupDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

import {
  InvalidCredentialsError,
  UserExistsError,
  InvalidRefreshTokenError,
} from './auth.errors';
import { User, UserDocument } from 'src/models/user.schema';
import { JwtPayload, LoginResponse } from 'src/types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto): Promise<LoginResponse> {
    const existingUser = await this.userModel.findOne({ email: signupDto.email }).exec();

    if (existingUser) {
      throw new UserExistsError();
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const newUser = new this.userModel({
      ...signupDto,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    return this.generateTokens(savedUser);
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userModel.findOne({ email: loginDto.email }).exec();

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userModel.findById(payload.userId).exec();

      if (!user || user.refreshToken !== refreshToken) {
        throw new InvalidRefreshTokenError();
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidRefreshTokenError) {
        throw error;
      }
      throw new InvalidRefreshTokenError();
    }
  }

  private async generateTokens(user: UserDocument): Promise<LoginResponse> {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    // Save refresh token to user record
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null }).exec();
  }
}