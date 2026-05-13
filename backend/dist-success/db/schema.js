"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsTableRelations = exports.appointmentsTable = exports.patientsTableRelations = exports.patientsTable = exports.patientSexEnum = exports.doctorsTableRelations = exports.doctorsTable = exports.clinicsTableRelations = exports.usersToClinicsTableRelations = exports.usersToClinicsTable = exports.clinicsTable = exports.verificationsTable = exports.accountsTable = exports.sessionsTable = exports.usersTableRelations = exports.usersTable = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.usersTable = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    emailVerified: (0, pg_core_1.boolean)('email_verified').notNull(),
    image: (0, pg_core_1.text)('image'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull(),
});
exports.usersTableRelations = (0, drizzle_orm_1.relations)(exports.usersTable, ({ many }) => ({
    usersToClinics: many(exports.usersToClinicsTable),
}));
exports.sessionsTable = (0, pg_core_1.pgTable)('sessions', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    token: (0, pg_core_1.text)('token').notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull(),
    ipAddress: (0, pg_core_1.text)('ip_address'),
    userAgent: (0, pg_core_1.text)('user_agent'),
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: 'cascade' }),
});
exports.accountsTable = (0, pg_core_1.pgTable)('accounts', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    accountId: (0, pg_core_1.text)('account_id').notNull(),
    providerId: (0, pg_core_1.text)('provider_id').notNull(),
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: 'cascade' }),
    accessToken: (0, pg_core_1.text)('access_token'),
    refreshToken: (0, pg_core_1.text)('refresh_token'),
    idToken: (0, pg_core_1.text)('id_token'),
    accessTokenExpiresAt: (0, pg_core_1.timestamp)('access_token_expires_at'),
    refreshTokenExpiresAt: (0, pg_core_1.timestamp)('refresh_token_expires_at'),
    scope: (0, pg_core_1.text)('scope'),
    password: (0, pg_core_1.text)('password'),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull(),
});
exports.verificationsTable = (0, pg_core_1.pgTable)('verifications', {
    id: (0, pg_core_1.text)('id').primaryKey(),
    identifier: (0, pg_core_1.text)('identifier').notNull(),
    value: (0, pg_core_1.text)('value').notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at'),
    updatedAt: (0, pg_core_1.timestamp)('updated_at'),
});
exports.clinicsTable = (0, pg_core_1.pgTable)('clinics', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
});
exports.usersToClinicsTable = (0, pg_core_1.pgTable)('users_to_clinics', {
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: 'cascade' }),
    clinicId: (0, pg_core_1.uuid)('clinic_id')
        .notNull()
        .references(() => exports.clinicsTable.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
});
exports.usersToClinicsTableRelations = (0, drizzle_orm_1.relations)(exports.usersToClinicsTable, ({ one }) => ({
    user: one(exports.usersTable, {
        fields: [exports.usersToClinicsTable.userId],
        references: [exports.usersTable.id],
    }),
    clinic: one(exports.clinicsTable, {
        fields: [exports.usersToClinicsTable.clinicId],
        references: [exports.clinicsTable.id],
    }),
}));
exports.clinicsTableRelations = (0, drizzle_orm_1.relations)(exports.clinicsTable, ({ many }) => ({
    doctors: many(exports.doctorsTable),
    patients: many(exports.patientsTable),
    appointments: many(exports.appointmentsTable),
    usersToClinics: many(exports.usersToClinicsTable),
}));
exports.doctorsTable = (0, pg_core_1.pgTable)('doctors', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    clinicId: (0, pg_core_1.uuid)('clinic_id')
        .notNull()
        .references(() => exports.clinicsTable.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.text)('name').notNull(),
    avatarImageUrl: (0, pg_core_1.text)('avatar_image_url'),
    availableFromWeekDay: (0, pg_core_1.integer)('available_from_week_day').notNull(),
    availableToWeekDay: (0, pg_core_1.integer)('available_to_week_day').notNull(),
    availableFromTime: (0, pg_core_1.time)('available_from_time').notNull(),
    availableToTime: (0, pg_core_1.time)('available_to_time').notNull(),
    specialty: (0, pg_core_1.text)('specialty').notNull(),
    appointmentPriceInCents: (0, pg_core_1.integer)('appointment_price_in_cents').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
});
exports.doctorsTableRelations = (0, drizzle_orm_1.relations)(exports.doctorsTable, ({ many, one }) => ({
    clinic: one(exports.clinicsTable, {
        fields: [exports.doctorsTable.clinicId],
        references: [exports.clinicsTable.id],
    }),
    appointments: many(exports.appointmentsTable),
}));
exports.patientSexEnum = (0, pg_core_1.pgEnum)('patient_sex', ['male', 'female']);
exports.patientsTable = (0, pg_core_1.pgTable)('patients', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    clinicId: (0, pg_core_1.uuid)('clinic_id')
        .notNull()
        .references(() => exports.clinicsTable.id, { onDelete: 'cascade' }),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').notNull(),
    phoneNumber: (0, pg_core_1.text)('phone_number').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    sex: (0, exports.patientSexEnum)('sex').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
});
exports.patientsTableRelations = (0, drizzle_orm_1.relations)(exports.patientsTable, ({ one, many }) => ({
    clinic: one(exports.clinicsTable, {
        fields: [exports.patientsTable.clinicId],
        references: [exports.clinicsTable.id],
    }),
    appointments: many(exports.appointmentsTable),
}));
exports.appointmentsTable = (0, pg_core_1.pgTable)('appointments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    date: (0, pg_core_1.timestamp)('date').notNull(),
    appointmentPriceInCents: (0, pg_core_1.integer)('appointment_price_in_cents').notNull(),
    clinicId: (0, pg_core_1.uuid)('clinic_id')
        .notNull()
        .references(() => exports.clinicsTable.id, { onDelete: 'cascade' }),
    patientId: (0, pg_core_1.uuid)('patient_id')
        .notNull()
        .references(() => exports.patientsTable.id, { onDelete: 'cascade' }),
    doctorId: (0, pg_core_1.uuid)('doctor_id')
        .notNull()
        .references(() => exports.doctorsTable.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
});
exports.appointmentsTableRelations = (0, drizzle_orm_1.relations)(exports.appointmentsTable, ({ one }) => ({
    clinic: one(exports.clinicsTable, {
        fields: [exports.appointmentsTable.clinicId],
        references: [exports.clinicsTable.id],
    }),
    patient: one(exports.patientsTable, {
        fields: [exports.appointmentsTable.patientId],
        references: [exports.patientsTable.id],
    }),
    doctor: one(exports.doctorsTable, {
        fields: [exports.appointmentsTable.doctorId],
        references: [exports.doctorsTable.id],
    }),
}));
//# sourceMappingURL=schema.js.map