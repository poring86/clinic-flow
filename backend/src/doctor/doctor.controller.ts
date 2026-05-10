import { Controller, Get, Post, Put, Delete, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorDto } from './dto/doctor.dto';
import { DoctorService } from './doctor.service';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  @ApiOperation({ summary: 'List all doctors' })
  @ApiResponse({ status: 200, type: [DoctorDto] })
  async findAll(@Query('clinicId') clinicId?: string): Promise<DoctorDto[]> {
    return this.doctorService.findAll(clinicId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a doctor' })
  @ApiResponse({ status: 201, type: DoctorDto })
  async create(@Body() body: CreateDoctorDto): Promise<DoctorDto> {
    return this.doctorService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({ status: 200, type: DoctorDto })
  async update(@Param('id') id: string, @Body() body: CreateDoctorDto): Promise<DoctorDto | null> {
    return this.doctorService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a doctor' })
  async delete(@Param('id') id: string) {
    const deleted = await this.doctorService.delete(id);
    if (!deleted) {
      throw new NotFoundException('Doctor not found');
    }
    return { success: true };
  }
}
