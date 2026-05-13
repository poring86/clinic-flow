"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const schema = __importStar(require("./schema"));
const schema_1 = require("./schema");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const db = (0, node_postgres_1.drizzle)(pool, { schema });
async function main() {
    console.log('Seeding database…');
    await db.delete(schema_1.appointmentsTable);
    await db.delete(schema_1.patientsTable);
    await db.delete(schema_1.doctorsTable);
    await db.delete(schema_1.usersToClinicsTable);
    await db.delete(schema_1.clinicsTable);
    await db.delete(schema_1.accountsTable);
    await db.delete(schema_1.usersTable);
    const userId = (0, uuid_1.v4)();
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.insert(schema_1.usersTable).values({
        id: userId,
        name: 'Admin Demo',
        email: 'admin@clinic-flow.com',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await db.insert(schema_1.accountsTable).values({
        id: (0, uuid_1.v4)(),
        accountId: userId,
        providerId: 'credentials',
        userId,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log('  ✓ User created  →  admin@clinic-flow.com / admin123');
    const [clinic] = await db
        .insert(schema_1.clinicsTable)
        .values({ name: 'Demo Clinic' })
        .returning();
    await db.insert(schema_1.usersToClinicsTable).values({
        userId,
        clinicId: clinic.id,
    });
    console.log(`  ✓ Clinic created  →  ${clinic.name} (${clinic.id})`);
    const doctorData = [
        {
            name: 'Dr. Carlos Mendes',
            specialty: 'Cardiologia',
            availableFromWeekDay: 1,
            availableToWeekDay: 5,
            availableFromTime: '08:00:00',
            availableToTime: '18:00:00',
            appointmentPriceInCents: 25000,
        },
        {
            name: 'Dra. Fernanda Lima',
            specialty: 'Dermatologia',
            availableFromWeekDay: 1,
            availableToWeekDay: 4,
            availableFromTime: '09:00:00',
            availableToTime: '17:00:00',
            appointmentPriceInCents: 20000,
        },
        {
            name: 'Dr. Rafael Torres',
            specialty: 'Ortopedia',
            availableFromWeekDay: 2,
            availableToWeekDay: 6,
            availableFromTime: '07:00:00',
            availableToTime: '15:00:00',
            appointmentPriceInCents: 30000,
        },
        {
            name: 'Dra. Juliana Costa',
            specialty: 'Pediatria',
            availableFromWeekDay: 1,
            availableToWeekDay: 5,
            availableFromTime: '08:00:00',
            availableToTime: '16:00:00',
            appointmentPriceInCents: 18000,
        },
        {
            name: 'Dr. André Batista',
            specialty: 'Neurologia',
            availableFromWeekDay: 1,
            availableToWeekDay: 5,
            availableFromTime: '10:00:00',
            availableToTime: '19:00:00',
            appointmentPriceInCents: 35000,
        },
    ];
    const doctors = await db
        .insert(schema_1.doctorsTable)
        .values(doctorData.map((d) => ({ ...d, clinicId: clinic.id })))
        .returning();
    console.log(`  ✓ ${doctors.length} doctors created`);
    const firstNames = [
        'Alex',
        'Taylor',
        'Jordan',
        'Morgan',
        'Casey',
        'Avery',
        'Parker',
        'Riley',
        'Cameron',
        'Quinn',
        'Logan',
        'Hayden',
        'Skyler',
        'Rowan',
        'Charlie',
        'Jamie',
        'Reese',
        'Dakota',
        'Sam',
        'Emerson',
    ];
    const lastNames = [
        'Silva',
        'Santos',
        'Costa',
        'Oliveira',
        'Almeida',
        'Pereira',
        'Ribeiro',
        'Carvalho',
        'Mendes',
        'Araujo',
        'Fernandes',
        'Barbosa',
        'Gomes',
        'Martins',
        'Rocha',
    ];
    const patientData = Array.from({ length: 180 }).map((_, index) => {
        const firstName = firstNames[index % firstNames.length];
        const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
        const serial = String(index + 1).padStart(3, '0');
        return {
            name: `${firstName} ${lastName} ${serial}`,
            email: `patient.${serial}@demo.clinic`,
            phoneNumber: `1199${String(100000 + index).slice(-6)}`,
            sex: index % 2 === 0 ? 'female' : 'male',
        };
    });
    const patients = await db
        .insert(schema_1.patientsTable)
        .values(patientData.map((p) => ({ ...p, clinicId: clinic.id })))
        .returning();
    console.log(`  ✓ ${patients.length} patients created`);
    const now = new Date();
    const appointmentValues = [];
    for (let daysOffset = -150; daysOffset <= 60; daysOffset++) {
        const date = new Date(now);
        date.setDate(date.getDate() + daysOffset);
        const weekDay = date.getDay();
        doctors.forEach((doctor, doctorIndex) => {
            if (weekDay < doctor.availableFromWeekDay ||
                weekDay > doctor.availableToWeekDay) {
                return;
            }
            const baseVolume = daysOffset <= 0 ? 4 : 3;
            const dayVariance = (Math.abs(daysOffset) + doctorIndex) % 3;
            const appointmentsPerDoctor = baseVolume + dayVariance;
            const startHour = Number(doctor.availableFromTime.split(':')[0]);
            const endHour = Number(doctor.availableToTime.split(':')[0]);
            const hourSpan = Math.max(1, endHour - startHour);
            for (let slotIndex = 0; slotIndex < appointmentsPerDoctor; slotIndex++) {
                const appointmentDate = new Date(date);
                const slotHour = startHour +
                    ((slotIndex * 2 + Math.abs(daysOffset) + doctorIndex) % hourSpan);
                appointmentDate.setHours(slotHour, 0, 0, 0);
                const patientIndex = (Math.abs(daysOffset) * 11 + doctorIndex * 17 + slotIndex * 7) %
                    patients.length;
                appointmentValues.push({
                    clinicId: clinic.id,
                    doctorId: doctor.id,
                    patientId: patients[patientIndex].id,
                    date: appointmentDate,
                    appointmentPriceInCents: doctor.appointmentPriceInCents,
                });
            }
        });
    }
    const appointments = await db
        .insert(schema_1.appointmentsTable)
        .values(appointmentValues)
        .returning();
    console.log(`  ✓ ${appointments.length} appointments created`);
    console.log('\nSeed completed successfully.');
    console.log('────────────────────────────────────────');
    console.log('  Login:    admin@clinic-flow.com');
    console.log('  Password: admin123');
    console.log('────────────────────────────────────────');
    await pool.end();
}
main().catch((err) => {
    console.error('Seed failed:', err);
    void pool.end();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map