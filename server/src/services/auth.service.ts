import prisma from '../config/database.js';
import type { PrismaClient } from '../generated/prisma/client.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../utils/jwt.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';
import { DEFAULT_EXPENSE_CATEGORIES } from 'shared';

type TransactionClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; householdId: string };
}

export async function signup(
  email: string,
  password: string,
  householdName?: string,
): Promise<AuthTokens> {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  // Create household, user, and default expense categories in a transaction
  const result = await prisma.$transaction(async (tx: TransactionClient) => {
    const household = await tx.household.create({
      data: { name: householdName || 'My Household' },
    });

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        householdId: household.id,
      },
    });

    // Seed default expense categories
    for (let i = 0; i < DEFAULT_EXPENSE_CATEGORIES.length; i++) {
      const cat = DEFAULT_EXPENSE_CATEGORIES[i];
      await tx.expenseCategory.create({
        data: {
          householdId: household.id,
          name: cat.name,
          isDefault: true,
          sortOrder: i,
          subCategories: {
            create: cat.subCategories.map((subName, j) => ({
              name: subName,
              isDefault: true,
              sortOrder: j,
            })),
          },
        },
      });
    }

    return { household, user };
  });

  const payload: TokenPayload = {
    userId: result.user.id,
    householdId: result.household.id,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    user: {
      id: result.user.id,
      email: result.user.email,
      householdId: result.household.id,
    },
  };
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const validPassword = await comparePassword(password, user.passwordHash);
  if (!validPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const payload: TokenPayload = {
    userId: user.id,
    householdId: user.householdId,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    user: {
      id: user.id,
      email: user.email,
      householdId: user.householdId,
    },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { household: true },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    householdId: user.householdId,
    household: {
      id: user.household.id,
      name: user.household.name,
    },
  };
}
