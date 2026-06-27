import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, IsNumber, Min, MinLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PriceRowDto {
  @ApiProperty({
    description: 'Length of the wood piece in mm',
    example: 4000,
  })
  @IsInt({ message: 'Length must be an integer' })
  @Min(1, { message: 'Length must be at least 1 mm' })
  length: number;

  @ApiProperty({
    description: 'Width of the wood piece in mm',
    example: 100,
  })
  @IsInt({ message: 'Width must be an integer' })
  @Min(1, { message: 'Width must be at least 1 mm' })
  width: number;

  @ApiProperty({
    description: 'Thickness of the wood piece in mm',
    example: 25,
  })
  @IsInt({ message: 'Thickness must be an integer' })
  @Min(1, { message: 'Thickness must be at least 1 mm' })
  thickness: number;

  @ApiProperty({
    description: 'Volume in cubic meters calculated or specified for this piece size',
    example: 0.01,
    format: 'float',
  })
  @IsNumber({}, { message: 'Cubic meter must be a number' })
  @Min(0.000001, { message: 'Cubic meter must be greater than 0' })
  cubicMeter: number;

  @ApiProperty({
    description: 'Price per cubic meter in local currency (CZK/USD)',
    example: 18000.0,
    format: 'float',
  })
  @IsNumber({}, { message: 'Price per m3 must be a number' })
  @Min(0, { message: 'Price per m3 cannot be negative' })
  pricePerM3: number;

  @ApiProperty({
    description: 'Calculated or overridden price per individual piece',
    example: 180.0,
    format: 'float',
  })
  @IsNumber({}, { message: 'Price per piece must be a number' })
  @Min(0, { message: 'Price per piece cannot be negative' })
  pricePerPiece: number;
}

export class CreateServiceDto {
  @ApiProperty({
    description: 'Name of the service / wood category',
    example: 'Buk pr',
  })
  @IsString()
  @IsNotEmpty({ message: 'Service name is required' })
  @MinLength(2, { message: 'name must be at least 2 characters long' })
  name: string;

  @ApiProperty({
    description: 'The pricing matrix dimensions table for this service category',
    type: [PriceRowDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceRowDto)
  prices: PriceRowDto[];
}

export class UpdateServiceDto {
  @ApiPropertyOptional({
    description: 'Name of the service / wood category (optional)',
    example: 'Buk pr',
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'name must be at least 2 characters long' })
  name?: string;

  @ApiPropertyOptional({
    description: 'The pricing matrix dimensions table for this service category (optional)',
    type: [PriceRowDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PriceRowDto)
  prices?: PriceRowDto[];
}

