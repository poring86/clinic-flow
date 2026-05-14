import { Injectable } from '@nestjs/common';
import { eq, count } from 'drizzle-orm';

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
    let countQuery = db.select({ count: count() }).from(appointmentsTable);
    if (clinicId) {
      countQuery = countQuery.where(eq(appointmentsTable.clinicId, clinicId)) as any;
    }
    const countResult = await countQuery;
    const total = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated data
    let query: any = db.select().from(appointmentsTable);
    if (clinicId) {
      query = query.where(eq(appointmentsTable.clinicId, clinicId));
    }
    const rows = await query
      .orderBy(appointmentsTable.updatedAt)
      .limit(pageSize)
      .offset(offset);

    const data = rows.map((row: any) => ({
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
