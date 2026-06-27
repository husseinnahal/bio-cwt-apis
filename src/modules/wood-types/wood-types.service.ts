import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { CreateWoodTypeDto, UpdateWoodTypeDto } from './dto/wood-type.dto';

@Injectable()
export class WoodTypesService {
  constructor(private prisma: PrismaService) {}

  // Fetch all custom wood types
  async findAll() {
    return this.prisma.woodType.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  // Fetch a single wood type by ID
  async findOne(id: string) {
    const woodType = await this.prisma.woodType.findUnique({
      where: { id },
    });
    if (!woodType) {
      throw new NotFoundException(`Wood type with ID "${id}" not found`);
    }
    return woodType;
  }

  // Create a new wood type
  async create(dto: CreateWoodTypeDto) {
    try {
      return await this.prisma.woodType.create({
        data: {
          name: dto.name,
          image: dto.image,
          features: dto.features as any,
        },
      });
    } catch (error: any) {
      // Prisma unique constraint violation code
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Wood type with name "${dto.name}" already exists`,
        );
      }
      throw error;
    }
  }

  // Update an existing wood type
  async update(id: string, dto: UpdateWoodTypeDto) {
    await this.findOne(id); // Throws NotFoundException if missing

    try {
      return await this.prisma.woodType.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.image !== undefined && { image: dto.image }),
          ...(dto.features !== undefined && { features: dto.features as any }),
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Wood type with name "${dto.name}" already exists`
        );
      }
      throw error;
    }
  }

  // Delete a wood type by ID
  async remove(id: string) {
    await this.findOne(id); // Throws NotFoundException if missing

    return this.prisma.woodType.delete({
      where: { id },
    });
  }
}
