"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
let DoctorService = class DoctorService {
    async findAll(clinicId) {
        const rows = clinicId
            ? await db_1.db
                .select()
                .from(schema_1.doctorsTable)
                .where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.clinicId, clinicId))
            : await db_1.db.select().from(schema_1.doctorsTable);
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
    async delete(id) {
        const result = await db_1.db.delete(schema_1.doctorsTable).where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.id, id));
        return (result.rowCount ?? 0) > 0;
    }
    async update(id, data) {
        const [row] = await db_1.db
            .update(schema_1.doctorsTable)
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
            .where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.id, id))
            .returning();
        if (!row)
            return null;
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
    async create(data) {
        const [row] = await db_1.db
            .insert(schema_1.doctorsTable)
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
};
exports.DoctorService = DoctorService;
exports.DoctorService = DoctorService = __decorate([
    (0, common_1.Injectable)()
], DoctorService);
//# sourceMappingURL=doctor.service.js.map