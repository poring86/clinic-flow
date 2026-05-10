import { Injectable } from '@nestjs/common';
import { and, count, eq, gte, lte, sql, sum } from 'drizzle-orm';
import { db } from '../db';
import { appointmentsTable, doctorsTable, patientsTable } from '../db/schema';

@Injectable()
export class DashboardService {
  private getDateRange(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    return { fromDate, toDate };
  }

  private getTodayRange() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return { today, todayEnd };
  }

  async getSummary(clinicId: string, from: string, to: string) {
    const { fromDate, toDate } = this.getDateRange(from, to);

    const appointmentRangeFilter = and(
      eq(appointmentsTable.clinicId, clinicId),
      gte(appointmentsTable.date, fromDate),
      lte(appointmentsTable.date, toDate),
    );

    const [[revenueResult], [appointmentsResult], [patientsResult], [doctorsResult]] =
      await Promise.all([
        db
          .select({ total: sum(appointmentsTable.appointmentPriceInCents) })
          .from(appointmentsTable)
          .where(appointmentRangeFilter),
        db
          .select({ total: count() })
          .from(appointmentsTable)
          .where(appointmentRangeFilter),
        db
          .select({ total: count() })
          .from(patientsTable)
          .where(eq(patientsTable.clinicId, clinicId)),
        db
          .select({ total: count() })
          .from(doctorsTable)
          .where(eq(doctorsTable.clinicId, clinicId)),
      ]);

    return {
      totalRevenue: { total: Number(revenueResult.total ?? 0) },
      totalAppointments: { total: appointmentsResult.total },
      totalPatients: { total: patientsResult.total },
      totalDoctors: { total: doctorsResult.total },
    };
  }

  async getTopDoctors(clinicId: string, from: string, to: string) {
    const { fromDate, toDate } = this.getDateRange(from, to);

    return db
      .select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        avatarImageUrl: doctorsTable.avatarImageUrl,
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(appointmentsTable.doctorId, doctorsTable.id),
          gte(appointmentsTable.date, fromDate),
          lte(appointmentsTable.date, toDate),
        ),
      )
      .where(eq(doctorsTable.clinicId, clinicId))
      .groupBy(
        doctorsTable.id,
        doctorsTable.name,
        doctorsTable.avatarImageUrl,
        doctorsTable.specialty,
      )
      .orderBy(sql`count(${appointmentsTable.id}) desc`)
      .limit(5);
  }

  async getTopSpecialties(clinicId: string, from: string, to: string) {
    const { fromDate, toDate } = this.getDateRange(from, to);

    return db
      .select({
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(appointmentsTable.doctorId, doctorsTable.id),
          gte(appointmentsTable.date, fromDate),
          lte(appointmentsTable.date, toDate),
        ),
      )
      .where(eq(doctorsTable.clinicId, clinicId))
      .groupBy(doctorsTable.specialty)
      .orderBy(sql`count(${appointmentsTable.id}) desc`)
      .limit(5);
  }

  async getTodayAppointments(clinicId: string) {
    const { today, todayEnd } = this.getTodayRange();

    return db
      .select({
        id: appointmentsTable.id,
        date: appointmentsTable.date,
        appointmentPriceInCents: appointmentsTable.appointmentPriceInCents,
        patientId: appointmentsTable.patientId,
        doctorId: appointmentsTable.doctorId,
        clinicId: appointmentsTable.clinicId,
        createdAt: appointmentsTable.createdAt,
        updatedAt: appointmentsTable.updatedAt,
        patient: {
          name: patientsTable.name,
        },
        doctor: {
          name: doctorsTable.name,
          specialty: doctorsTable.specialty,
        },
      })
      .from(appointmentsTable)
      .innerJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, clinicId),
          gte(appointmentsTable.date, today),
          lte(appointmentsTable.date, todayEnd),
        ),
      )
      .orderBy(appointmentsTable.date);
  }

  async getDailyAppointmentsData(clinicId: string, from: string, to: string) {
    const { fromDate, toDate } = this.getDateRange(from, to);

    return db
      .select({
        date: sql<string>`DATE(${appointmentsTable.date})`,
        appointments: count(),
        revenue: sum(appointmentsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, clinicId),
          gte(appointmentsTable.date, fromDate),
          lte(appointmentsTable.date, toDate),
        ),
      )
      .groupBy(sql`DATE(${appointmentsTable.date})`)
      .orderBy(sql`DATE(${appointmentsTable.date})`);
  }

}
