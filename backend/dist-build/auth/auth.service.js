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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    async deleteSession(token) {
        await db_1.db.delete(schema_1.sessionsTable).where((0, drizzle_orm_1.eq)(schema_1.sessionsTable.token, token));
        return { success: true };
    }
    async register(dto) {
        const existing = await db_1.db
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, dto.email));
        if (existing.length > 0) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const userId = (0, uuid_1.v4)();
        await db_1.db.insert(schema_1.usersTable).values({
            id: userId,
            name: dto.name,
            email: dto.email,
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await db_1.db.insert(schema_1.accountsTable).values({
            id: (0, uuid_1.v4)(),
            accountId: userId,
            providerId: 'credentials',
            userId,
            password: hashed,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return { id: userId, email: dto.email, name: dto.name };
    }
    async login(dto) {
        const user = await db_1.db
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, dto.email));
        if (user.length === 0) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const account = await db_1.db
            .select()
            .from(schema_1.accountsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.accountsTable.userId, user[0].id));
        if (account.length === 0 || !account[0].password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, account[0].password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const sessionId = (0, uuid_1.v4)();
        const token = (0, uuid_1.v4)();
        await db_1.db.insert(schema_1.sessionsTable).values({
            id: sessionId,
            userId: user[0].id,
            token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return {
            token,
            user: { id: user[0].id, email: user[0].email, name: user[0].name },
        };
    }
    async findOrCreateGoogleUser(googleUser) {
        let users = await db_1.db
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, googleUser.email));
        if (users.length === 0) {
            const userId = (0, uuid_1.v4)();
            await db_1.db.insert(schema_1.usersTable).values({
                id: userId,
                name: googleUser.name,
                email: googleUser.email,
                emailVerified: true,
                image: googleUser.picture,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await db_1.db.insert(schema_1.accountsTable).values({
                id: (0, uuid_1.v4)(),
                accountId: googleUser.email,
                providerId: 'google',
                userId,
                accessToken: googleUser.accessToken,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            users = await db_1.db
                .select()
                .from(schema_1.usersTable)
                .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, googleUser.email));
        }
        else {
            const existingAccount = await db_1.db
                .select()
                .from(schema_1.accountsTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.accountsTable.userId, users[0].id), (0, drizzle_orm_1.eq)(schema_1.accountsTable.providerId, 'google')));
            if (existingAccount.length === 0) {
                await db_1.db.insert(schema_1.accountsTable).values({
                    id: (0, uuid_1.v4)(),
                    accountId: googleUser.email,
                    providerId: 'google',
                    userId: users[0].id,
                    accessToken: googleUser.accessToken,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        }
        const userClinic = await db_1.db
            .select()
            .from(schema_1.usersToClinicsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersToClinicsTable.userId, users[0].id));
        if (userClinic.length === 0) {
            const clinicId = (0, uuid_1.v4)();
            await db_1.db.insert(schema_1.clinicsTable).values({
                id: clinicId,
                name: `${users[0].name}'s Clinic`,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await db_1.db.insert(schema_1.usersToClinicsTable).values({
                userId: users[0].id,
                clinicId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        const token = (0, uuid_1.v4)();
        await db_1.db.insert(schema_1.sessionsTable).values({
            id: (0, uuid_1.v4)(),
            userId: users[0].id,
            token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return {
            token,
            user: {
                id: users[0].id,
                email: users[0].email,
                name: users[0].name,
            },
        };
    }
    async getSession(token) {
        const session = await db_1.db
            .select()
            .from(schema_1.sessionsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.sessionsTable.token, token));
        if (session.length === 0) {
            throw new common_1.UnauthorizedException('Invalid session');
        }
        const user = await db_1.db
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, session[0].userId));
        if (user.length === 0) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const userClinic = await db_1.db
            .select()
            .from(schema_1.usersToClinicsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersToClinicsTable.userId, user[0].id));
        const clinicId = userClinic[0]?.clinicId ?? null;
        return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            clinicId,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map