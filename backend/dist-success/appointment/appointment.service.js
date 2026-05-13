"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
let AppointmentService = class AppointmentService {
    async findAll(clinicId) {
        const rows = clinicId
            ? await db_1.db
                .select()
                .from(schema_1.appointmentsTable)
                .where((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.clinicId, clinicId))
            : await db_1.db.select().from(schema_1.appointmentsTable);
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
    async create(data) {
        const [row] = await db_1.db
            .insert(schema_1.appointmentsTable)
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
    async delete(id) {
        const result = await db_1.db
            .delete(schema_1.appointmentsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.id, id));
        return (result.rowCount ?? 0) > 0;
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)()
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map