import { z } from "zod";

export const productSchema = z
  .object({
    type: z.enum(["Animal", "Accessory"], {
      message: "Please select a product type.",
    }),

    name: z
      .string()
      .trim()
      .min(2, "Product name must contain at least 2 characters."),

    mainCategory: z.enum(["Animals", "Accessories"], {
      message: "Please select a main category.",
    }),

    subCategory: z
      .string()
      .trim()
      .min(1, "Please select a sub category."),

    sku: z
      .string()
      .trim()
      .min(1, "SKU is required."),

    slug: z
      .string()
      .trim()
      .min(1, "Slug is required."),

    regularPrice: z
      .number({
        message: "Regular price is required.",
      })
      .positive("Regular price must be greater than 0."),

    salePrice: z
      .number()
      .positive("Sale price must be greater than 0.")
      .optional(),

    quantity: z
      .number({
        message: "Quantity is required.",
      })
      .int("Quantity must be a whole number.")
      .min(0, "Quantity cannot be negative."),

    status: z.enum(["Draft", "Active", "Inactive"]),

    isFeatured: z.boolean(),

    shortDescription: z
      .string()
      .trim()
      .min(
        10,
        "Short description must contain at least 10 characters."
      ),

    description: z
      .string()
      .trim()
      .min(
        20,
        "Description must contain at least 20 characters."
      ),

    gender: z
      .enum(["Male", "Female", "Unknown"])
      .optional(),

    age: z
      .string()
      .trim()
      .optional(),

    color: z
      .string()
      .trim()
      .optional(),

    brand: z
      .string()
      .trim()
      .optional(),

    size: z
      .string()
      .trim()
      .optional(),

    compatibility: z
      .string()
      .trim()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.salePrice !== undefined &&
      data.salePrice >= data.regularPrice
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salePrice"],
        message:
          "Sale price must be lower than the regular price.",
      });
    }

    if (data.type === "Animal") {
      if (!data.gender) {
        ctx.addIssue({
          code: "custom",
          path: ["gender"],
          message: "Gender is required for animals.",
        });
      }

      if (!data.age) {
        ctx.addIssue({
          code: "custom",
          path: ["age"],
          message: "Age is required for animals.",
        });
      }

      if (!data.color) {
        ctx.addIssue({
          code: "custom",
          path: ["color"],
          message: "Color is required for animals.",
        });
      }
    }

    if (data.type === "Accessory") {
      if (!data.size) {
        ctx.addIssue({
          code: "custom",
          path: ["size"],
          message: "Size is required for accessories.",
        });
      }

      if (!data.compatibility) {
        ctx.addIssue({
          code: "custom",
          path: ["compatibility"],
          message:
            "Compatibility is required for accessories.",
        });
      }
    }
  });

export type ProductFormValues = z.infer<
  typeof productSchema
>;

export const productApiSchema = productSchema.extend({
  images: z.array(z.string().trim().min(1)).min(1, "At least one product image is required.").max(5),
});

export type ProductApiValues = z.infer<typeof productApiSchema>;
