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
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

type Category = {
  id: number;
  name: string;
  slug: string;
  type: "Animal" | "Accessory";
  status: "Active" | "Inactive";
  items: number;
};

const categories: Category[] = [
  {
    id: 1,
    name: "Chinchillas",
    slug: "chinchillas",
    type: "Animal",
    status: "Active",
    items: 18,
  },
  {
    id: 2,
    name: "Guinea Pigs",
    slug: "guinea-pigs",
    type: "Animal",
    status: "Active",
    items: 14,
  },
  {
    id: 3,
    name: "Micro Squirrels",
    slug: "micro-squirrels",
    type: "Animal",
    status: "Active",
    items: 9,
  },
  {
    id: 4,
    name: "Housing & Cages",
    slug: "housing-cages",
    type: "Accessory",
    status: "Active",
    items: 11,
  },
  {
    id: 5,
    name: "Food & Nutrition",
    slug: "food-nutrition",
    type: "Accessory",
    status: "Active",
    items: 8,
  },
  {
    id: 6,
    name: "Bedding",
    slug: "bedding",
    type: "Accessory",
    status: "Active",
    items: 6,
  },
  {
    id: 7,
    name: "Toys",
    slug: "toys",
    type: "Accessory",
    status: "Active",
    items: 13,
  },
  {
    id: 8,
    name: "Grooming",
    slug: "grooming",
    type: "Accessory",
    status: "Inactive",
    items: 4,
  },
  {
    id: 9,
    name: "Travel",
    slug: "travel",
    type: "Accessory",
    status: "Active",
    items: 7,
  },
  {
    id: 10,
    name: "Treats",
    slug: "treats",
    type: "Accessory",
    status: "Active",
    items: 15,
  },
  {
    id: 11,
    name: "Water Bottles",
    slug: "water-bottles",
    type: "Accessory",
    status: "Active",
    items: 5,
  },
  {
    id: 12,
    name: "Hideouts",
    slug: "hideouts",
    type: "Accessory",
    status: "Active",
    items: 8,
  },
];

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
  }, [search, status, type]);

  const totalPages = Math.ceil(
    filteredCategories.length / pageSize
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, type]);

  const handleDelete = async () => {
    if (!deleteCategory) return;

    const categoryName = deleteCategory.name;

    console.log("Delete category:", deleteCategory.id);

    setDeleteCategory(null);
    setSuccessMessage(
      `"${categoryName}" deleted successfully.`
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Manage animal and accessory categories."
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

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <Input
            type="search"
            placeholder="Search categories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            leftIcon={
              <Search className="h-5 w-5" />
            }
          />

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Types
            </option>

            <option value="animal">
              Animal
            </option>

            <option value="accessory">
              Accessory
            </option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
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

      {filteredCategories.length === 0 ? (
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