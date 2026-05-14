import { ApiProperty } from '@nestjs/swagger';
import { DoctorDto } from './doctor.dto';

export class PaginatedDoctorDto {
  @ApiProperty({ type: [DoctorDto] })
  data!: DoctorDto[];

  @ApiProperty({ example: 50 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  pageSize!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
