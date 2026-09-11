import "server-only";

import { CategoryType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CategoryTypeValue = "Animal" | "Accessory";
export type CategoryInput = { name: string; slug?: string; type: CategoryTypeValue; description?: string; imageUrl?: string | null; isActive: boolean };

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

const legacyCategorySelection = { id: true, name: true, slug: true, type: true, description: true, isActive: true, items: true, createdAt: true, updatedAt: true } as const;
const storeCategorySelection = { id: true, name: true, slug: true, type: true, imageUrl: true } as const;
const withNoImage = <T extends object>(category: T) => ({ ...category, imageUrl: null });
function isMissingImageColumn(error: unknown) { return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2022"; }

export async function listCategories() {
  try { return await prisma.category.findMany({ orderBy: { name: "asc" } }); }
  catch (error) {
    if (!isMissingImageColumn(error)) throw error;
    return (await prisma.category.findMany({ select: legacyCategorySelection, orderBy: { name: "asc" } })).map(withNoImage);
  }
}
export async function listStoreCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      select: storeCategorySelection,
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (!isMissingImageColumn(error)) throw error;
    return (await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, type: true },
      orderBy: { name: "asc" },
    })).map(withNoImage);
  }
}
export async function findCategory(id: string) {
  try { return await prisma.category.findUnique({ where: { id } }); }
  catch (error) {
    if (!isMissingImageColumn(error)) throw error;
    const category = await prisma.category.findUnique({ where: { id }, select: legacyCategorySelection });
    return category ? withNoImage(category) : null;
  }
}
export async function createCategory(input: CategoryInput) { const slug = slugify(input.slug || input.name); if (!slug) throw new CategoryStoreError("A valid slug is required.", 400); try { return withNoImage(await prisma.category.create({ data: { name: input.name.trim(), slug, type: input.type as CategoryType, description: input.description?.trim() ?? "", ...(input.imageUrl?.trim() ? { imageUrl: input.imageUrl.trim() } : {}), isActive: input.isActive }, select: legacyCategorySelection })); } catch (error) { if (isUniqueError(error)) throw new CategoryStoreError("A category with this slug already exists.", 409); if (isMissingImageColumn(error)) throw new CategoryStoreError("Category images will be available once the database migration is applied.", 503); throw error; } }
export async function updateCategory(id: string, input: Partial<CategoryInput>) { const existing = await findCategory(id); if (!existing) return null; const slug = input.slug === undefined && input.name === undefined ? existing.slug : slugify(input.slug || input.name || existing.name); if (!slug) throw new CategoryStoreError("A valid slug is required.", 400); try { return withNoImage(await prisma.category.update({ where: { id }, data: { ...(input.name !== undefined ? { name: input.name.trim() } : {}), ...(input.type !== undefined ? { type: input.type as CategoryType } : {}), ...(input.description !== undefined ? { description: input.description.trim() } : {}), ...(input.imageUrl?.trim() ? { imageUrl: input.imageUrl.trim() } : {}), ...(input.isActive !== undefined ? { isActive: input.isActive } : {}), slug }, select: legacyCategorySelection })); } catch (error) { if (isUniqueError(error)) throw new CategoryStoreError("A category with this slug already exists.", 409); if (isMissingImageColumn(error)) throw new CategoryStoreError("Category images will be available once the database migration is applied.", 503); throw error; } }
export async function removeCategory(id: string) { const category = await findCategory(id); if (!category) return null; if (category.items > 0) throw new CategoryStoreError("This category still has products. Move or delete those products before removing it.", 409); await prisma.category.delete({ where: { id } }); return category; }
function isUniqueError(error: unknown) { return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002"; }
export class CategoryStoreError extends Error { constructor(message: string, public status: number) { super(message); } }
