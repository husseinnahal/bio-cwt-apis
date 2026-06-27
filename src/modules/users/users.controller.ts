// endpoints related to user profiles.

import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/me - Returns profile info of the currently logged-in user.
  // Secured with JwtAuthGuard (validates JWT access token).
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get profile information of the currently logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'Returns profile details of the authenticated user (excluding password and session hashes).',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'd3b07384-d113-49cd-a5d6-843c940259b1' },
        email: { type: 'string', example: 'admin@wood.com' },
        role: { type: 'string', enum: ['ADMIN', 'USER'], example: 'ADMIN' },
        createdAt: { type: 'string', format: 'date-time', example: '2026-06-25T12:00:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2026-06-25T12:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) return null;

    const { password, hashedRefreshToken, ...result } = user;
    return result;
  }
}

