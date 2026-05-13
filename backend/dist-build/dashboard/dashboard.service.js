"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
let DashboardService = class DashboardService {
    getDateRange(from, to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        return { fromDate, toDate };
    }
    getTodayRange() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        return { today, todayEnd };
    }
    async getSummary(clinicId, from, to) {
        const { fromDate, toDate } = this.getDateRange(from, to);
        const appointmentRangeFilter = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.clinicId, clinicId), (0, drizzle_orm_1.gte)(schema_1.appointmentsTable.date, fromDate), (0, drizzle_orm_1.lte)(schema_1.appointmentsTable.date, toDate));
        const [[revenueResult], [appointmentsResult], [patientsResult], [doctorsResult],] = await Promise.all([
            db_1.db
                .select({ total: (0, drizzle_orm_1.sum)(schema_1.appointmentsTable.appointmentPriceInCents) })
                .from(schema_1.appointmentsTable)
                .where(appointmentRangeFilter),
            db_1.db
                .select({ total: (0, drizzle_orm_1.count)() })
                .from(schema_1.appointmentsTable)
                .where(appointmentRangeFilter),
            db_1.db
                .select({ total: (0, drizzle_orm_1.count)() })
                .from(schema_1.patientsTable)
                .where((0, drizzle_orm_1.eq)(schema_1.patientsTable.clinicId, clinicId)),
            db_1.db
                .select({ total: (0, drizzle_orm_1.count)() })
                .from(schema_1.doctorsTable)
                .where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.clinicId, clinicId)),
        ]);
        return {
            totalRevenue: { total: Number(revenueResult.total ?? 0) },
            totalAppointments: { total: appointmentsResult.total },
            totalPatients: { total: patientsResult.total },
            totalDoctors: { total: doctorsResult.total },
        };
    }
    async getTopDoctors(clinicId, from, to) {
        const { fromDate, toDate } = this.getDateRange(from, to);
        return db_1.db
            .select({
            id: schema_1.doctorsTable.id,
            name: schema_1.doctorsTable.name,
            avatarImageUrl: schema_1.doctorsTable.avatarImageUrl,
            specialty: schema_1.doctorsTable.specialty,
            appointments: (0, drizzle_orm_1.count)(schema_1.appointmentsTable.id),
        })
            .from(schema_1.doctorsTable)
            .leftJoin(schema_1.appointmentsTable, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.doctorId, schema_1.doctorsTable.id), (0, drizzle_orm_1.gte)(schema_1.appointmentsTable.date, fromDate), (0, drizzle_orm_1.lte)(schema_1.appointmentsTable.date, toDate)))
            .where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.clinicId, clinicId))
            .groupBy(schema_1.doctorsTable.id, schema_1.doctorsTable.name, schema_1.doctorsTable.avatarImageUrl, schema_1.doctorsTable.specialty)
            .orderBy((0, drizzle_orm_1.sql) `count(${schema_1.appointmentsTable.id}) desc`)
            .limit(5);
    }
    async getTopSpecialties(clinicId, from, to) {
        const { fromDate, toDate } = this.getDateRange(from, to);
        return db_1.db
            .select({
            specialty: schema_1.doctorsTable.specialty,
            appointments: (0, drizzle_orm_1.count)(schema_1.appointmentsTable.id),
        })
            .from(schema_1.doctorsTable)
            .leftJoin(schema_1.appointmentsTable, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.doctorId, schema_1.doctorsTable.id), (0, drizzle_orm_1.gte)(schema_1.appointmentsTable.date, fromDate), (0, drizzle_orm_1.lte)(schema_1.appointmentsTable.date, toDate)))
            .where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.clinicId, clinicId))
            .groupBy(schema_1.doctorsTable.specialty)
            .orderBy((0, drizzle_orm_1.sql) `count(${schema_1.appointmentsTable.id}) desc`)
            .limit(5);
    }
    async getTodayAppointments(clinicId) {
        const { today, todayEnd } = this.getTodayRange();
        return db_1.db
            .select({
            id: schema_1.appointmentsTable.id,
            date: schema_1.appointmentsTable.date,
            appointmentPriceInCents: schema_1.appointmentsTable.appointmentPriceInCents,
            patientId: schema_1.appointmentsTable.patientId,
            doctorId: schema_1.appointmentsTable.doctorId,
            clinicId: schema_1.appointmentsTable.clinicId,
            createdAt: schema_1.appointmentsTable.createdAt,
            updatedAt: schema_1.appointmentsTable.updatedAt,
            patient: {
                name: schema_1.patientsTable.name,
            },
            doctor: {
                name: schema_1.doctorsTable.name,
                specialty: schema_1.doctorsTable.specialty,
            },
        })
            .from(schema_1.appointmentsTable)
            .innerJoin(schema_1.patientsTable, (0, drizzle_orm_1.eq)(schema_1.appointmentsTable.patientId, schema_1.patientsTable.id))
            .innerJoin(schema_1.doctorsTable, (0, drizzle_orm_1.eq)(schema_1.appointmentsTable.doctorId, schema_1.doctorsTable.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.clinicId, clinicId), (0, drizzle_orm_1.gte)(schema_1.appointmentsTable.date, today), (0, drizzle_orm_1.lte)(schema_1.appointmentsTable.date, todayEnd)))
            .orderBy(schema_1.appointmentsTable.date);
    }
    async getDailyAppointmentsData(clinicId, from, to) {
        const { fromDate, toDate } = this.getDateRange(from, to);
        return db_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `DATE(${schema_1.appointmentsTable.date})`,
            appointments: (0, drizzle_orm_1.count)(),
            revenue: (0, drizzle_orm_1.sum)(schema_1.appointmentsTable.appointmentPriceInCents),
        })
            .from(schema_1.appointmentsTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointmentsTable.clinicId, clinicId), (0, drizzle_orm_1.gte)(schema_1.appointmentsTable.date, fromDate), (0, drizzle_orm_1.lte)(schema_1.appointmentsTable.date, toDate)))
            .groupBy((0, drizzle_orm_1.sql) `DATE(${schema_1.appointmentsTable.date})`)
            .orderBy((0, drizzle_orm_1.sql) `DATE(${schema_1.appointmentsTable.date})`);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)()
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map