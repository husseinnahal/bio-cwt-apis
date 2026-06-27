import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all wood services and their pricing matrix tables' })
  @ApiResponse({ status: 200, description: 'Returns a list of all wood services with pricing parameters.' })
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific wood service catalog details by ID' })
  @ApiParam({ name: 'id', description: 'The UUID of the service category' })
  @ApiResponse({ status: 200, description: 'Returns details of the wood service.' })
  @ApiResponse({ status: 404, description: 'Service category not found' })
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new wood service pricing category (Admin only)' })
  @ApiResponse({ status: 201, description: 'The service has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request validations failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an existing wood service pricing category (Admin only)' })
  @ApiParam({ name: 'id', description: 'The UUID of the service category to update' })
  @ApiResponse({ status: 200, description: 'The service has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request validations failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service category not found' })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a wood service pricing category by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'The UUID of the service category to delete' })
  @ApiResponse({ status: 200, description: 'The service has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service category not found' })
  async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}

