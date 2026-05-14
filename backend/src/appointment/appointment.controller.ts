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
import { PaginatedAppointmentDto } from './dto/paginated-appointment.dto';
import { AppointmentService } from './appointment.service';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @ApiOperation({ summary: 'List appointments with pagination' })
  @ApiResponse({ status: 200, type: PaginatedAppointmentDto })
  async findAll(
    @Query('clinicId') clinicId?: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ): Promise<PaginatedAppointmentDto> {
    return this.appointmentService.findAll(
      clinicId,
      parseInt(page, 10),
      parseInt(pageSize, 10),
    );
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
