import { ApiProperty } from '@nestjs/swagger';
import { AppointmentDto } from './appointment.dto';

export class PaginatedAppointmentDto {
  @ApiProperty({ type: [AppointmentDto] })
  data!: AppointmentDto[];

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  pageSize!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;
}
