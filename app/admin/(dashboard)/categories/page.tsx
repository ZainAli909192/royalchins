"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { deleteCategory as deleteCategoryRequest, getCategories } from "@/lib/api/categories";
import { getErrorMessage } from "@/lib/utils/errors";

type Category = {
  id: string;
  name: string;
  slug: string;
  type: "Animal" | "Accessory";
  status: "Active" | "Inactive";
  items: number;
};

const pageSize = 10;

export default function CategoriesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          type: category.type,
          status: category.isActive ? "Active" : "Inactive",
          items: category.items,
        })));
      } catch (error) {
        setFormError(getErrorMessage(error, "Unable to load categories."));
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        category.name.toLowerCase().includes(searchValue) ||
        category.slug.toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "all" ||
        category.status.toLowerCase() === status;

      const matchesType =
        type === "all" ||
        category.type.toLowerCase() === type;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [categories, search, status, type]);

  const totalPages = Math.ceil(
    filteredCategories.length / pageSize
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      const response = await deleteCategoryRequest(deleteCategory.id);
      setCategories((current) => current.filter((category) => category.id !== deleteCategory.id));
      setSuccessMessage(response.message);
      setDeleteCategory(null);
    } catch (error) {
      setFormError(getErrorMessage(error, "Unable to delete category."));
      setDeleteCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Manage pet and accessory categories."
        action={
          <Button
            variant="primary"
            onClick={() =>
              router.push("/admin/categories/create")
            }
            className="w-fit"
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Plus className="h-5 w-5 shrink-0" />
              <span>Add Category</span>
            </span>
          </Button>
        }
      />

      {successMessage && (
        <FormAlert
          variant="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {formError && (
        <FormAlert
          variant="error"
          message={formError}
          onClose={() => setFormError("")}
        />
      )}

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <Input
            type="search"
            placeholder="Search categories..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            leftIcon={
              <Search className="h-5 w-5" />
            }
          />

          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              setCurrentPage(1);
            }}
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Types
            </option>

            <option value="animal">
              Pet
            </option>

            <option value="accessory">
              Accessory
            </option>
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setCurrentPage(1);
            }}
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>
      </section>

      {isLoading ? (
        <AdminPageLoader label="Loading categories..." />
      ) : filteredCategories.length === 0 ? (
        <AdminEmptyState
          type="search"
          title="No categories found"
          description="Try changing your search or filters."
        />
      ) : (
        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-surface-subtle">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Category
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Slug
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Type
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Items
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedCategories.map(
                  (category) => (
                    <tr
                      key={category.id}
                      className="border-t border-border"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-foreground">
                          {category.name}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {category.slug}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-medium text-primary">
                          {category.type}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-foreground">
                        {category.items}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            category.status ===
                            "Active"
                              ? "bg-[var(--success-background)] text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {category.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title="Edit"
                            aria-label={`Edit ${category.name}`}
                            onClick={() =>
                              router.push(
                                `/admin/categories/${category.id}/edit`
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="danger"
                            size="icon"
                            title="Delete"
                            aria-label={`Delete ${category.name}`}
                            onClick={() =>
                              setDeleteCategory(
                                category
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={
              filteredCategories.length
            }
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </section>
      )}

      <ConfirmDialog
        open={Boolean(deleteCategory)}
        onClose={() =>
          setDeleteCategory(null)
        }
        onConfirm={handleDelete}
        title="Delete Category?"
        description={
          deleteCategory
            ? `Are you sure you want to delete "${deleteCategory.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Category"
        variant="danger"
      />
    </div>
  );
}
