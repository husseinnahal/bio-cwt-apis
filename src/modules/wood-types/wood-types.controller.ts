import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { WoodTypesService } from './wood-types.service';
import { CloudinaryService } from '@modules/cloudinary/cloudinary.service';
import { CreateWoodTypeDto, UpdateWoodTypeDto } from './dto/wood-type.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Wood Types')
@Controller('wood-types')
export class WoodTypesController {
  constructor(
    private readonly woodTypesService: WoodTypesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Fetch all custom wood species (Public)
  @Get()
  @ApiOperation({ summary: 'Get all custom wood species' })
  @ApiResponse({ status: 200, description: 'Returns a list of all custom wood species and their attributes' })
  async findAll() {
    return this.woodTypesService.findAll();
  }

  // Fetch a single wood species by ID (Public)
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific wood species by ID' })
  @ApiParam({ name: 'id', description: 'The UUID of the wood species' })
  @ApiResponse({ status: 200, description: 'Returns details of the wood species' })
  @ApiResponse({ status: 404, description: 'Wood species not found' })
  async findOne(@Param('id') id: string) {
    return this.woodTypesService.findOne(id);
  }

  // Create a new wood species (Admin Only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the wood species', example: 'Buk pr' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
        features: {
          type: 'string',
          description: 'JSON serialized array of FeatureDto',
          example: '[{"label":"Durable","positive":true}]',
        },
      },
      required: ['name', 'image', 'features'],
    },
  })
  @ApiOperation({ summary: 'Create a new wood species product (Admin only)' })
  @ApiResponse({ status: 201, description: 'The wood species has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request validations failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @UploadedFile() file: any,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Parse features manually from serialized JSON string sent via FormData
    let features = [];
    if (body.features) {
      try {
        features = typeof body.features === 'string' ? JSON.parse(body.features) : body.features;
      } catch (e) {
        throw new BadRequestException('Invalid features format');
      }
    }

    // Construct and validate DTO programmatically
    const createDto = plainToInstance(CreateWoodTypeDto, {
      name: body.name,
      image: 'temp-url', // Dummy URL to satisfy validation before Cloudinary upload
      features,
    });

    const errors = await validate(createDto);
    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints || {}).join(', '));
      throw new BadRequestException(messages.join('; '));
    }

    try {
      // Stream file buffer to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'wood_assets');
      
      // Save product with Cloudinary secure URL
      return await this.woodTypesService.create({
        name: body.name,
        image: uploadResult.secure_url,
        features,
      });
    } catch (e) {
      throw new BadRequestException(`Saving wood product failed: ${e.message || e}`);
    }
  }

  // Update an existing wood species (Admin Only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the wood species (optional)', example: 'Buk pr' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'New image file to upload (optional). If not uploading a new file, pass the existing image URL as a string in the body.',
        },
        features: {
          type: 'string',
          description: 'JSON serialized array of FeatureDto (optional)',
          example: '[{"label":"Durable","positive":true}]',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update an existing wood species product (Admin only)' })
  @ApiParam({ name: 'id', description: 'The UUID of the wood species to update' })
  @ApiResponse({ status: 200, description: 'The wood species has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request validations failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wood species not found' })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() body: any,
  ) {
    // Parse features if provided
    let features: any = undefined;
    if (body.features !== undefined) {
      try {
        features = typeof body.features === 'string' ? JSON.parse(body.features) : body.features;
      } catch (e) {
        throw new BadRequestException('Invalid features format');
      }
    }

    // Construct validation payload
    const updatePayload: any = {
      ...(body.name !== undefined && { name: body.name }),
      ...(features !== undefined && { features }),
      // If a file is uploaded, set validation image to a placeholder, otherwise use body.image string
      image: file ? 'temp-url' : body.image,
    };

    const updateDto = plainToInstance(UpdateWoodTypeDto, updatePayload);
    const errors = await validate(updateDto);
    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints || {}).join(', '));
      throw new BadRequestException(messages.join('; '));
    }

    try {
      let finalImageUrl = body.image;
      
      // If a new file is uploaded, upload to Cloudinary and replace image URL
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'wood_assets');
        finalImageUrl = uploadResult.secure_url;
      }

      return await this.woodTypesService.update(id, {
        ...(body.name !== undefined && { name: body.name }),
        ...(finalImageUrl !== undefined && { image: finalImageUrl }),
        ...(features !== undefined && { features }),
      });
    } catch (e) {
      throw new BadRequestException(`Updating wood product failed: ${e.message || e}`);
    }
  }

  // Delete a wood species by ID (Admin Only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a wood species product by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'The UUID of the wood species to delete' })
  @ApiResponse({ status: 200, description: 'The wood species has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wood species not found' })
  async remove(@Param('id') id: string) {
    return this.woodTypesService.remove(id);
  }
}

