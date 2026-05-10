import { ApiProperty } from '@nestjs/swagger';

export class AppointmentDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  clinicId!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty({ format: 'uuid' })
  doctorId!: string;

  @ApiProperty({ format: 'date-time' })
  date!: string;

  @ApiProperty({ example: 10000 })
  appointmentPriceInCents!: number;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;
}
