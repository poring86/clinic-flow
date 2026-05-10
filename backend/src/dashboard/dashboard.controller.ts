import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  private validateClinicId(clinicId: string) {
    if (!clinicId) {
      throw new BadRequestException('clinicId is required');
    }
  }

  private validateRange(clinicId: string, from: string, to: string) {
    if (!clinicId || !from || !to) {
      throw new BadRequestException('clinicId, from and to are required');
    }
  }

  @Get('summary')
  async getSummary(
    @Query('clinicId') clinicId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    this.validateRange(clinicId, from, to);
    return this.dashboardService.getSummary(clinicId, from, to);
  }

  @Get('top-doctors')
  async getTopDoctors(
    @Query('clinicId') clinicId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    this.validateRange(clinicId, from, to);
    return this.dashboardService.getTopDoctors(clinicId, from, to);
  }

  @Get('top-specialties')
  async getTopSpecialties(
    @Query('clinicId') clinicId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    this.validateRange(clinicId, from, to);
    return this.dashboardService.getTopSpecialties(clinicId, from, to);
  }

  @Get('today-appointments')
  async getTodayAppointments(@Query('clinicId') clinicId: string) {
    this.validateClinicId(clinicId);
    return this.dashboardService.getTodayAppointments(clinicId);
  }

  @Get('daily-appointments')
  async getDailyAppointmentsData(
    @Query('clinicId') clinicId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    this.validateRange(clinicId, from, to);
    return this.dashboardService.getDailyAppointmentsData(clinicId, from, to);
  }
}
