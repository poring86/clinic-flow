import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { ClinicModule } from './clinic/clinic.module';
import { StripeModule } from './stripe/stripe.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AppointmentModule,
    DashboardModule,
    DoctorModule,
    PatientModule,
    ClinicModule,
    StripeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
