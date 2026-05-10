import { IsNotEmpty, IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  clinicId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  doctorId!: string;

  @ApiProperty({ format: 'date-time' })
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: 10000 })
  @IsInt()
  appointmentPriceInCents!: number;
}
