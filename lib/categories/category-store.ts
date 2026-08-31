import "server-only";

import { CategoryType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CategoryTypeValue = "Animal" | "Accessory";
export type CategoryInput = { name: string; slug?: string; type: CategoryTypeValue; description?: string; isActive: boolean };

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export async function listCategories() { return prisma.category.findMany({ orderBy: { name: "asc" } }); }
export async function findCategory(id: string) { return prisma.category.findUnique({ where: { id } }); }
export async function createCategory(input: CategoryInput) { const slug = slugify(input.slug || input.name); if (!slug) throw new CategoryStoreError("A valid slug is required.", 400); try { return await prisma.category.create({ data: { name: input.name.trim(), slug, type: input.type as CategoryType, description: input.description?.trim() ?? "", isActive: input.isActive } }); } catch (error) { if (isUniqueError(error)) throw new CategoryStoreError("A category with this slug already exists.", 409); throw error; } }
export async function updateCategory(id: string, input: Partial<CategoryInput>) { const existing = await findCategory(id); if (!existing) return null; const slug = input.slug === undefined && input.name === undefined ? existing.slug : slugify(input.slug || input.name || existing.name); if (!slug) throw new CategoryStoreError("A valid slug is required.", 400); try { return await prisma.category.update({ where: { id }, data: { ...(input.name !== undefined ? { name: input.name.trim() } : {}), ...(input.type !== undefined ? { type: input.type as CategoryType } : {}), ...(input.description !== undefined ? { description: input.description.trim() } : {}), ...(input.isActive !== undefined ? { isActive: input.isActive } : {}), slug } }); } catch (error) { if (isUniqueError(error)) throw new CategoryStoreError("A category with this slug already exists.", 409); throw error; } }
export async function removeCategory(id: string) { const category = await findCategory(id); if (!category) return null; if (category.items > 0) throw new CategoryStoreError("This category still has products. Move or delete those products before removing it.", 409); await prisma.category.delete({ where: { id } }); return category; }
function isUniqueError(error: unknown) { return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002"; }
export class CategoryStoreError extends Error { constructor(message: string, public status: number) { super(message); } }
