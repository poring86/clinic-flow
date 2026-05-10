import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { doctorsTable } from '../db/schema';
import { DoctorDto } from './dto/doctor.dto';

@Injectable()
export class DoctorService {
  async findAll(clinicId?: string): Promise<DoctorDto[]> {
    const rows = clinicId
      ? await db.select().from(doctorsTable).where(eq(doctorsTable.clinicId, clinicId))
      : await db.select().from(doctorsTable);

    return rows.map((row) => ({
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
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(doctorsTable).where(eq(doctorsTable.id, id));
    return result.rowCount > 0;
  }

  async update(id: string, data: Partial<Omit<DoctorDto, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DoctorDto | null> {
    const [row] = await db
      .update(doctorsTable)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.avatarImageUrl !== undefined && { avatarImageUrl: data.avatarImageUrl }),
        ...(data.availableFromWeekDay !== undefined && { availableFromWeekDay: data.availableFromWeekDay }),
        ...(data.availableToWeekDay !== undefined && { availableToWeekDay: data.availableToWeekDay }),
        ...(data.availableFromTime && { availableFromTime: data.availableFromTime }),
        ...(data.availableToTime && { availableToTime: data.availableToTime }),
        ...(data.specialty && { specialty: data.specialty }),
        ...(data.appointmentPriceInCents !== undefined && { appointmentPriceInCents: data.appointmentPriceInCents }),
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

  async create(data: Omit<DoctorDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<DoctorDto> {
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
