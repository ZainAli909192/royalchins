"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Save,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormAlert } from "@/components/forms/form-alert";
import { SubmitButton } from "@/components/forms/submit-button";

import {
  productSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import { getProduct, updateProduct } from "@/lib/api/products";
import { getCategories, type CategoryResponse } from "@/lib/api/categories";
import { getErrorMessage } from "@/lib/api/error-message";

const makeSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const makeSku = (type: string) => {
  const prefix = type === "Animal" ? "ANI" : "ACC";
  const number = Date.now().toString().slice(-6);

  return `RC-${prefix}-${number}`;
};

export default function CreateProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      type: "Animal",
      name: "",
      mainCategory: "Animals",
      subCategory: "",
      sku: "",
      slug: "",
      regularPrice: 0,
      salePrice: undefined,
      quantity: 0,
      status: "Draft",
      shortDescription: "",
      description: "",
      gender: undefined,
      age: "",
      color: "",
      brand: "",
      size: "",
      compatibility: "",
    },
    mode: "onTouched",
  });

  const productType = watch("type");
  const productName = watch("name");
  const sku = watch("sku");

  useEffect(() => {
    Promise.all([getCategories(), getProduct(params.id)]).then(([categoryItems, product]) => {
      setCategories(categoryItems.filter((category) => category.isActive));
      setExistingImageUrls(product.images.map((image) => image.url));
      reset({ type: product.type, name: product.name, mainCategory: product.type === "Animal" ? "Animals" : "Accessories", subCategory: product.category.name, sku: product.sku, slug: product.slug, regularPrice: Number(product.regularPrice), salePrice: product.salePrice === null ? undefined : Number(product.salePrice), quantity: product.quantity, status: product.status, shortDescription: product.shortDescription, description: product.description, gender: product.gender as ProductFormValues["gender"], age: product.age ?? "", color: product.color ?? "", brand: product.brand ?? "", size: product.size ?? "", compatibility: product.compatibility ?? "" });
    }).catch((error) => setFormError(getErrorMessage(error, "Unable to load this product.")));
  }, [params.id, reset]);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) => category.type === productType
    );
  }, [categories, productType]);

  useEffect(() => {
    const mainCategory =
      productType === "Animal"
        ? "Animals"
        : "Accessories";

    setValue("mainCategory", mainCategory);
    setValue("subCategory", "");

    if (!sku) {
      setValue("sku", makeSku(productType));
    }
  }, [productType, setValue, sku]);

  const generateSlug = () => {
    setValue(
      "slug",
      makeSlug(productName || ""),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  const generateSku = () => {
    setValue(
      "sku",
      makeSku(productType),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  const handleImages = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setImageError("");

    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    if (!selectedFiles.length) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      setImageError(
        "Only JPG, PNG and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    const largeFile = selectedFiles.find(
      (file) =>
        file.size > 5 * 1024 * 1024
    );

    if (largeFile) {
      setImageError(
        "Each image must be 5MB or smaller."
      );

      event.target.value = "";
      return;
    }

    if (
      existingImageUrls.length + images.length +
        selectedFiles.length >
      5
    ) {
      setImageError(
        "You can upload a maximum of 5 images."
      );

      event.target.value = "";
      return;
    }

    setImages((current) => [
      ...current,
      ...selectedFiles,
    ]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setImageError("");
  };

  const onSubmit = async (
    values: ProductFormValues
  ) => {
    setFormError("");
    setSuccessMessage("");
    setImageError("");

    if (images.length + existingImageUrls.length === 0) {
      setImageError(
        "Please upload at least one product image."
      );
      return;
    }

    try {
      const imageUrls = await Promise.all(images.map((image) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Unable to read an image.")); reader.readAsDataURL(image); })));
      await updateProduct(params.id, { ...values, images: [...existingImageUrls, ...imageUrls] });

      setSuccessMessage(
        "Product created successfully."
      );

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 700);
    } catch (error) {
      setFormError(getErrorMessage(error, "Unable to update product. Please try again."));
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add Product"
        description="Create a new animal or accessory product."
        action={
          <Button
            variant="outline"
            onClick={() =>
              router.push("/admin/products")
            }
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <ArrowLeft className="h-4 w-4" />
              Back
            </span>
          </Button>
        }
      />

      <p className="text-xs text-muted-foreground">
        Fields marked with{" "}
        <span className="font-semibold text-error">
          *
        </span>{" "}
        are required.
      </p>

      {formError && (
        <FormAlert
          variant="error"
          message={formError}
          onClose={() =>
            setFormError("")
          }
        />
      )}

      {successMessage && (
        <FormAlert
          variant="success"
          message={successMessage}
        />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Product Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter the basic information for this product.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Product Type
                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <select
                {...register("type")}
                disabled={isSubmitting}
                className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="Animal">
                  Animal
                </option>

                <option value="Accessory">
                  Accessory
                </option>
              </select>
            </div>

            <Input
              {...register("name")}
              label="Product Name"
              required
              placeholder="Enter product name"
              disabled={isSubmitting}
              error={errors.name?.message}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Category
                <span className="ml-1 text-error">
                  *
                </span>
              </label>

              <select
                {...register("subCategory")}
                disabled={isSubmitting}
                className={`h-12 w-full rounded-lg border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                  errors.subCategory
                    ? "border-error"
                    : "border-border"
                }`}
              >
                <option value="">
                  Select category
                </option>

                {filteredCategories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>

              {errors.subCategory?.message && (
                <p className="mt-1.5 text-sm text-error">
                  {errors.subCategory.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("sku")}
                label="SKU"
                required
                placeholder="RC-ANI-000001"
                disabled={isSubmitting}
                error={errors.sku?.message}
              />

              <button
                type="button"
                onClick={generateSku}
                disabled={isSubmitting}
                className="mt-2 text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate SKU
              </button>
            </div>

            <div>
              <Input
                {...register("slug")}
                label="Slug"
                required
                placeholder="product-name"
                disabled={isSubmitting}
                error={errors.slug?.message}
              />

              <button
                type="button"
                onClick={generateSlug}
                disabled={isSubmitting}
                className="mt-2 text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate from product name
              </button>
            </div>

          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Pricing & Inventory
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage pricing and available stock.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Input
              {...register(
                "regularPrice",
                {
                  setValueAs: (value) =>
                    value === ""
                      ? 0
                      : Number(value),
                }
              )}
              label="Regular Price"
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              helperText="Price in AED"
              disabled={isSubmitting}
              error={
                errors.regularPrice?.message
              }
            />

            <Input
              {...register(
                "salePrice",
                {
                  setValueAs: (value) =>
                    value === ""
                      ? undefined
                      : Number(value),
                }
              )}
              label="Sale Price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Optional"
              helperText="Leave empty if not on sale"
              disabled={isSubmitting}
              error={
                errors.salePrice?.message
              }
            />

            <Input
              {...register(
                "quantity",
                {
                  setValueAs: (value) =>
                    Number(value),
                }
              )}
              label="Quantity"
              required
              type="number"
              min="0"
              step="1"
              placeholder="0"
              helperText="Available stock"
              disabled={isSubmitting}
              error={
                errors.quantity?.message
              }
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Product Details
            </h2>
          </div>

          <div className="space-y-5">
            <Textarea
              {...register("shortDescription")}
              label="Short Description"
              required
              placeholder="Brief product summary"
              rows={3}
              disabled={isSubmitting}
              error={errors.shortDescription?.message}
            />

            <Textarea
              {...register(
                "description"
              )}
              label="Full Description"
              required
              placeholder="Enter full product description"
              rows={7}
              disabled={isSubmitting}
              error={
                errors.description?.message
              }
            />
          </div>
        </section>

        {productType === "Animal" && (
          <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Product Details
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Additional information for this animal.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Gender
                  <span className="ml-1 text-error">
                    *
                  </span>
                </label>

                <select
                  {...register("gender")}
                  disabled={isSubmitting}
                  className={`h-12 w-full rounded-lg border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                    errors.gender
                      ? "border-error"
                      : "border-border"
                  }`}
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Unknown">
                    Unknown
                  </option>
                </select>

                {errors.gender?.message && (
                  <p className="mt-1.5 text-sm text-error">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <Input
                {...register("age")}
                label="Age"
                required
                placeholder="Example: 6 months"
                disabled={isSubmitting}
                error={errors.age?.message}
              />

              <Input
                {...register("color")}
                label="Color"
                required
                placeholder="Example: White"
                disabled={isSubmitting}
                error={
                  errors.color?.message
                }
              />
            </div>
          </section>
        )}

        {productType === "Accessory" && (
          <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Accessory Details
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Additional information for this accessory.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Input
                {...register("brand")}
                label="Brand"
                placeholder="Enter brand name"
                disabled={isSubmitting}
                error={
                  errors.brand?.message
                }
              />

              <Input
                {...register("size")}
                label="Size"
                required
                placeholder="Enter size"
                disabled={isSubmitting}
                error={
                  errors.size?.message
                }
              />

              <Input
                {...register("color")}
                label="Color"
                placeholder="Enter color"
                disabled={isSubmitting}
                error={
                  errors.color?.message
                }
              />

              <Input
                {...register(
                  "compatibility"
                )}
                label="Compatibility"
                required
                placeholder="Example: Chinchillas, Guinea Pigs"
                disabled={isSubmitting}
                error={
                  errors.compatibility?.message
                }
              />
            </div>
          </section>
        )}

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Product Images
            <span className="ml-1 text-error">
              *
            </span>
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Upload up to 5 images. The first image will be the main image.
          </p>

          <div className="mt-5">
            <label
              className={`flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors ${
                imageError
                  ? "border-error bg-[var(--error-background)]"
                  : "border-border hover:border-primary hover:bg-surface-subtle"
              }`}
            >
              <ImagePlus className="h-9 w-9 text-primary" />

              <p className="mt-3 text-sm font-semibold text-foreground">
                Upload product images
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG or WebP · Maximum 5MB each
              </p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImages}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>

            {imageError && (
              <p className="mt-2 text-sm text-error">
                {imageError}
              </p>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {images.map(
                (image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative overflow-hidden rounded-lg border border-border bg-surface-subtle"
                  >
                    <img
                      src={URL.createObjectURL(
                        image
                      )}
                      alt={`Product image ${
                        index + 1
                      }`}
                      className="aspect-square w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-[10px] text-white">
                        Main
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      disabled={isSubmitting}
                      aria-label={`Remove product image ${
                        index + 1
                      }`}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {images.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {images.length}/5 images
            </p>
          )}
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() =>
              router.push("/admin/products")
            }
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <SubmitButton
            loading={isSubmitting}
            loadingText="Saving..."
            fullWidth={false}
            className="w-full sm:w-auto"
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Save className="h-4 w-4" />
              Save Product
            </span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
