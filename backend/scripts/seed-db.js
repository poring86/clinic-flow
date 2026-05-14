const { Pool } = require('pg');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is required to seed the database.');
  process.exit(1);
}

function generateUUID() {
  return crypto.randomUUID();
}

async function seedDatabase() {
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('Seeding database…');

    // ------------------------------------------------------------------
    // Clear existing data (respecting FK constraints)
    // ------------------------------------------------------------------
    await client.query('DELETE FROM appointments');
    await client.query('DELETE FROM patients');
    await client.query('DELETE FROM doctors');
    await client.query('DELETE FROM users_to_clinics');
    await client.query('DELETE FROM clinics');
    await client.query('DELETE FROM accounts');
    await client.query('DELETE FROM users');

    // ------------------------------------------------------------------
    // Create user
    // ------------------------------------------------------------------
    const userId = generateUUID();
    const passwordHash = await bcrypt.hash('admin123', 10);

    await client.query(
      `INSERT INTO users (id, name, email, email_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'Admin Demo', 'admin@clinic-flow.com', false, new Date(), new Date()]
    );

    await client.query(
      `INSERT INTO accounts (id, account_id, provider_id, user_id, password, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [generateUUID(), userId, 'credentials', userId, passwordHash, new Date(), new Date()]
    );

    console.log('  ✓ User created  →  admin@clinic-flow.com / admin123');

    // ------------------------------------------------------------------
    // Create clinic
    // ------------------------------------------------------------------
    const clinicId = generateUUID();
    await client.query(
      `INSERT INTO clinics (id, name, created_at, updated_at)
       VALUES ($1, $2, $3, $4)`,
      [clinicId, 'Demo Clinic', new Date(), new Date()]
    );

    await client.query(
      `INSERT INTO users_to_clinics (user_id, clinic_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, clinicId, new Date(), new Date()]
    );

    console.log(`  ✓ Clinic created  →  Demo Clinic (${clinicId})`);

    // ------------------------------------------------------------------
    // Create doctors
    // ------------------------------------------------------------------
    const doctorData = [
      {
        name: 'Dr. Carlos Mendes',
        specialty: 'Cardiology',
        availableFromWeekDay: 1,
        availableToWeekDay: 5,
        availableFromTime: '08:00:00',
        availableToTime: '18:00:00',
        appointmentPriceInCents: 25000,
      },
      {
        name: 'Dr. Fernanda Lima',
        specialty: 'Dermatology',
        availableFromWeekDay: 1,
        availableToWeekDay: 4,
        availableFromTime: '09:00:00',
        availableToTime: '17:00:00',
        appointmentPriceInCents: 20000,
      },
      {
        name: 'Dr. Rafael Torres',
        specialty: 'Orthopedics and Traumatology',
        availableFromWeekDay: 2,
        availableToWeekDay: 6,
        availableFromTime: '07:00:00',
        availableToTime: '15:00:00',
        appointmentPriceInCents: 30000,
      },
      {
        name: 'Dr. Juliana Costa',
        specialty: 'Pediatrics',
        availableFromWeekDay: 1,
        availableToWeekDay: 5,
        availableFromTime: '08:00:00',
        availableToTime: '16:00:00',
        appointmentPriceInCents: 18000,
      },
      {
        name: 'Dr. Andre Batista',
        specialty: 'Neurology',
        availableFromWeekDay: 1,
        availableToWeekDay: 5,
        availableFromTime: '10:00:00',
        availableToTime: '19:00:00',
        appointmentPriceInCents: 35000,
      },
    ];

    const doctors = [];
    for (const doctor of doctorData) {
      const doctorId = generateUUID();
      await client.query(
        `INSERT INTO doctors (id, clinic_id, name, specialty, available_from_week_day, available_to_week_day, available_from_time, available_to_time, appointment_price_in_cents, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          doctorId,
          clinicId,
          doctor.name,
          doctor.specialty,
          doctor.availableFromWeekDay,
          doctor.availableToWeekDay,
          doctor.availableFromTime,
          doctor.availableToTime,
          doctor.appointmentPriceInCents,
          new Date(),
          new Date(),
        ]
      );
      doctors.push({
        id: doctorId,
        ...doctor,
      });
    }

    console.log(`  ✓ ${doctors.length} doctors created`);

    // ------------------------------------------------------------------
    // Create patients
    // ------------------------------------------------------------------
    const firstNames = [
      'Alex', 'Taylor', 'Jordan', 'Morgan', 'Casey', 'Avery', 'Parker', 'Riley',
      'Cameron', 'Quinn', 'Logan', 'Hayden', 'Skyler', 'Rowan', 'Charlie', 'Jamie',
      'Reese', 'Dakota', 'Sam', 'Emerson',
    ];

    const lastNames = [
      'Silva', 'Santos', 'Costa', 'Oliveira', 'Almeida', 'Pereira', 'Ribeiro',
      'Carvalho', 'Mendes', 'Araujo', 'Fernandes', 'Barbosa', 'Gomes', 'Martins', 'Rocha',
    ];

    const patients = [];
    for (let index = 0; index < 180; index++) {
      const firstName = firstNames[index % firstNames.length];
      const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
      const serial = String(index + 1).padStart(3, '0');

      const patientId = generateUUID();
      const sex = index % 2 === 0 ? 'female' : 'male';

      await client.query(
        `INSERT INTO patients (id, clinic_id, name, email, phone_number, sex, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          patientId,
          clinicId,
          `${firstName} ${lastName} ${serial}`,
          `patient.${serial}@demo.clinic`,
          `1199${String(100000 + index).slice(-6)}`,
          sex,
          new Date(),
          new Date(),
        ]
      );
      patients.push({ id: patientId });
    }

    console.log(`  ✓ ${patients.length} patients created`);

    // ------------------------------------------------------------------
    // Create appointments
    // ------------------------------------------------------------------
    const now = new Date();
    let appointmentCount = 0;

    for (let daysOffset = -150; daysOffset <= 60; daysOffset++) {
      const date = new Date(now);
      date.setDate(date.getDate() + daysOffset);
      const weekDay = date.getDay();

      for (let doctorIndex = 0; doctorIndex < doctors.length; doctorIndex++) {
        const doctor = doctors[doctorIndex];

        if (weekDay < doctor.availableFromWeekDay || weekDay > doctor.availableToWeekDay) {
          continue;
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
            (Math.abs(daysOffset) * 11 + doctorIndex * 17 + slotIndex * 7) % patients.length;

          await client.query(
            `INSERT INTO appointments (id, clinic_id, doctor_id, patient_id, date, appointment_price_in_cents, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              generateUUID(),
              clinicId,
              doctor.id,
              patients[patientIndex].id,
              appointmentDate,
              doctor.appointmentPriceInCents,
              new Date(),
              new Date(),
            ]
          );
          appointmentCount++;
        }
      }
    }

    console.log(`  ✓ ${appointmentCount} appointments created`);

    console.log('\nSeed completed successfully.');
    console.log('────────────────────────────────────────');
    console.log('  Login:    admin@clinic-flow.com');
    console.log('  Password: admin123');
    console.log('────────────────────────────────────────');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
