"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormAlert } from "@/components/forms/form-alert";
import { SubmitButton } from "@/components/forms/submit-button";

import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/validations/category";

import { createCategory } from "@/lib/api/categories";
import { getErrorMessage } from "@/lib/utils/errors";
import { slugify } from "@/lib/utils/slug";

export default function CreateCategoryPage() {
  const router = useRouter();

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "Animal",
      description: "",
      isActive: true,
    },
    mode: "onTouched",
  });

  const categoryName = watch("name");

  const handleGenerateSlug = () => {
    setValue("slug", slugify(categoryName || ""), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (values: CategoryFormValues) => {
    setFormError("");
    setSuccessMessage("");

    try {
      await createCategory(values);

      setSuccessMessage("Category created successfully.");

      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 700);
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "Unable to create category. Please try again."
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add Category"
        description="Create a new pet or accessory category."
        action={
          <Button
            variant="outline"
            onClick={() => router.push("/admin/categories")}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </span>
          </Button>
        }
      />

      {formError && (
        <FormAlert
          variant="error"
          message={formError}
          onClose={() => setFormError("")}
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
          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              {...register("name")}
              label="Category Name"
              placeholder="Enter category name"
              disabled={isSubmitting}
              error={errors.name?.message}
            />

            <div>
              <Input
                {...register("slug")}
                label="Slug"
                placeholder="category-slug"
                disabled={isSubmitting}
                error={errors.slug?.message}
              />

              <button
                type="button"
                onClick={handleGenerateSlug}
                disabled={isSubmitting}
                className="mt-2 text-sm font-medium text-primary hover:underline"
              >
                Generate from category name
              </button>
            </div>

            <div className="w-full">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Category Type
              </label>

              <select
                {...register("type")}
                disabled={isSubmitting}
                className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="Animal">Pet</option>
                <option value="Accessory">Accessory</option>
              </select>

              {errors.type?.message && (
                <p className="mt-1.5 text-sm text-error">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Status
              </label>

              <select
                {...register("isActive", {
                  setValueAs: (value) => value === "true",
                })}
                disabled={isSubmitting}
                className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

        
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/admin/categories")}
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
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Category
            </span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
