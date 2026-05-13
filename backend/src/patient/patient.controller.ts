import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientService } from './patient.service';

@ApiTags('patient')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @ApiOperation({ summary: 'List all patients' })
  @ApiResponse({ status: 200, type: [PatientDto] })
  async findAll(@Query('clinicId') clinicId?: string): Promise<PatientDto[]> {
    return this.patientService.findAll(clinicId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a patient' })
  @ApiResponse({ status: 201, type: PatientDto })
  async create(@Body() dto: CreatePatientDto): Promise<PatientDto> {
    return this.patientService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({ status: 200, type: PatientDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<PatientDto | null> {
    return this.patientService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient' })
  async delete(@Param('id') id: string) {
    const deleted = await this.patientService.delete(id);
    if (!deleted) {
      throw new NotFoundException('Patient not found');
    }
    return { success: true };
  }
}
