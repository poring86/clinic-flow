import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorDto } from './dto/doctor.dto';
import { PaginatedDoctorDto } from './dto/paginated-doctor.dto';
import { DoctorService } from './doctor.service';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  @ApiOperation({ summary: 'List doctors with pagination' })
  @ApiResponse({ status: 200, type: PaginatedDoctorDto })
  async findAll(
    @Query('clinicId') clinicId?: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ): Promise<PaginatedDoctorDto> {
    return this.doctorService.findAll(
      clinicId,
      parseInt(page, 10),
      parseInt(pageSize, 10),
    );
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
  async update(
    @Param('id') id: string,
    @Body() body: CreateDoctorDto,
  ): Promise<DoctorDto | null> {
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
