import "server-only";

import { CategoryType, Prisma, ProductStatus, ReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ProductApiValues } from "@/lib/validations/product";

export class ProductStoreError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

// Select only fields the product storefront needs. This also keeps existing
// product reads working while a database migration is being rolled out.
const categorySelection = {
  id: true,
  name: true,
  slug: true,
  type: true,
  description: true,
  isActive: true,
  items: true,
  createdAt: true,
  updatedAt: true,
} as const;
const includeProduct = {
  category: { select: categorySelection },
  images: { orderBy: { sortOrder: "asc" as const } },
};
// Public cards intentionally omit descriptions, internal inventory settings,
// timestamps, SKU and secondary media. They are the most frequently requested
// product shape on the storefront.
const storeProductCardSelect = {
  id: true,
  slug: true,
  name: true,
  type: true,
  regularPrice: true,
  salePrice: true,
  quantity: true,
  isFeatured: true,
  isSold: true,
  gender: true,
  age: true,
  shortDescription: true,
  category: { select: { name: true, slug: true } },
  images: { select: { url: true }, orderBy: { sortOrder: "asc" as const }, take: 1 },
} as const;
// Image and video data is saved with the product. Allow enough time for a
// medium video upload to complete before Prisma closes the transaction.
const productTransactionOptions = { maxWait: 10_000, timeout: 30_000 };

function isUniqueError(error: unknown) { return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002"; }

async function categoryFor(input: Pick<ProductApiValues, "subCategory" | "type">) {
  const category = await prisma.category.findFirst({ where: { name: input.subCategory.trim(), type: input.type as CategoryType, isActive: true } });
  if (!category) throw new ProductStoreError("Select an active category that matches the product type.", 400);
  return category;
}

function productData(
  input: ProductApiValues,
  categoryId: string
): Prisma.ProductUncheckedCreateInput {
  return {
    name: input.name.trim(),
    slug: input.slug.trim(),
    sku: input.sku.trim(),
    type: input.type as CategoryType,

    status: input.status as ProductStatus,
    isFeatured: input.isFeatured,

    regularPrice: input.regularPrice,
    salePrice: input.salePrice,

    quantity: input.quantity,

    shortDescription:
      input.shortDescription.trim(),

    description:
      input.description.trim(),

    gender: input.gender || null,
    age: input.age || null,
    color: input.color || null,
    brand: input.brand || null,
    size: input.size || null,
    compatibility:
      input.compatibility || null,

    videoUrl:
      input.videoUrl?.trim() || null,

    categoryId,
  };
}

export async function listProducts() { return prisma.product.findMany({ include: includeProduct, orderBy: { createdAt: "desc" } }); }
export async function listStoreProducts() {
  const inventorySetting = await prisma.storeSetting.findUnique({ where: { key: "inventory" }, select: { value: true } });
  const hideOutOfStock = typeof inventorySetting?.value === "object" && inventorySetting.value !== null && !Array.isArray(inventorySetting.value) && inventorySetting.value.hideOutOfStock === true;
  return prisma.product.findMany({
    where: { status: ProductStatus.Active, ...(hideOutOfStock ? { NOT: { type: "Accessory", quantity: { lte: 0 } } } : {}) },
    select: storeProductCardSelect,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
}
export async function findStoreProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: ProductStatus.Active },
    include: {
      ...includeProduct,
      reviews: { where: { status: ReviewStatus.Approved }, select: { rating: true } },
    },
  });
}
export async function listRelatedStoreProducts(productId: string, type: CategoryType, categoryId: string) {
  return prisma.product.findMany({
    where: { id: { not: productId }, status: ProductStatus.Active, OR: [{ categoryId }, { type }] },
    select: storeProductCardSelect,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 4,
  });
}
export async function findProduct(id: string) { return prisma.product.findUnique({ where: { id }, include: includeProduct }); }

export async function createProduct(input: ProductApiValues) {
  const category = await categoryFor(input);
  try {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.create({ data: { ...productData({ ...input, status: "Active" }, category.id), images: { create: input.images.map((url, sortOrder) => ({ url, sortOrder })) } }, include: includeProduct });
      await tx.category.update({ where: { id: category.id }, data: { items: { increment: 1 } } });
      return product;
    }, productTransactionOptions);
  } catch (error) { if (isUniqueError(error)) throw new ProductStoreError("A product with this SKU or slug already exists.", 409); throw error; }
}

export async function updateProduct(id: string, input: ProductApiValues) {
  const existing = await findProduct(id); if (!existing) return null;
  const category = await categoryFor(input);
  try {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.update({ where: { id }, data: { ...productData(input, category.id), images: { deleteMany: {}, create: input.images.map((url, sortOrder) => ({ url, sortOrder })) } }, include: includeProduct });
      if (existing.categoryId !== category.id) { await tx.category.update({ where: { id: existing.categoryId }, data: { items: { decrement: 1 } } }); await tx.category.update({ where: { id: category.id }, data: { items: { increment: 1 } } }); }
      return product;
    }, productTransactionOptions);
  } catch (error) { if (isUniqueError(error)) throw new ProductStoreError("A product with this SKU or slug already exists.", 409); throw error; }
}

export async function removeProduct(id: string) {
  const product = await findProduct(id); if (!product) return null;
  await prisma.$transaction([prisma.product.delete({ where: { id } }), prisma.category.update({ where: { id: product.categoryId }, data: { items: { decrement: 1 } } })]);
  return product;
}
