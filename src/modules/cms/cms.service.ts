import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  HeroCmsDto,
  AboutCmsDto,
  AdvantagesCmsDto,
  OurWorkCmsDto,
} from './dto/update-cms.dto';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // Fetch all CMS content configurations and return them as a single dictionary
  async getAllContent() {
    try {
      const entries = await this.prisma.cmsContent.findMany();
      const cmsMap: Record<string, any> = {};
      for (const entry of entries) {
        cmsMap[entry.key] = entry.value;
      }
      return cmsMap;
    } catch (error) {
      console.error('Database error in CmsService.getAllContent:', error);
      throw error;
    }
  }

  // Retrieve configuration for a specific section key
  async getContentByKey(key: string) {
    const entry = await this.prisma.cmsContent.findUnique({
      where: { key },
    });
    return entry ? entry.value : null;
  }

  // Save (upsert) the dynamic JSON content for a section key
  async updateContent(key: string, value: any) {
    await this.validateContent(key, value);

    const entry = await this.prisma.cmsContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return entry.value;
  }

  // Validate properties for each CMS configuration layout using standard DTOs
  private async validateContent(key: string, value: any) {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Content body must be an object');
    }

    let dtoClass: any;
    if (key === 'hero') {
      dtoClass = HeroCmsDto;
    } else if (key === 'about') {
      dtoClass = AboutCmsDto;
    } else if (key === 'advantages') {
      dtoClass = AdvantagesCmsDto;
    } else if (key === 'ourWork') {
      dtoClass = OurWorkCmsDto;
    } else {
      throw new BadRequestException(`Unknown CMS section key: ${key}`);
    }

    const object = plainToInstance(dtoClass, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((err) => {
        if (err.constraints) {
          return Object.values(err.constraints).join(', ');
        }
        if (err.children && err.children.length > 0) {
          return err.children
            .map((child) => {
              if (child.constraints) {
                return Object.values(child.constraints).join(', ');
              }
              return `Validation error at nested property ${child.property}`;
            })
            .join(', ');
        }
        return `Validation error at ${err.property}`;
      });
      throw new BadRequestException(messages.join('; '));
    }
  }
}
