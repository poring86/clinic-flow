import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DoctorDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  clinicId!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  avatarImageUrl?: string;

  @ApiProperty({ minimum: 0, maximum: 6 })
  availableFromWeekDay!: number;

  @ApiProperty({ minimum: 0, maximum: 6 })
  availableToWeekDay!: number;

  @ApiProperty({ example: '08:00:00' })
  availableFromTime!: string;

  @ApiProperty({ example: '17:00:00' })
  availableToTime!: string;

  @ApiProperty()
  specialty!: string;

  @ApiProperty({ example: 10000 })
  appointmentPriceInCents!: number;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
