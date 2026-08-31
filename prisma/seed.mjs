import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL must be configured.");

const prisma = new PrismaClient({ adapter: new PrismaPg(connectionString) });
const categories = [
  ["Chinchillas", "chinchillas", "Animal", 18], ["Guinea Pigs", "guinea-pigs", "Animal", 14], ["Micro Squirrels", "micro-squirrels", "Animal", 9], ["Housing & Cages", "housing-cages", "Accessory", 11], ["Food & Nutrition", "food-nutrition", "Accessory", 8], ["Bedding", "bedding", "Accessory", 6], ["Toys", "toys", "Accessory", 13], ["Grooming", "grooming", "Accessory", 4, false], ["Travel", "travel", "Accessory", 7], ["Treats", "treats", "Accessory", 15], ["Water Bottles", "water-bottles", "Accessory", 5], ["Hideouts", "hideouts", "Accessory", 8],
];

await Promise.all(categories.map(([name, slug, type, items, isActive = true]) => prisma.category.upsert({
  where: { slug },
  update: { name, type, items, isActive },
  create: { name, slug, type, items, isActive },
})));

const seededProducts = [
  ["White Chinchilla", "white-chinchilla", "RC-ANI-000001", "Animal", "Chinchillas", 1450, 8, "/animals/1.png", "Calm white chinchilla raised with attentive care.", "Beautiful white chinchilla with a soft coat and calm temperament.", "Male", "8 months", "White"],
  ["Grey Chinchilla", "grey-chinchilla", "RC-ANI-000002", "Animal", "Chinchillas", 1350, 2, "/animals/2.png", "Friendly grey chinchilla.", "Friendly grey chinchilla with a soft coat and active personality.", "Female", "6 months", "Grey"],
  ["American Guinea Pig", "american-guinea-pig", "RC-ANI-000003", "Animal", "Guinea Pigs", 450, 6, "/animals/3.png", "Healthy social guinea pig.", "A healthy, friendly guinea pig ready for a loving home.", "Male", "7 months", "Brown and white"],
  ["Premium Chinchilla Cage", "premium-chinchilla-cage", "RC-ACC-000001", "Accessory", "Housing & Cages", 650, 12, "/animals/4.png", "Spacious premium habitat.", "A roomy, durable habitat designed for chinchilla comfort.", null, null, null, "Royal Chins", "Large", "Chinchillas"],
  ["Wooden Hideout", "wooden-hideout", "RC-ACC-000002", "Accessory", "Housing & Cages", 120, 4, "/animals/5.png", "Natural wooden shelter.", "A natural wooden shelter that gives small pets a comfortable retreat.", null, null, null, "Royal Chins", "Medium", "Chinchillas, Guinea Pigs"],
];

for (const [name, slug, sku, type, categoryName, regularPrice, quantity, image, shortDescription, description, gender, age, color, brand = null, size = null, compatibility = null] of seededProducts) {
  const category = await prisma.category.findFirstOrThrow({ where: { name: categoryName, type } });
  await prisma.product.upsert({
    where: { slug },
    update: { name, sku, type, status: "Active", regularPrice, quantity, shortDescription, description, gender, age, color, brand, size, compatibility, categoryId: category.id, images: { deleteMany: {}, create: [{ url: image, sortOrder: 0 }] } },
    create: { name, slug, sku, type, status: "Active", regularPrice, quantity, shortDescription, description, gender, age, color, brand, size, compatibility, categoryId: category.id, images: { create: [{ url: image, sortOrder: 0 }] } },
  });
}

const whiteChinchilla = await prisma.product.findUnique({ where: { slug: "white-chinchilla" } });
const cage = await prisma.product.findUnique({ where: { slug: "premium-chinchilla-cage" } });
if (whiteChinchilla && cage) {
  await prisma.order.upsert({
    where: { orderNumber: "RC-1028" },
    update: {},
    create: { orderNumber: "RC-1028", customerName: "Ahmed Daniyal", email: "ahmed@example.com", phone: "+971 50 123 4567", paymentMethod: "Card", paymentStatus: "Paid", orderStatus: "Processing", total: 2100, items: { create: [{ productId: whiteChinchilla.id, productName: whiteChinchilla.name, quantity: 1, unitPrice: 1450 }, { productId: cage.id, productName: cage.name, quantity: 1, unitPrice: 650 }] } },
  });
}
await prisma.$disconnect();
