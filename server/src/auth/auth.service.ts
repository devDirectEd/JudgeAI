import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  UserRole,
  JwtPayload,
  LoginResponse,
  UserRoles,
} from '../types/auth.types';
import { LoginDto } from './auth.dto';
import { User, UserDocument } from 'src/models/user.schema';
import { Admin } from 'src/models/admin.schema';
import { Judge } from 'src/models/judge.schema';
import { RegisterAdminDto } from 'src/modules/admin/admin.dto';
import { InvalidRefreshTokenError } from './auth.errors';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Judge.name) private judgeModel: Model<Judge>,
    private jwtService: JwtService,
  ) {}

  async registerAdmin(createAdminDto: RegisterAdminDto) {
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      // First create the admin record
      const admin = new this.adminModel({
        fullname: createAdminDto.fullname,
        email: createAdminDto.email,
      });
      const savedAdmin = await admin.save({ session });

      // Then create the user record linking to admin
      const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
      const user = new this.userModel({
        email: createAdminDto.email,
        name: createAdminDto.fullname,
        password: hashedPassword,
        role: UserRole.ADMIN,
        roleId: savedAdmin._id,
      });
      await user.save({ session });

      await session.commitTransaction();

      return {
        id: savedAdmin._id,
        fullname: savedAdmin.fullname,
        email: savedAdmin.email,
        role: UserRole.ADMIN,
      };
    } catch (error) {
      await session.abortTransaction();
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  async login(loginDto: LoginDto, role: UserRoles) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get the role-specific entity (Admin or Judge)
    const entityModel =
      role === UserRole.ADMIN ? this.adminModel : this.judgeModel;
    const entity = await (entityModel as Model<Admin | Judge>).findById(
      user.roleId,
    );

    if (!entity) {
      throw new UnauthorizedException('User account is incomplete');
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
      roleId: user.roleId.toString(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: entity._id,
        email: entity.email,
        fullname: user.name,
        role: user.role,
      },
    };
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
      role: user.role as UserRole,
      roleId: user.roleId.toString(),
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
    await this.userModel
      .findByIdAndUpdate(userId, { refreshToken: null })
      .exec();
  }
}
