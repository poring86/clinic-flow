const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is required to initialize the database schema.');
  process.exit(1);
}

const statements = [
  'CREATE EXTENSION IF NOT EXISTS pgcrypto;',
  "DO $$ BEGIN CREATE TYPE patient_sex AS ENUM ('male', 'female'); EXCEPTION WHEN duplicate_object THEN null; END $$;",
  `CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    email_verified boolean NOT NULL,
    image text,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id text PRIMARY KEY,
    expires_at timestamp NOT NULL,
    token text NOT NULL UNIQUE,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    ip_address text,
    user_agent text,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS accounts (
    id text PRIMARY KEY,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at timestamp,
    refresh_token_expires_at timestamp,
    scope text,
    password text,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS verifications (
    id text PRIMARY KEY,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at timestamp NOT NULL,
    created_at timestamp,
    updated_at timestamp
  );`,
  `CREATE TABLE IF NOT EXISTS clinics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS users_to_clinics (
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    PRIMARY KEY (user_id, clinic_id)
  );`,
  `CREATE TABLE IF NOT EXISTS doctors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name text NOT NULL,
    avatar_image_url text,
    available_from_week_day integer NOT NULL,
    available_to_week_day integer NOT NULL,
    available_from_time time NOT NULL,
    available_to_time time NOT NULL,
    specialty text NOT NULL,
    appointment_price_in_cents integer NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS patients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    phone_number text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    sex patient_sex NOT NULL,
    updated_at timestamp DEFAULT now()
  );`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date timestamp NOT NULL,
    appointment_price_in_cents integer NOT NULL,
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp DEFAULT now()
  );`,
];

async function initialize() {
  const pool = new Pool({ connectionString });

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const client = await pool.connect().catch(() => null);

    if (!client) {
      console.log(`Database not reachable yet (attempt ${attempt}/20). Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      continue;
    }

    try {
      for (const sql of statements) {
        await client.query(sql);
      }

      console.log('Database schema is ready.');
      client.release();
      await pool.end();
      return;
    } catch (error) {
      client.release();

      if (attempt === 20) {
        await pool.end();
        throw error;
      }

      console.log(`Failed to initialize schema (attempt ${attempt}/20). Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  await pool.end();
  throw new Error('Could not initialize database schema after multiple attempts.');
}

initialize().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});
