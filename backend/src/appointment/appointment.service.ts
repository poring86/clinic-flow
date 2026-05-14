import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { appointmentsTable } from '../db/schema';
import { AppointmentDto } from './dto/appointment.dto';
import { PaginatedAppointmentDto } from './dto/paginated-appointment.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  async findAll(
    clinicId?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedAppointmentDto> {
    const offset = (page - 1) * pageSize;

    // Get total count
    const countResult = clinicId
      ? await db
          .select({ count: db.sql<number>`count(*)::integer` })
          .from(appointmentsTable)
          .where(eq(appointmentsTable.clinicId, clinicId))
      : await db
          .select({ count: db.sql<number>`count(*)::integer` })
          .from(appointmentsTable);

    const total = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated data
    let query = db
      .select()
      .from(appointmentsTable)
      .orderBy((t) => t.updatedAt)
      .limit(pageSize)
      .offset(offset);

    if (clinicId) {
      query = query.where(eq(appointmentsTable.clinicId, clinicId));
    }

    const rows = await query.execute();

    const data = rows.map((row) => ({
      id: row.id,
      clinicId: row.clinicId,
      patientId: row.patientId,
      doctorId: row.doctorId,
      date: row.date.toISOString(),
      appointmentPriceInCents: row.appointmentPriceInCents,
      createdAt: row.createdAt.toISOString(),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
    }));

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
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
