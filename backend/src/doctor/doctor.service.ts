import { Injectable } from '@nestjs/common';
import { eq, count } from 'drizzle-orm';

import { db } from '../db';
import { doctorsTable } from '../db/schema';
import { DoctorDto } from './dto/doctor.dto';
import { PaginatedDoctorDto } from './dto/paginated-doctor.dto';

@Injectable()
export class DoctorService {
  async findAll(
    clinicId?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedDoctorDto> {
    const offset = (page - 1) * pageSize;

    // Get total count
    let countQuery: any = db.select({ count: count() }).from(doctorsTable);
    if (clinicId) {
      countQuery = countQuery.where(eq(doctorsTable.clinicId, clinicId));
    }
    const countResult = await countQuery;
    const total = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated data
    let query: any = db.select().from(doctorsTable);
    if (clinicId) {
      query = query.where(eq(doctorsTable.clinicId, clinicId));
    }
    const rows = await query
      .orderBy(doctorsTable.updatedAt)
      .limit(pageSize)
      .offset(offset);

    const data = rows.map((row: any) => ({
      id: row.id,
      clinicId: row.clinicId,
      name: row.name,
      avatarImageUrl: row.avatarImageUrl ?? undefined,
      availableFromWeekDay: row.availableFromWeekDay,
      availableToWeekDay: row.availableToWeekDay,
      availableFromTime: row.availableFromTime,
      availableToTime: row.availableToTime,
      specialty: row.specialty,
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
    };  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(doctorsTable).where(eq(doctorsTable.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async update(
    id: string,
    data: Partial<Omit<DoctorDto, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<DoctorDto | null> {
    const [row] = await db
      .update(doctorsTable)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.avatarImageUrl !== undefined && {
          avatarImageUrl: data.avatarImageUrl,
        }),
        ...(data.availableFromWeekDay !== undefined && {
          availableFromWeekDay: data.availableFromWeekDay,
        }),
        ...(data.availableToWeekDay !== undefined && {
          availableToWeekDay: data.availableToWeekDay,
        }),
        ...(data.availableFromTime && {
          availableFromTime: data.availableFromTime,
        }),
        ...(data.availableToTime && { availableToTime: data.availableToTime }),
        ...(data.specialty && { specialty: data.specialty }),
        ...(data.appointmentPriceInCents !== undefined && {
          appointmentPriceInCents: data.appointmentPriceInCents,
        }),
      })
      .where(eq(doctorsTable.id, id))
      .returning();

    if (!row) return null;

    return {
      id: row.id,
      clinicId: row.clinicId,
      name: row.name,
      avatarImageUrl: row.avatarImageUrl ?? undefined,
      availableFromWeekDay: row.availableFromWeekDay,
      availableToWeekDay: row.availableToWeekDay,
      availableFromTime: row.availableFromTime,
      availableToTime: row.availableToTime,
      specialty: row.specialty,
      appointmentPriceInCents: row.appointmentPriceInCents,
      createdAt: row.createdAt.toISOString(),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
    };
  }

  async create(
    data: Omit<DoctorDto, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<DoctorDto> {
    const [row] = await db
      .insert(doctorsTable)
      .values({
        clinicId: data.clinicId,
        name: data.name,
        avatarImageUrl: data.avatarImageUrl,
        availableFromWeekDay: data.availableFromWeekDay,
        availableToWeekDay: data.availableToWeekDay,
        availableFromTime: data.availableFromTime,
        availableToTime: data.availableToTime,
        specialty: data.specialty,
        appointmentPriceInCents: data.appointmentPriceInCents,
      })
      .returning();

    return {
      id: row.id,
      clinicId: row.clinicId,
      name: row.name,
      avatarImageUrl: row.avatarImageUrl ?? undefined,
      availableFromWeekDay: row.availableFromWeekDay,
      availableToWeekDay: row.availableToWeekDay,
      availableFromTime: row.availableFromTime,
      availableToTime: row.availableToTime,
      specialty: row.specialty,
      appointmentPriceInCents: row.appointmentPriceInCents,
      createdAt: row.createdAt.toISOString(),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
    };
  }
}
