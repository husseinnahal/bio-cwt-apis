import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CmsService } from './cms.service';
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiBody,
  ApiConsumes,
  getSchemaPath,
} from '@nestjs/swagger';
import { HeroCmsDto, AboutCmsDto, AdvantagesCmsDto, OurWorkCmsDto } from './dto/update-cms.dto';

@ApiTags('CMS')
@ApiExtraModels(HeroCmsDto, AboutCmsDto, AdvantagesCmsDto, OurWorkCmsDto)
@Controller('cms')
export class CmsController {
  constructor(
    private readonly cmsService: CmsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Fetch all CMS content configuration details (Public)
  @Get()
  @ApiOperation({ summary: 'Get all dynamic CMS content settings for all sections' })
  @ApiResponse({ status: 200, description: 'Returns a mapped object containing keys like hero, about, advantages, ourWork.' })
  async getAll() {
    return this.cmsService.getAllContent();
  }

  // Update configuration for a specific section key (Admin Only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':key')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update CMS configurations for a specific section key',
    description: 'Allowed keys: hero, about, advantages, ourWork. Body must match the schema corresponding to the selected key.',
  })
  @ApiBody({
    schema: {
      anyOf: [
        { $ref: getSchemaPath(HeroCmsDto) },
        { $ref: getSchemaPath(AboutCmsDto) },
        { $ref: getSchemaPath(AdvantagesCmsDto) },
        { $ref: getSchemaPath(OurWorkCmsDto) },
      ],
    },
  })
  @ApiResponse({ status: 200, description: 'CMS content updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation fails or invalid section key' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('key') key: string, @Body() body: any) {
    return this.cmsService.updateContent(key, body);
  }

  // Upload an image directly to Cloudinary and return its secure URL (Admin Only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload to Cloudinary',
        },
      },
      required: ['image'],
    },
  })
  @ApiOperation({ summary: 'Upload an image file directly to Cloudinary cloud storage' })
  @ApiResponse({ status: 201, description: 'Successfully uploaded image file. Returns URL link.' })
  @ApiResponse({ status: 400, description: 'Upload failed or no file provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }
    try {
      const result = await this.cloudinaryService.uploadFile(file);
      return { url: result.secure_url };
    } catch (e) {
      throw new BadRequestException(`Image upload failed: ${e.message || e}`);
    }
  }
}

