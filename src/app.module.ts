import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@database/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { CmsModule } from '@modules/cms/cms.module';
import { WoodTypesModule } from '@modules/wood-types/wood-types.module';
import { ServicesModule } from '@modules/services/services.module';
import envConfig from '@config/env.config';
import databaseConfig from '@config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig, databaseConfig],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('app.rateLimitWindowMs') ?? 900000,
            limit: config.get<number>('app.rateLimitMaxRequests') ?? 2000,
          },
        ],
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CmsModule,
    WoodTypesModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
