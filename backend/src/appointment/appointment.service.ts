import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { appointmentsTable } from '../db/schema';
import { AppointmentDto } from './dto/appointment.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  async findAll(clinicId?: string): Promise<AppointmentDto[]> {
    const rows = clinicId
      ? await db
          .select()
          .from(appointmentsTable)
          .where(eq(appointmentsTable.clinicId, clinicId))
      : await db.select().from(appointmentsTable);

    return rows.map((row) => ({
      id: row.id,
      clinicId: row.clinicId,
      patientId: row.patientId,
      doctorId: row.doctorId,
      date: row.date.toISOString(),
      appointmentPriceInCents: row.appointmentPriceInCents,
      createdAt: row.createdAt.toISOString(),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
    }));
  }

  async create(data: CreateAppointmentDto): Promise<AppointmentDto> {
    const [row] = await db
      .insert(appointmentsTable)
      .values({
        clinicId: data.clinicId,
        patientId: data.patientId,
        doctorId: data.doctorId,
        date: new Date(data.date),
        appointmentPriceInCents: data.appointmentPriceInCents,
      })
      .returning();

    return {
      id: row.id,
      clinicId: row.clinicId,
      patientId: row.patientId,
      doctorId: row.doctorId,
      date: row.date.toISOString(),
      appointmentPriceInCents: row.appointmentPriceInCents,
      createdAt: row.createdAt.toISOString(),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.id, id));

    return (result.rowCount ?? 0) > 0;
  }
}
