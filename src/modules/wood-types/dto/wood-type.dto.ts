import { IsString, IsNotEmpty, IsArray, ValidateNested, IsBoolean, MinLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeatureDto {
  @ApiProperty({
    description: 'The feature label text description',
    example: 'Vysoká odolnost vůči vlhkosti',
  })
  @IsString()
  @IsNotEmpty({ message: 'Feature label cannot be empty' })
  label: string;

  @ApiProperty({
    description: 'Whether it is a positive features bullet (true) or negative/limitation (false)',
    example: true,
  })
  @IsBoolean()
  positive: boolean;
}

export class CreateWoodTypeDto {
  @ApiProperty({
    description: 'Name of the wood species',
    example: 'Buk (Fagus)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Wood type name is required' })
  @MinLength(2, { message: 'Wood type name must be at least 2 characters long' })
  name: string;

  @ApiProperty({
    description: 'URL of the wood species showcase image',
    example: 'https://res.cloudinary.com/demo/image/upload/v1/fagus.jpg',
  })
  @IsString()
  @IsNotEmpty({ message: 'Wood type image URL is required' })
  image: string;

  @ApiProperty({
    description: 'List of features/attributes specifying properties of the wood species',
    type: [FeatureDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features: FeatureDto[];
}

export class UpdateWoodTypeDto {
  @ApiPropertyOptional({
    description: 'Name of the wood species (optional)',
    example: 'Buk lesní',
  })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Wood type name must be at least 2 characters long' })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL of the wood species showcase image (optional)',
    example: 'https://res.cloudinary.com/demo/image/upload/v2/fagus-new.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'List of features/attributes specifying properties of the wood species (optional)',
    type: [FeatureDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features?: FeatureDto[];
}

