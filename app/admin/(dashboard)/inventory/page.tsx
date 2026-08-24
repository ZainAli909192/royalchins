"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  PackageX,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/ui/pagination";

type ProductType = "Animal" | "Accessory";

type StockAction =
  | "add"
  | "remove"
  | "set"
  | "threshold";

type InventoryItem = {
  id: number;
  name: string;
  sku: string;
  type: ProductType;
  category: string;
  quantity: number;
  lowStockThreshold: number;
  updatedAt: string;
};

const initialInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "White Chinchilla",
    sku: "RC-ANI-000001",
    type: "Animal",
    category: "Chinchillas",
    quantity: 8,
    lowStockThreshold: 2,
    updatedAt: "24 Aug 2026 10:30 AM",
  },
  {
    id: 2,
    name: "Grey Chinchilla",
    sku: "RC-ANI-000002",
    type: "Animal",
    category: "Chinchillas",
    quantity: 2,
    lowStockThreshold: 2,
    updatedAt: "24 Aug 2026 09:15 AM",
  },
  {
    id: 3,
    name: "American Guinea Pig",
    sku: "RC-ANI-000003",
    type: "Animal",
    category: "Guinea Pigs",
    quantity: 6,
    lowStockThreshold: 2,
    updatedAt: "23 Aug 2026 04:45 PM",
  },
  {
    id: 4,
    name: "Micro Squirrel",
    sku: "RC-ANI-000004",
    type: "Animal",
    category: "Micro Squirrels",
    quantity: 0,
    lowStockThreshold: 2,
    updatedAt: "22 Aug 2026 11:20 AM",
  },
  {
    id: 5,
    name: "Premium Chinchilla Cage",
    sku: "RC-ACC-000005",
    type: "Accessory",
    category: "Housing & Cages",
    quantity: 12,
    lowStockThreshold: 3,
    updatedAt: "24 Aug 2026 08:50 AM",
  },
  {
    id: 6,
    name: "Wooden Hideout",
    sku: "RC-ACC-000006",
    type: "Accessory",
    category: "Housing & Cages",
    quantity: 3,
    lowStockThreshold: 3,
    updatedAt: "24 Aug 2026 08:20 AM",
  },
  {
    id: 7,
    name: "Premium Animal Bedding",
    sku: "RC-ACC-000007",
    type: "Accessory",
    category: "Bedding",
    quantity: 15,
    lowStockThreshold: 4,
    updatedAt: "21 Aug 2026 02:10 PM",
  },
  {
    id: 8,
    name: "Water Bottle",
    sku: "RC-ACC-000008",
    type: "Accessory",
    category: "Water Bottles",
    quantity: 1,
    lowStockThreshold: 3,
    updatedAt: "24 Aug 2026 07:55 AM",
  },
  {
    id: 9,
    name: "Nutrition Mix",
    sku: "RC-ACC-000009",
    type: "Accessory",
    category: "Food & Nutrition",
    quantity: 10,
    lowStockThreshold: 3,
    updatedAt: "23 Aug 2026 03:15 PM",
  },
];

const pageSize = 6;

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] =
    useState(initialInventoryItems);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [stockStatus, setStockStatus] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

  const [bulkAction, setBulkAction] =
    useState<StockAction | "">("");

  const [selectedProduct, setSelectedProduct] =
    useState<InventoryItem | null>(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [dialogAction, setDialogAction] =
    useState<StockAction>("add");

  const [quantity, setQuantity] =
    useState("");

  const [reason, setReason] =
    useState("new-stock");

  const [notes, setNotes] =
    useState("");

  const [dialogError, setDialogError] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const categories = useMemo(() => {
    const items =
      type === "all"
        ? inventoryItems
        : inventoryItems.filter(
            (item) =>
              item.type.toLowerCase() === type
          );

    return [
      ...new Set(
        items.map((item) => item.category)
      ),
    ];
  }, [type, inventoryItems]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(searchValue) ||
        item.sku
          .toLowerCase()
          .includes(searchValue) ||
        item.category
          .toLowerCase()
          .includes(searchValue);

      const matchesType =
        type === "all" ||
        item.type.toLowerCase() === type;

      const matchesCategory =
        category === "all" ||
        item.category === category;

      let matchesStock = true;

      if (stockStatus === "in-stock") {
        matchesStock =
          item.quantity >
          item.lowStockThreshold;
      }

      if (stockStatus === "low-stock") {
        matchesStock =
          item.quantity > 0 &&
          item.quantity <=
            item.lowStockThreshold;
      }

      if (
        stockStatus === "out-of-stock"
      ) {
        matchesStock =
          item.quantity === 0;
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [
    inventoryItems,
    search,
    type,
    category,
    stockStatus,
  ]);

  const totalPages = Math.ceil(
    filteredItems.length / pageSize
  );

  const paginatedItems =
    filteredItems.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  const allCurrentPageSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) =>
      selectedIds.includes(item.id)
    );

  const totalProducts =
    inventoryItems.length;

  const inStockCount =
    inventoryItems.filter(
      (item) =>
        item.quantity >
        item.lowStockThreshold
    ).length;

  const lowStockCount =
    inventoryItems.filter(
      (item) =>
        item.quantity > 0 &&
        item.quantity <=
          item.lowStockThreshold
    ).length;

  const outOfStockCount =
    inventoryItems.filter(
      (item) =>
        item.quantity === 0
    ).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    type,
    category,
    stockStatus,
  ]);

  useEffect(() => {
    setCategory("all");
  }, [type]);

  const toggleItem = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter(
            (itemId) =>
              itemId !== id
          )
        : [...current, id]
    );
  };

  const toggleCurrentPage = () => {
    const pageIds =
      paginatedItems.map(
        (item) => item.id
      );

    if (allCurrentPageSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) =>
            !pageIds.includes(id)
        )
      );

      return;
    }

    setSelectedIds((current) => [
      ...new Set([
        ...current,
        ...pageIds,
      ]),
    ]);
  };

  const resetFilters = () => {
    setSearch("");
    setType("all");
    setCategory("all");
    setStockStatus("all");
  };

  const getStockStatus = (
    item: InventoryItem
  ) => {
    if (item.quantity === 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-[var(--error-background)] text-error",
      };
    }

    if (
      item.quantity <=
      item.lowStockThreshold
    ) {
      return {
        label: "Low Stock",
        className:
          "bg-[var(--warning-background)] text-warning",
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-[var(--success-background)] text-success",
    };
  };

  const resetDialog = () => {
    setQuantity("");
    setReason("new-stock");
    setNotes("");
    setDialogError("");
    setUpdating(false);
  };

  const openSingleUpdate = (
    item: InventoryItem
  ) => {
    resetDialog();

    setSelectedProduct(item);
    setDialogAction("add");
    setDialogOpen(true);
  };

  const openBulkUpdate = () => {
    if (!selectedIds.length) return;
    if (!bulkAction) return;

    resetDialog();

    setSelectedProduct(null);
    setDialogAction(bulkAction);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (updating) return;

    setDialogOpen(false);
    setSelectedProduct(null);
    resetDialog();
  };

  const handleUpdateStock = async () => {
    setDialogError("");

    const value = Number(quantity);

    if (
      quantity.trim() === "" ||
      Number.isNaN(value)
    ) {
      setDialogError(
        "Please enter a quantity."
      );
      return;
    }

    if (!Number.isInteger(value)) {
      setDialogError(
        "Quantity must be a whole number."
      );
      return;
    }

    if (value < 0) {
      setDialogError(
        "Quantity cannot be negative."
      );
      return;
    }

    if (
      (dialogAction === "add" ||
        dialogAction === "remove") &&
      value === 0
    ) {
      setDialogError(
        "Quantity must be greater than 0."
      );
      return;
    }

    const ids = selectedProduct
      ? [selectedProduct.id]
      : selectedIds;

    if (!ids.length) return;

    try {
      setUpdating(true);

      setInventoryItems((current) =>
        current.map((item) => {
          if (!ids.includes(item.id)) {
            return item;
          }

          if (
            dialogAction === "threshold"
          ) {
            return {
              ...item,
              lowStockThreshold: value,
              updatedAt: "Just now",
            };
          }

          let nextQuantity =
            item.quantity;

          if (dialogAction === "add") {
            nextQuantity =
              item.quantity + value;
          }

          if (
            dialogAction === "remove"
          ) {
            nextQuantity = Math.max(
              0,
              item.quantity - value
            );
          }

          if (dialogAction === "set") {
            nextQuantity = value;
          }

          return {
            ...item,
            quantity: nextQuantity,
            updatedAt: "Just now",
          };
        })
      );

      const payload = {
        ids,
        action: dialogAction,
        quantity: value,
        reason,
        notes,
      };

      console.log(
        "Update inventory:",
        payload
      );

      setSuccessMessage(
        selectedProduct
          ? `${selectedProduct.name} stock updated successfully.`
          : `${ids.length} products updated successfully.`
      );

      setSelectedIds([]);
      setBulkAction("");
      setSelectedProduct(null);
      setDialogOpen(false);
      resetDialog();
    } catch {
      setDialogError(
        "Unable to update stock. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  const getDialogQuantityLabel = () => {
    if (
      dialogAction === "threshold"
    ) {
      return "Low Stock Threshold";
    }

    if (dialogAction === "set") {
      return "New Quantity";
    }

    return "Quantity";
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inventory"
        description="Manage product stock levels and inventory."
      />

      {successMessage && (
        <FormAlert
          variant="success"
          message={successMessage}
          onClose={() =>
            setSuccessMessage("")
          }
        />
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-subtle text-primary">
              <Boxes className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Products
              </p>

              <p className="mt-1 text-2xl font-bold text-foreground">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--success-background)] text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                In Stock
              </p>

              <p className="mt-1 text-2xl font-bold text-success">
                {inStockCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--warning-background)] text-warning">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Low Stock
              </p>

              <p className="mt-1 text-2xl font-bold text-warning">
                {lowStockCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--error-background)] text-error">
              <PackageX className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Out of Stock
              </p>

              <p className="mt-1 text-2xl font-bold text-error">
                {outOfStockCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_160px_190px_180px_auto]">
          <Input
            type="search"
            placeholder="Search by product name, SKU..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            leftIcon={
              <Search className="h-5 w-5" />
            }
          />

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value
              )
            }
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Types
            </option>

            <option value="animal">
              Animals
            </option>

            <option value="accessory">
              Accessories
            </option>
          </select>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={stockStatus}
            onChange={(event) =>
              setStockStatus(
                event.target.value
              )
            }
            className="h-12 rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All Stock Status
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

          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            className="w-full xl:w-auto"
          >
            Reset
          </Button>
        </div>
      </section>

      {filteredItems.length === 0 ? (
        <AdminEmptyState
          type="search"
          title="No inventory items found"
          description="Try changing your search or filters."
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-sm md:block">
            <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    allCurrentPageSelected
                  }
                  onChange={
                    toggleCurrentPage
                  }
                  className="h-4 w-4 accent-[var(--primary)]"
                />

                <span className="text-sm font-medium text-foreground">
                  {selectedIds.length} selected
                </span>
              </div>

              <select
                value={bulkAction}
                onChange={(event) =>
                  setBulkAction(
                    event.target
                      .value as
                      | StockAction
                      | ""
                  )
                }
                disabled={
                  selectedIds.length === 0
                }
                className="h-10 rounded-lg border border-border bg-white px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  Bulk Actions
                </option>

                <option value="add">
                  Add Stock
                </option>

                <option value="remove">
                  Remove Stock
                </option>

                <option value="set">
                  Set Exact Quantity
                </option>

                <option value="threshold">
                  Update Low Stock Threshold
                </option>
              </select>

              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={
                  !bulkAction ||
                  selectedIds.length === 0
                }
                onClick={
                  openBulkUpdate
                }
              >
                Apply
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="w-14 px-5 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          allCurrentPageSelected
                        }
                        onChange={
                          toggleCurrentPage
                        }
                        className="h-4 w-4 accent-[var(--primary)]"
                      />
                    </th>

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
                      Stock
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Low Stock Threshold
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Last Updated
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedItems.map(
                    (item) => {
                      const stock =
                        getStockStatus(
                          item
                        );

                      const selected =
                        selectedIds.includes(
                          item.id
                        );

                      return (
                        <tr
                          key={item.id}
                          className={`border-t border-border ${
                            selected
                              ? "bg-surface-subtle/50"
                              : ""
                          }`}
                        >
                          <td className="px-5 py-4">
                            <input
                              type="checkbox"
                              checked={
                                selected
                              }
                              onChange={() =>
                                toggleItem(
                                  item.id
                                )
                              }
                              className="h-4 w-4 accent-[var(--primary)]"
                            />
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-foreground">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.sku}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-medium text-primary">
                              {item.type}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-foreground">
                            {item.category}
                          </td>

                          <td className="px-5 py-4 text-sm font-bold text-foreground">
                            {item.quantity}
                          </td>

                          <td className="px-5 py-4 text-sm text-foreground">
                            {item.lowStockThreshold}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${stock.className}`}
                            >
                              {stock.label}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {item.updatedAt}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                title="Update Stock"
                                aria-label={`Update stock for ${item.name}`}
                                onClick={() =>
                                  openSingleUpdate(
                                    item
                                  )
                                }
                              >
                                <span className="flex items-center gap-2 whitespace-nowrap">
                                  <SlidersHorizontal className="h-4 w-4" />
                                  Update Stock
                                </span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={
                currentPage
              }
              totalPages={totalPages}
              totalItems={
                filteredItems.length
              }
              pageSize={pageSize}
              onPageChange={
                setCurrentPage
              }
            />
          </section>

          <div className="space-y-3 md:hidden">
            {selectedIds.length > 0 && (
              <div className="sticky top-[84px] z-20 rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  {selectedIds.length} selected
                </p>

                <div className="grid gap-2">
                  <select
                    value={bulkAction}
                    onChange={(event) =>
                      setBulkAction(
                        event.target
                          .value as
                          | StockAction
                          | ""
                      )
                    }
                    className="h-11 rounded-lg border border-border bg-white px-3 text-sm"
                  >
                    <option value="">
                      Bulk Actions
                    </option>

                    <option value="add">
                      Add Stock
                    </option>

                    <option value="remove">
                      Remove Stock
                    </option>

                    <option value="set">
                      Set Exact Quantity
                    </option>

                    <option value="threshold">
                      Update Low Stock Threshold
                    </option>
                  </select>

                  <Button
                    variant="primary"
                    disabled={
                      !bulkAction
                    }
                    onClick={
                      openBulkUpdate
                    }
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}

            {paginatedItems.map(
              (item) => {
                const stock =
                  getStockStatus(
                    item
                  );

                const selected =
                  selectedIds.includes(
                    item.id
                  );

                return (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
                      selected
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={
                            selected
                          }
                          onChange={() =>
                            toggleItem(
                              item.id
                            )
                          }
                          className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="truncate text-base font-semibold text-foreground">
                                {item.name}
                              </h2>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.sku}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${stock.className}`}
                            >
                              {stock.label}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-surface-subtle px-2.5 py-1 text-xs font-medium text-primary">
                              {item.type}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {item.category}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-surface-subtle p-3">
                              <p className="text-xs text-muted-foreground">
                                Stock
                              </p>

                              <p className="mt-1 text-lg font-bold text-foreground">
                                {item.quantity}
                              </p>
                            </div>

                            <div className="rounded-lg bg-surface-subtle p-3">
                              <p className="text-xs text-muted-foreground">
                                Low Stock At
                              </p>

                              <p className="mt-1 text-lg font-bold text-foreground">
                                {item.lowStockThreshold}
                              </p>
                            </div>
                          </div>

                          <p className="mt-3 text-xs text-muted-foreground">
                            Updated:{" "}
                            {item.updatedAt}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border bg-surface-subtle/40 px-4 py-3">
                      <Button
                        variant="primary"
                        onClick={() =>
                          openSingleUpdate(
                            item
                          )
                        }
                        className="w-full"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <SlidersHorizontal className="h-4 w-4" />
                          Update Stock
                        </span>
                      </Button>
                    </div>
                  </article>
                );
              }
            )}

            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <Pagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                totalItems={
                  filteredItems.length
                }
                pageSize={
                  pageSize
                }
                onPageChange={
                  setCurrentPage
                }
              />
            </div>
          </div>
        </>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            onClick={closeDialog}
            className="absolute inset-0 bg-black/45"
            aria-label="Close stock update"
          />

          <div className="relative z-10 max-h-[calc(100dvh-32px)] w-full max-w-[540px] overflow-y-auto rounded-2xl border border-border bg-white shadow-xl sm:max-h-[calc(100dvh-48px)]">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {selectedProduct
                    ? "Update Stock"
                    : "Bulk Stock Update"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update inventory quantity.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDialog}
                disabled={updating}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {selectedProduct ? (
                <div className="rounded-xl bg-surface-subtle p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {selectedProduct.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {selectedProduct.sku}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Current Stock
                      </p>

                      <p className="mt-1 text-xl font-bold text-foreground">
                        {selectedProduct.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-surface-subtle p-4">
                  <p className="text-sm font-semibold text-primary">
                    {selectedIds.length}{" "}
                    {selectedIds.length === 1
                      ? "product selected"
                      : "products selected"}
                  </p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Action
                  <span className="ml-1 text-error">
                    *
                  </span>
                </label>

                <select
                  value={dialogAction}
                  onChange={(event) =>
                    setDialogAction(
                      event.target
                        .value as StockAction
                    )
                  }
                  disabled={updating}
                  className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="add">
                    Add Stock
                  </option>

                  <option value="remove">
                    Remove Stock
                  </option>

                  <option value="set">
                    Set Exact Quantity
                  </option>

                  {!selectedProduct && (
                    <option value="threshold">
                      Update Low Stock Threshold
                    </option>
                  )}
                </select>
              </div>

              <Input
                label={getDialogQuantityLabel()}
                required
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    event.target.value
                  )
                }
                disabled={updating}
                error={dialogError}
              />

            
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Button
                type="button"
                variant="outline"
                disabled={updating}
                onClick={closeDialog}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="primary"
                disabled={updating}
                onClick={
                  handleUpdateStock
                }
                className="w-full sm:w-auto"
              >
                {updating
                  ? "Updating..."
                  : selectedProduct
                    ? "Update Stock"
                    : `Update ${selectedIds.length} Products`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}