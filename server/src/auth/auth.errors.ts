import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredError extends HttpException {
  constructor() {
    super('Authentication token has expired', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidTokenError extends HttpException {
  constructor() {
    super('Invalid authentication token', HttpStatus.UNAUTHORIZED);
  }
}

export class RefreshTokenExpiredError extends HttpException {
  constructor() {
    super('Refresh token has expired', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidCredentialsError extends HttpException {
  constructor() {
    super('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
}

export class UserExistsError extends HttpException {
  constructor() {
    super('User already exists', HttpStatus.CONFLICT);
  }
}

export class InvalidRefreshTokenError extends HttpException {
  constructor() {
    super('Invalid refresh token', HttpStatus.UNAUTHORIZED);
  }
}