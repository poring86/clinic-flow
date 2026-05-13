import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { AppointmentService } from './appointment.service';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @ApiOperation({ summary: 'List all appointments' })
  @ApiResponse({ status: 200, type: [AppointmentDto] })
  async findAll(
    @Query('clinicId') clinicId?: string,
  ): Promise<AppointmentDto[]> {
    return this.appointmentService.findAll(clinicId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an appointment' })
  @ApiResponse({ status: 201, type: AppointmentDto })
  async create(@Body() body: CreateAppointmentDto): Promise<AppointmentDto> {
    return this.appointmentService.create(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  async delete(@Param('id') id: string) {
    const deleted = await this.appointmentService.delete(id);
    if (!deleted) {
      throw new NotFoundException('Appointment not found');
    }

    return { success: true };
  }
}
