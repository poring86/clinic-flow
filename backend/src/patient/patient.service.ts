import { Injectable } from '@nestjs/common';
import { eq, count } from 'drizzle-orm';

import { db } from '../db';
import { patientsTable } from '../db/schema';
import { PatientDto } from './dto/patient.dto';
import { PaginatedPatientDto } from './dto/paginated-patient.dto';
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

  async findAll(
    clinicId?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedPatientDto> {
    const offset = (page - 1) * pageSize;

    // Get total count
    let countQuery: any = db.select({ count: count() }).from(patientsTable);
    if (clinicId) {
      countQuery = countQuery.where(eq(patientsTable.clinicId, clinicId));
    }
    const countResult = await countQuery;
    const total = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated data
    let query: any = db.select().from(patientsTable);
    if (clinicId) {
      query = query.where(eq(patientsTable.clinicId, clinicId));
    }
    const rows = await query
      .orderBy(patientsTable.updatedAt)
      .limit(pageSize)
      .offset(offset);

    const data = rows.map((row: any) => ({
      id: row.id,
      clinicId: row.clinicId,
      name: row.name,
      email: row.email,
      phoneNumber: row.phoneNumber,
      sex: row.sex as PatientDto['sex'],
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
