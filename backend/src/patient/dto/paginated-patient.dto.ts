import { ApiProperty } from '@nestjs/swagger';
import { PatientDto } from './patient.dto';

export class PaginatedPatientDto {
  @ApiProperty({ type: [PatientDto] })
  data!: PatientDto[];

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  pageSize!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;
}
