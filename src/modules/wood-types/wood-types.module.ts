import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma.module';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { WoodTypesController } from './wood-types.controller';
import { WoodTypesService } from './wood-types.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [WoodTypesController],
  providers: [WoodTypesService],
  exports: [WoodTypesService],
})
export class WoodTypesModule {}
