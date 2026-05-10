import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import * as schema from "./schema";
import {
  usersTable,
  accountsTable,
  clinicsTable,
  usersToClinicsTable,
  doctorsTable,
  patientsTable,
  appointmentsTable,
} from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
  console.log("Seeding database…");

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
  const passwordHash = await bcrypt.hash("admin123", 10);

  await db.insert(usersTable).values({
    id: userId,
    name: "Admin Demo",
    email: "admin@clinic-flow.com",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(accountsTable).values({
    id: uuidv4(),
    accountId: userId,
    providerId: "credentials",
    userId,
    password: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("  ✓ User created  →  admin@clinic-flow.com / admin123");

  // ------------------------------------------------------------------
  // Clinic
  // ------------------------------------------------------------------
  const [clinic] = await db
    .insert(clinicsTable)
    .values({ name: "Clínica Demo" })
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
      name: "Dr. Carlos Mendes",
      specialty: "Cardiologia",
      availableFromWeekDay: 1, // Monday
      availableToWeekDay: 5, // Friday
      availableFromTime: "08:00:00",
      availableToTime: "18:00:00",
      appointmentPriceInCents: 25000, // R$ 250,00
    },
    {
      name: "Dra. Fernanda Lima",
      specialty: "Dermatologia",
      availableFromWeekDay: 1,
      availableToWeekDay: 4, // Thursday
      availableFromTime: "09:00:00",
      availableToTime: "17:00:00",
      appointmentPriceInCents: 20000, // R$ 200,00
    },
    {
      name: "Dr. Rafael Torres",
      specialty: "Ortopedia",
      availableFromWeekDay: 2, // Tuesday
      availableToWeekDay: 6, // Saturday
      availableFromTime: "07:00:00",
      availableToTime: "15:00:00",
      appointmentPriceInCents: 30000, // R$ 300,00
    },
    {
      name: "Dra. Juliana Costa",
      specialty: "Pediatria",
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: "08:00:00",
      availableToTime: "16:00:00",
      appointmentPriceInCents: 18000, // R$ 180,00
    },
    {
      name: "Dr. André Batista",
      specialty: "Neurologia",
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: "10:00:00",
      availableToTime: "19:00:00",
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
  const patientData = [
    {
      name: "Ana Paula Rodrigues",
      email: "ana.rodrigues@email.com",
      phoneNumber: "11987654321",
      sex: "female" as const,
    },
    {
      name: "Bruno Souza",
      email: "bruno.souza@email.com",
      phoneNumber: "11976543210",
      sex: "male" as const,
    },
    {
      name: "Carla Ferreira",
      email: "carla.ferreira@email.com",
      phoneNumber: "11965432109",
      sex: "female" as const,
    },
    {
      name: "Diego Alves",
      email: "diego.alves@email.com",
      phoneNumber: "11954321098",
      sex: "male" as const,
    },
    {
      name: "Eduarda Martins",
      email: "eduarda.martins@email.com",
      phoneNumber: "11943210987",
      sex: "female" as const,
    },
    {
      name: "Felipe Nascimento",
      email: "felipe.nascimento@email.com",
      phoneNumber: "11932109876",
      sex: "male" as const,
    },
    {
      name: "Gabriela Oliveira",
      email: "gabriela.oliveira@email.com",
      phoneNumber: "11921098765",
      sex: "female" as const,
    },
    {
      name: "Henrique Castro",
      email: "henrique.castro@email.com",
      phoneNumber: "11910987654",
      sex: "male" as const,
    },
  ];

  const patients = await db
    .insert(patientsTable)
    .values(patientData.map((p) => ({ ...p, clinicId: clinic.id })))
    .returning();

  console.log(`  ✓ ${patients.length} patients created`);

  // ------------------------------------------------------------------
  // Appointments — spread across the last 30 days and next 30 days
  // ------------------------------------------------------------------
  const now = new Date();

  const appointmentSlots: {
    doctorIndex: number;
    patientIndex: number;
    daysOffset: number; // negative = past
    hour: number;
  }[] = [
    { doctorIndex: 0, patientIndex: 0, daysOffset: -25, hour: 9 },
    { doctorIndex: 0, patientIndex: 1, daysOffset: -20, hour: 10 },
    { doctorIndex: 1, patientIndex: 2, daysOffset: -18, hour: 9 },
    { doctorIndex: 1, patientIndex: 3, daysOffset: -15, hour: 14 },
    { doctorIndex: 2, patientIndex: 4, daysOffset: -12, hour: 8 },
    { doctorIndex: 2, patientIndex: 5, daysOffset: -10, hour: 11 },
    { doctorIndex: 3, patientIndex: 6, daysOffset: -7, hour: 9 },
    { doctorIndex: 3, patientIndex: 7, daysOffset: -5, hour: 15 },
    { doctorIndex: 4, patientIndex: 0, daysOffset: -3, hour: 10 },
    { doctorIndex: 0, patientIndex: 2, daysOffset: -1, hour: 8 },
    // future appointments
    { doctorIndex: 1, patientIndex: 4, daysOffset: 2, hour: 9 },
    { doctorIndex: 2, patientIndex: 6, daysOffset: 5, hour: 8 },
    { doctorIndex: 3, patientIndex: 1, daysOffset: 7, hour: 14 },
    { doctorIndex: 4, patientIndex: 3, daysOffset: 10, hour: 10 },
    { doctorIndex: 0, patientIndex: 5, daysOffset: 14, hour: 11 },
    { doctorIndex: 1, patientIndex: 7, daysOffset: 18, hour: 9 },
    { doctorIndex: 2, patientIndex: 0, daysOffset: 21, hour: 8 },
    { doctorIndex: 3, patientIndex: 2, daysOffset: 25, hour: 15 },
  ];

  const appointmentValues = appointmentSlots.map(
    ({ doctorIndex, patientIndex, daysOffset, hour }) => {
      const date = new Date(now);
      date.setDate(date.getDate() + daysOffset);
      date.setHours(hour, 0, 0, 0);

      const doctor = doctors[doctorIndex];
      return {
        clinicId: clinic.id,
        doctorId: doctor.id,
        patientId: patients[patientIndex].id,
        date,
        appointmentPriceInCents: doctor.appointmentPriceInCents,
      };
    },
  );

  const appointments = await db
    .insert(appointmentsTable)
    .values(appointmentValues)
    .returning();

  console.log(`  ✓ ${appointments.length} appointments created`);

  console.log("\nSeed completed successfully.");
  console.log("────────────────────────────────────────");
  console.log("  Login:    admin@clinic-flow.com");
  console.log("  Password: admin123");
  console.log("────────────────────────────────────────");

  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  pool.end();
  process.exit(1);
});
