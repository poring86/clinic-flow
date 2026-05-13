import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { db } from '../db';
import {
  usersTable,
  accountsTable,
  sessionsTable,
  usersToClinicsTable,
  clinicsTable,
} from '../db/schema';
import { and, eq } from 'drizzle-orm'; // and is used in findOrCreateGoogleUser & login checks
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async deleteSession(token: string) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
    return { success: true };
  }
  async register(dto: RegisterDto) {
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email));
    if (existing.length > 0) {
      throw new ConflictException('Email already registered');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const userId = uuidv4();
    await db.insert(usersTable).values({
      id: userId,
      name: dto.name,
      email: dto.email,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.insert(accountsTable).values({
      id: uuidv4(),
      accountId: userId,
      providerId: 'credentials',
      userId,
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: userId, email: dto.email, name: dto.name };
  }

  async login(dto: LoginDto) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email));
    if (user.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const account = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.userId, user[0].id));
    if (account.length === 0 || !account[0].password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, account[0].password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Cria sessão
    const sessionId = uuidv4();
    const token = uuidv4();
    await db.insert(sessionsTable).values({
      id: sessionId,
      userId: user[0].id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return {
      token,
      user: { id: user[0].id, email: user[0].email, name: user[0].name },
    };
  }

  async findOrCreateGoogleUser(googleUser: {
    email: string;
    name: string;
    picture: string | null;
    accessToken: string;
  }) {
    let users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, googleUser.email));

    if (users.length === 0) {
      const userId = uuidv4();
      await db.insert(usersTable).values({
        id: userId,
        name: googleUser.name,
        email: googleUser.email,
        emailVerified: true,
        image: googleUser.picture,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await db.insert(accountsTable).values({
        id: uuidv4(),
        accountId: googleUser.email,
        providerId: 'google',
        userId,
        accessToken: googleUser.accessToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, googleUser.email));
    } else {
      const existingAccount = await db
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.userId, users[0].id),
            eq(accountsTable.providerId, 'google'),
          ),
        );
      if (existingAccount.length === 0) {
        await db.insert(accountsTable).values({
          id: uuidv4(),
          accountId: googleUser.email,
          providerId: 'google',
          userId: users[0].id,
          accessToken: googleUser.accessToken,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Check if user has a clinic, if not create default one
    const userClinic = await db
      .select()
      .from(usersToClinicsTable)
      .where(eq(usersToClinicsTable.userId, users[0].id));

    if (userClinic.length === 0) {
      const clinicId = uuidv4();
      await db.insert(clinicsTable).values({
        id: clinicId,
        name: `${users[0].name}'s Clinic`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await db.insert(usersToClinicsTable).values({
        userId: users[0].id,
        clinicId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const token = uuidv4();
    await db.insert(sessionsTable).values({
      id: uuidv4(),
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

  async getSession(token: string) {
    const session = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.token, token));
    if (session.length === 0) {
      throw new UnauthorizedException('Invalid session');
    }
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session[0].userId));
    if (user.length === 0) {
      throw new UnauthorizedException('User not found');
    }
    const userClinic = await db
      .select()
      .from(usersToClinicsTable)
      .where(eq(usersToClinicsTable.userId, user[0].id));
    const clinicId = userClinic[0]?.clinicId ?? null;
    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      clinicId,
    };
  }
}
