"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
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
import { deleteProduct as deleteProductRequest, getProducts, type ProductResponse } from "@/lib/api/products";
import { getErrorMessage } from "@/lib/api/error-message";

type ProductType = "Animal" | "Accessory";

type Product = {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  price: number;
  quantity: number;
  status: "Draft" | "Active" | "Inactive";
};

function toListProduct(product: ProductResponse): Product {
  return { id: product.id, name: product.name, type: product.type, category: product.category.name, price: Number(product.salePrice ?? product.regularPrice), quantity: product.quantity, status: product.status };
}

const pageSize = 6;
const lowStockThreshold = 2;

export default function ProductsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [mainCategory, setMainCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteProduct, setDeleteProduct] =
    useState<Product | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((result) => setProducts(result.map(toListProduct)))
      .catch((error) => setFormError(getErrorMessage(error, "Unable to load products.")))
      .finally(() => setIsLoading(false));
  }, []);

  const subCategories = useMemo(() => {
    const filtered =
      mainCategory === "all"
        ? products
        : products.filter(
            (product) =>
              product.type.toLowerCase() === mainCategory
          );

    return [
      ...new Set(
        filtered.map((product) => product.category)
      ),
    ];
  }, [mainCategory, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.type.toLowerCase().includes(searchValue);

      const matchesMainCategory =
        mainCategory === "all" ||
        product.type.toLowerCase() === mainCategory;

      const matchesSubCategory =
        subCategory === "all" ||
        product.category === subCategory;

      const matchesStatus =
        status === "all" ||
        product.status.toLowerCase() === status;

      let matchesStock = true;

      if (stock === "in-stock") {
        matchesStock =
          product.quantity > lowStockThreshold;
      }

      if (stock === "low-stock") {
        matchesStock =
          product.quantity > 0 &&
          product.quantity <= lowStockThreshold;
      }

      if (stock === "out-of-stock") {
        matchesStock = product.quantity === 0;
      }

      return (
        matchesSearch &&
        matchesMainCategory &&
        matchesSubCategory &&
        matchesStatus &&
        matchesStock
      );
    });
  }, [
    search,
    mainCategory,
    subCategory,
    stock,
    status,
    products,
  ]);

  const totalPages = Math.ceil(
    filteredProducts.length / pageSize
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async () => {
    if (!deleteProduct) return;

    const productName = deleteProduct.name;

    try { await deleteProductRequest(deleteProduct.id); setProducts((current) => current.filter((product) => product.id !== deleteProduct.id)); setDeleteProduct(null); setSuccessMessage(`"${productName}" deleted successfully.`); }
    catch (error) { setFormError(getErrorMessage(error, "Unable to delete product.")); }
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return (
        <span className="rounded-full bg-[var(--error-background)] px-3 py-1 text-xs font-medium text-error">
          Out of Stock
        </span>
      );
    }

    if (quantity <= lowStockThreshold) {
      return (
        <span className="rounded-full bg-[var(--warning-background)] px-3 py-1 text-xs font-medium text-warning">
          {quantity} left
        </span>
      );
    }

    return (
      <span className="rounded-full bg-[var(--success-background)] px-3 py-1 text-xs font-medium text-success">
        {quantity} in stock
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Manage animals and accessories in one place."
        action={
          <Button
            variant="primary"
            onClick={() =>
              router.push("/admin/products/create")
            }
            className="w-fit"
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Plus className="h-5 w-5 shrink-0" />
              <span>Add Product</span>
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

      {formError && <FormAlert variant="error" message={formError} onClose={() => setFormError("")} />}

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_160px_190px_160px_160px]">
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }}
            leftIcon={
              <Search className="h-5 w-5" />
            }
          />

          <select
            value={mainCategory}
            onChange={(event) => { setMainCategory(event.target.value); setSubCategory("all"); setCurrentPage(1); }}
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Products
            </option>

            <option value="animal">
              Animals
            </option>

            <option value="accessory">
              Accessories
            </option>
          </select>

          <select
            value={subCategory}
            onChange={(event) => { setSubCategory(event.target.value); setCurrentPage(1); }}
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Categories
            </option>

            {subCategories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          <select
            value={stock}
            onChange={(event) => { setStock(event.target.value); setCurrentPage(1); }}
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Stock
            </option>

            <option value="in-stock">
              In Stock
            </option>

            <option value="low-stock">
              Low Stock
            </option>

            <option value="out-of-stock">
              Out of Stock
            </option>
          </select>

          <select
            value={status}
            onChange={(event) => { setStatus(event.target.value); setCurrentPage(1); }}
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
        <AdminPageLoader label="Loading products..." />
      ) : filteredProducts.length === 0 ? (
        <AdminEmptyState
          type="search"
          title="No products found"
          description="Try changing your search or filters."
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Product
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Type
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Category
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Price
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Stock
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
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-border"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-foreground">
                          {product.name}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.type === "Animal"
                              ? "bg-surface-subtle text-primary"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {product.type}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-foreground">
                        {product.category}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-foreground">
                        AED{" "}
                        {product.price.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        {getStockBadge(
                          product.quantity
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.status === "Active"
                              ? "bg-[var(--success-background)] text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title="View"
                            aria-label={`View ${product.name}`}
                            onClick={() =>
                              router.push(
                                `/admin/products/${product.id}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            title="Edit"
                            aria-label={`Edit ${product.name}`}
                            onClick={() =>
                              router.push(
                                `/admin/products/${product.id}/edit`
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="danger"
                            size="icon"
                            title="Delete"
                            aria-label={`Delete ${product.name}`}
                            onClick={() =>
                              setDeleteProduct(product)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </section>

          <div className="space-y-3 md:hidden">
            {paginatedProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-foreground">
                        {product.name}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-surface-subtle px-2.5 py-1 text-xs font-medium text-primary">
                          {product.type}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-[var(--success-background)] text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-surface-subtle p-3">
                      <p className="text-xs text-muted-foreground">
                        Price
                      </p>

                      <p className="mt-1 text-sm font-semibold text-foreground">
                        AED{" "}
                        {product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-lg bg-surface-subtle p-3">
                      <p className="text-xs text-muted-foreground">
                        Stock
                      </p>

                      <div className="mt-1">
                        {getStockBadge(
                          product.quantity
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-border bg-surface-subtle/40 px-4 py-3">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`View ${product.name}`}
                    onClick={() =>
                      router.push(
                        `/admin/products/${product.id}`
                      )
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Edit ${product.name}`}
                    onClick={() =>
                      router.push(
                        `/admin/products/${product.id}/edit`
                      )
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="danger"
                    size="icon"
                    aria-label={`Delete ${product.name}`}
                    onClick={() =>
                      setDeleteProduct(product)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}

            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteProduct)}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        description={
          deleteProduct
            ? `Are you sure you want to delete "${deleteProduct.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Product"
        variant="danger"
      />
    </div>
  );
}
