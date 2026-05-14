import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as schema from './schema';
import {
  usersTable,
  accountsTable,
  clinicsTable,
  usersToClinicsTable,
  doctorsTable,
  patientsTable,
  appointmentsTable,
} from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
  console.log('Seeding database…');

  // ------------------------------------------------------------------
  // Wipe existing seed data (order respects FK constraints)
  // ------------------------------------------------------------------
  await db.delete(appointmentsTable);
  await db.delete(patientsTable);
  await db.delete(doctorsTable);
  await db.delete(usersToClinicsTable);
  await db.delete(clinicsTable);
  await db.delete(accountsTable);
  await db.delete(usersTable);

  // ------------------------------------------------------------------
  // User
  // ------------------------------------------------------------------
  const userId = uuidv4();
  const passwordHash = await bcrypt.hash('admin123', 10);

  await db.insert(usersTable).values({
    id: userId,
    name: 'Admin Demo',
    email: 'admin@clinic-flow.com',
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(accountsTable).values({
    id: uuidv4(),
    accountId: userId,
    providerId: 'credentials',
    userId,
    password: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('  ✓ User created  →  admin@clinic-flow.com / admin123');

  // ------------------------------------------------------------------
  // Clinic
  // ------------------------------------------------------------------
  const [clinic] = await db
    .insert(clinicsTable)
    .values({ name: 'Demo Clinic' })
    .returning();

  await db.insert(usersToClinicsTable).values({
    userId,
    clinicId: clinic.id,
  });

  console.log(`  ✓ Clinic created  →  ${clinic.name} (${clinic.id})`);

  // ------------------------------------------------------------------
  // Doctors
  // ------------------------------------------------------------------
  const doctorData = [
    {
      name: 'Dr. Carlos Mendes',
      specialty: 'Cardiology',
      availableFromWeekDay: 1, // Monday
      availableToWeekDay: 5, // Friday
      availableFromTime: '08:00:00',
      availableToTime: '18:00:00',
      appointmentPriceInCents: 25000, // R$ 250,00
    },
    {
      name: 'Dra. Fernanda Lima',
      specialty: 'Dermatology',
      availableFromWeekDay: 1,
      availableToWeekDay: 4, // Thursday
      availableFromTime: '09:00:00',
      availableToTime: '17:00:00',
      appointmentPriceInCents: 20000, // R$ 200,00
    },
    {
      name: 'Dr. Rafael Torres',
      specialty: 'Orthopedics and Traumatology',
      availableFromWeekDay: 2, // Tuesday
      availableToWeekDay: 6, // Saturday
      availableFromTime: '07:00:00',
      availableToTime: '15:00:00',
      appointmentPriceInCents: 30000, // R$ 300,00
    },
    {
      name: 'Dr. Juliana Costa',
      specialty: 'Pediatrics',
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: '08:00:00',
      availableToTime: '16:00:00',
      appointmentPriceInCents: 18000, // R$ 180,00
    },
    {
      name: 'Dr. Andre Batista',
      specialty: 'Neurology',
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: '10:00:00',
      availableToTime: '19:00:00',
      appointmentPriceInCents: 35000, // R$ 350,00
    },
  ];

  const doctors = await db
    .insert(doctorsTable)
    .values(doctorData.map((d) => ({ ...d, clinicId: clinic.id })))
    .returning();

  console.log(`  ✓ ${doctors.length} doctors created`);

  // ------------------------------------------------------------------
  // Patients
  // ------------------------------------------------------------------
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
    const lastName =
      lastNames[Math.floor(index / firstNames.length) % lastNames.length];
    const serial = String(index + 1).padStart(3, '0');

    return {
      name: `${firstName} ${lastName} ${serial}`,
      email: `patient.${serial}@demo.clinic`,
      phoneNumber: `1199${String(100000 + index).slice(-6)}`,
      sex: index % 2 === 0 ? ('female' as const) : ('male' as const),
    };
  });

  const patients = await db
    .insert(patientsTable)
    .values(patientData.map((p) => ({ ...p, clinicId: clinic.id })))
    .returning();

  console.log(`  ✓ ${patients.length} patients created`);

  // ------------------------------------------------------------------
  // Appointments — high-volume distribution over past and upcoming months
  // ------------------------------------------------------------------
  const now = new Date();
  const appointmentValues: {
    clinicId: string;
    doctorId: string;
    patientId: string;
    date: Date;
    appointmentPriceInCents: number;
  }[] = [];

  for (let daysOffset = -150; daysOffset <= 60; daysOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + daysOffset);
    const weekDay = date.getDay();

    doctors.forEach((doctor, doctorIndex) => {
      if (
        weekDay < doctor.availableFromWeekDay ||
        weekDay > doctor.availableToWeekDay
      ) {
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
        const slotHour =
          startHour +
          ((slotIndex * 2 + Math.abs(daysOffset) + doctorIndex) % hourSpan);

        appointmentDate.setHours(slotHour, 0, 0, 0);

        const patientIndex =
          (Math.abs(daysOffset) * 11 + doctorIndex * 17 + slotIndex * 7) %
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
    .insert(appointmentsTable)
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
