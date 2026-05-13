import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  clinicId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarImageUrl?: string;

  @ApiProperty({ minimum: 0, maximum: 6 })
  @IsInt()
  availableFromWeekDay!: number;

  @ApiProperty({ minimum: 0, maximum: 6 })
  @IsInt()
  availableToWeekDay!: number;

  @ApiProperty({ example: '08:00:00' })
  @IsNotEmpty()
  availableFromTime!: string;

  @ApiProperty({ example: '17:00:00' })
  @IsNotEmpty()
  availableToTime!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  specialty!: string;

  @ApiProperty({ example: 10000 })
  @IsInt()
  appointmentPriceInCents!: number;
}
