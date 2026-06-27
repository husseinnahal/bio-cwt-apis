import { IsString, IsNotEmpty, MinLength, IsArray, ArrayMinSize, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HeroCmsDto {
  @ApiProperty({
    description: 'The title of the Hero section',
    example: 'Dřevěné Výrobky a Řezivo',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @ApiProperty({
    description: 'The subtitle of the Hero section',
    example: 'Kvalitní zpracování dřeva přímo z pily',
  })
  @IsString()
  @IsNotEmpty({ message: 'Subtitle cannot be empty' })
  subtitle: string;

  @ApiProperty({
    description: 'List of exactly 3 background image URLs for the Hero carousel',
    type: [String],
    example: [
      'https://res.cloudinary.com/demo/image/upload/v1/hero1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v2/hero2.jpg',
      'https://res.cloudinary.com/demo/image/upload/v3/hero3.jpg',
    ],
  })
  @IsArray()
  @ArrayMinSize(3, { message: 'Hero must have exactly 3 images' })
  @ArrayMaxSize(3, { message: 'Hero must have exactly 3 images' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'All Hero images are required' })
  images: string[];
}

export class AboutCmsDto {
  @ApiProperty({
    description: 'The description story about the company',
    example: 'Naše pila se zaměřuje na zpracování a prodej kvalitního stavebního a truhlářského řeziva...',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;

  @ApiProperty({
    description: 'List of exactly 3 showcase image URLs for the About Us section',
    type: [String],
    example: [
      'https://res.cloudinary.com/demo/image/upload/v1/about1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v2/about2.jpg',
      'https://res.cloudinary.com/demo/image/upload/v3/about3.jpg',
    ],
  })
  @IsArray()
  @ArrayMinSize(3, { message: 'About Us must have exactly 3 images' })
  @ArrayMaxSize(3, { message: 'About Us must have exactly 3 images' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'All About Us images are required' })
  images: string[];
}

export class AdvantagesCmsDto {
  @ApiProperty({
    description: 'Title of the advantages section',
    example: 'Naše Výhody',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @ApiProperty({
    description: 'List of advantage bullets',
    type: [String],
    example: [
      'Moderní pilařské technologie',
      'Rychlé dodací lhůty',
      'Ekologicky certifikované řezivo',
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one advantage bullet is required' })
  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'Advantage bullets cannot be empty' })
  advantages: string[];

  @ApiProperty({
    description: 'URL of the main image for the advantages section',
    example: 'https://res.cloudinary.com/demo/image/upload/v1/advantages.jpg',
  })
  @IsString()
  @IsNotEmpty({ message: 'Image cannot be empty' })
  image: string;
}

export class OurWorkItemDto {
  @ApiProperty({
    description: 'Image URL for a gallery item of completed work',
    example: 'https://res.cloudinary.com/demo/image/upload/v1/work1.jpg',
  })
  @IsString()
  @IsNotEmpty({ message: 'Image cannot be empty' })
  src: string;
}

export class OurWorkCmsDto {
  @ApiProperty({
    description: 'Array of completed work items containing image URLs',
    type: [OurWorkItemDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one work item is required' })
  @ValidateNested({ each: true })
  @Type(() => OurWorkItemDto)
  images: OurWorkItemDto[];
}

