import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

// ─── Categories ──────────────────────────────────────

export async function listCategories(householdId: string) {
  return prisma.expenseCategory.findMany({
    where: { householdId },
    orderBy: { sortOrder: 'asc' },
    include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
  });
}

export async function createCategory(householdId: string, data: { name: string }) {
  const count = await prisma.expenseCategory.count({ where: { householdId } });
  return prisma.expenseCategory.create({
    data: {
      householdId,
      name: data.name,
      sortOrder: count,
    },
    include: { subCategories: true },
  });
}

export async function updateCategory(id: string, householdId: string, data: {
  name?: string;
  isCollapsed?: boolean;
  sortOrder?: number;
}) {
  const cat = await prisma.expenseCategory.findFirst({ where: { id, householdId } });
  if (!cat) throw new NotFoundError('Category not found');

  return prisma.expenseCategory.update({
    where: { id },
    data,
    include: { subCategories: { orderBy: { sortOrder: 'asc' } } },
  });
}

export async function removeCategory(id: string, householdId: string) {
  const cat = await prisma.expenseCategory.findFirst({ where: { id, householdId } });
  if (!cat) throw new NotFoundError('Category not found');

  await prisma.expenseCategory.delete({ where: { id } });
}

// ─── Sub-Categories ──────────────────────────────────

export async function createSubCategory(categoryId: string, householdId: string, data: { name: string }) {
  const cat = await prisma.expenseCategory.findFirst({ where: { id: categoryId, householdId } });
  if (!cat) throw new NotFoundError('Category not found');

  const count = await prisma.expenseSubCategory.count({ where: { categoryId } });
  return prisma.expenseSubCategory.create({
    data: {
      categoryId,
      name: data.name,
      sortOrder: count,
    },
  });
}

export async function updateSubCategory(id: string, householdId: string, data: {
  name?: string;
  amount?: number;
  sortOrder?: number;
}) {
  const sub = await prisma.expenseSubCategory.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!sub || sub.category.householdId !== householdId) {
    throw new NotFoundError('Sub-category not found');
  }

  return prisma.expenseSubCategory.update({ where: { id }, data });
}

export async function removeSubCategory(id: string, householdId: string) {
  const sub = await prisma.expenseSubCategory.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!sub || sub.category.householdId !== householdId) {
    throw new NotFoundError('Sub-category not found');
  }

  await prisma.expenseSubCategory.delete({ where: { id } });
}
