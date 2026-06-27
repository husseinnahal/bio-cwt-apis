// Service handles authentication flows, token generation (JWT), session refresh, and logouts.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Define a type-safe structure for the JWT payload
interface JwtPayload {
  email: string;
  sub: string;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Validates user credentials (email & password) and restricts entry to users with ADMIN role.
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password' | 'hashedRefreshToken'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      if (user.role !== 'ADMIN') {
        throw new UnauthorizedException('Access denied. Admin role required.');
      }
      const { password, hashedRefreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  // Logs in a validated user and returns both short-lived access token and long-lived refresh token
  async login(user: Omit<User, 'password' | 'hashedRefreshToken'>) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    // Generate JWT access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwtSecret'),
      expiresIn: this.configService.get<string>('app.jwtExpiresIn') as any,
    });

    // Generate JWT refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwtRefreshSecret'),
      expiresIn: this.configService.get<string>('app.jwtRefreshExpiresIn') as any,
    });

    // Store the refresh token in hashed form inside the user's DB entry
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  // Verifies the refresh token, checks it against the database hash, and issues a new pair of tokens
  async refreshTokens(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('app.jwtRefreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userId = payload.sub;
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verify refresh token matching the hashed copy in DB
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    // Issue new access and refresh tokens
    const newPayload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('app.jwtSecret'),
      expiresIn: this.configService.get<string>('app.jwtExpiresIn') as any,
    });

    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('app.jwtRefreshSecret'),
      expiresIn: this.configService.get<string>('app.jwtRefreshExpiresIn') as any,
    });

    // Save the new refresh token in DB
    await this.usersService.updateRefreshToken(user.id, newRefreshToken);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  // Logs out user by removing the stored refresh token from their DB record
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
