import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // Fetch all service categories and price matrix grids
  async findAll() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  // Fetch a single service category by ID
  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    return service;
  }

  // Create a new service category
  async create(dto: CreateServiceDto) {
    try {
      return await this.prisma.service.create({
        data: {
          name: dto.name,
          prices: dto.prices as any,
        },
      });
    } catch (error: any) {
      // Prisma code for unique constraint violation
      if (error.code === 'P2002') {
        throw new ConflictException(`Service with name "${dto.name}" already exists`);
      }
      throw error;
    }
  }

  // Update an existing service category
  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id); // Throws NotFoundException if missing

    try {
      return await this.prisma.service.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.prices !== undefined && { prices: dto.prices as any }),
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Service with name "${dto.name}" already exists`);
      }
      throw error;
    }
  }

  // Delete a service category by ID
  async remove(id: string) {
    await this.findOne(id); // Throws NotFoundException if missing

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
