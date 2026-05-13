import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { patientsTable } from '../db/schema';
import { PatientDto } from './dto/patient.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(patientsTable)
      .where(eq(patientsTable.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(clinicId?: string): Promise<PatientDto[]> {
    const rows = clinicId
      ? await db
          .select()
          .from(patientsTable)
          .where(eq(patientsTable.clinicId, clinicId))
      : await db.select().from(patientsTable);

    return rows.map((row) => ({
      id: row.id,
      clinicId: row.clinicId,
      name: row.name,
      email: row.email,
      phoneNumber: row.phoneNumber,
      sex: row.sex as PatientDto['sex'],
      createdAt: row.createdAt.toISOString(),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
    }));
  }

  async create(dto: CreatePatientDto): Promise<PatientDto> {
    const [row] = await db
      .insert(patientsTable)
      .values({
        clinicId: dto.clinicId,
        name: dto.name,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        sex: dto.sex,
      })
      .returning();

    return {
      id: row.id,
      clinicId: row.clinicId,
      name: row.name,
      email: row.email,
      phoneNumber: row.phoneNumber,
      sex: row.sex as PatientDto['sex'],
      createdAt: row.createdAt.toISOString(),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
    };
  }

  async update(id: string, dto: UpdatePatientDto): Promise<PatientDto | null> {
    const [row] = await db
      .update(patientsTable)
      .set({
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email }),
        ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber }),
        ...(dto.sex && { sex: dto.sex }),
      })
      .where(eq(patientsTable.id, id))
      .returning();

    if (!row) return null;

    return {
      id: row.id,
      clinicId: row.clinicId,
      name: row.name,
      email: row.email,
      phoneNumber: row.phoneNumber,
      sex: row.sex as PatientDto['sex'],
      createdAt: row.createdAt.toISOString(),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
    };
  }
}
