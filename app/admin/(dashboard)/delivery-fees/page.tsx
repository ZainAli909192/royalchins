"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Edit3,
  MapPin,
  Plus,
  Search,
  Trash2,
  Truck,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";

import {
  DeliveryFeeFormDialog,
  type DeliveryFeeFormValues,
} from "@/components/admin/delivery-fees/delivery-fee-form-dialog";

import { DeleteDeliveryFeeDialog } from "@/components/admin/delivery-fees/delete-delivery-fee-dialog";

import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api/client";

type DeliveryFeeStatus =
  | "Active"
  | "Inactive";

type DeliveryFee = {
  id: string;

  area: string;
  emirate: string;

  fee: number;

  eta: string;

  freeDeliveryThreshold:
    | number
    | null;

  isFreeDelivery: boolean;

  status: DeliveryFeeStatus;
};

const initialDeliveryFees = [
  {
    id: 1,

    area: "Dubai Marina",
    emirate: "Dubai",

    fee: 35,

    eta: "Same day",

    freeDeliveryThreshold:
      500,

    status: "Active",
  },

  {
    id: 2,

    area: "Downtown Dubai",
    emirate: "Dubai",

    fee: 35,

    eta: "Same day",

    freeDeliveryThreshold:
      500,

    status: "Active",
  },

  {
    id: 3,

    area: "Abu Dhabi City",
    emirate: "Abu Dhabi",

    fee: 45,

    eta: "1 day",

    freeDeliveryThreshold:
      700,

    status: "Active",
  },

  {
    id: 4,

    area: "Al Nahda",
    emirate: "Sharjah",

    fee: 40,

    eta: "1 day",

    freeDeliveryThreshold:
      null,

    status: "Active",
  },

  {
    id: 5,

    area: "Al Nuaimiya",
    emirate: "Ajman",

    fee: 45,

    eta: "1–2 days",

    freeDeliveryThreshold:
      null,

    status: "Inactive",
  },
] as unknown as DeliveryFee[];

export default function DeliveryFeesPage() {
  const [
    deliveryFees,
    setDeliveryFees,
  ] =
    useState<DeliveryFee[]>([]);

  const [loadError, setLoadError] = useState("");

  const [search, setSearch] =
    useState("");

  const [
    emirateFilter,
    setEmirateFilter,
  ] = useState("all");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    formDialogOpen,
    setFormDialogOpen,
  ] = useState(false);

  const [
    editingFee,
    setEditingFee,
  ] =
    useState<DeliveryFee | null>(
      null
    );

  const loadDeliveryFees = async () => {
    try {
      setLoadError("");
      const zones = await apiRequest<Array<Omit<DeliveryFee, "status" | "fee" | "freeDeliveryThreshold"> & { fee: number | string; freeDeliveryThreshold: number | string | null; isActive: boolean }>>("/api/admin/delivery-fees");
      setDeliveryFees(zones.map((zone) => ({
        ...zone,
        fee: Number(zone.fee),
        freeDeliveryThreshold: zone.freeDeliveryThreshold === null ? null : Number(zone.freeDeliveryThreshold),
        status: zone.isActive ? "Active" : "Inactive",
      })));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load delivery areas.");
    }
  };

  useEffect(() => { void loadDeliveryFees(); }, []);

  const [
    feeToDelete,
    setFeeToDelete,
  ] =
    useState<DeliveryFee | null>(
      null
    );

  /* =========================
     FILTERED DATA
  ========================= */

  const filteredFees =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      return deliveryFees.filter(
        (fee) => {
          const matchesSearch =
            fee.area
              .toLowerCase()
              .includes(value) ||
            fee.emirate
              .toLowerCase()
              .includes(value);

          const matchesEmirate =
            emirateFilter ===
              "all" ||
            fee.emirate ===
              emirateFilter;

          const matchesStatus =
            statusFilter ===
              "all" ||
            fee.status.toLowerCase() ===
              statusFilter;

          return (
            matchesSearch &&
            matchesEmirate &&
            matchesStatus
          );
        }
      );
    }, [
      deliveryFees,
      search,
      emirateFilter,
      statusFilter,
    ]);

  /* =========================
     SUMMARY
  ========================= */

  const activeCount =
    deliveryFees.filter(
      (fee) =>
        fee.status === "Active"
    ).length;

  const emirateCount =
    new Set(
      deliveryFees.map(
        (fee) =>
          fee.emirate
      )
    ).size;

  const averageFee =
    deliveryFees.length
      ? Math.round(
          deliveryFees.reduce(
            (
              total,
              fee
            ) =>
              total +
              fee.fee,
            0
          ) /
            deliveryFees.length
        )
      : 0;

  /* =========================
     CREATE / EDIT
  ========================= */

  const openCreateDialog =
    () => {
      setEditingFee(null);
      setFormDialogOpen(true);
    };

  const openEditDialog = (
    fee: DeliveryFee
  ) => {
    setEditingFee(fee);
    setFormDialogOpen(true);
  };

  const closeFormDialog =
    () => {
      setEditingFee(null);
      setFormDialogOpen(false);
    };

  const saveDeliveryFee = async (
    values: DeliveryFeeFormValues
  ) => {
    try {
      const payload = { ...values, freeDeliveryThreshold: values.freeDeliveryThreshold === "" ? null : values.freeDeliveryThreshold };
      await apiRequest(editingFee ? `/api/admin/delivery-fees/${editingFee.id}` : "/api/admin/delivery-fees", {
        method: editingFee ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      await loadDeliveryFees();
      closeFormDialog();
      setSuccessMessage(editingFee ? "Delivery fee updated successfully." : "Delivery fee added successfully.");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to save delivery area.");
    }
  };

  /* =========================
     DELETE
  ========================= */

  const confirmDelete = async () => {
      if (!feeToDelete) {
        return;
      }

      try {
        await apiRequest(`/api/admin/delivery-fees/${feeToDelete.id}`, { method: "DELETE" });
        await loadDeliveryFees();
        setFeeToDelete(null);
        setSuccessMessage("Delivery fee deleted successfully.");
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Unable to delete delivery area.");
      }
    };

  /* =========================
     STATUS
  ========================= */

  const toggleStatus = async (
    fee: DeliveryFee
  ) => {
    try {
      await apiRequest(`/api/admin/delivery-fees/${fee.id}`, { method: "PATCH", body: JSON.stringify({ status: fee.status === "Active" ? "Inactive" : "Active" }) });
      await loadDeliveryFees();
      setSuccessMessage(fee.status === "Active" ? "Delivery fee set to inactive." : "Delivery fee activated successfully.");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to update delivery area.");
    }
  };

  /* =========================
     FILTERS
  ========================= */

  const resetFilters = () => {
    setSearch("");
    setEmirateFilter("all");
    setStatusFilter("all");
  };

  const getStatusClass = (
    status: DeliveryFeeStatus
  ) => {
    return status === "Active"
      ? "bg-[var(--success-background)] text-success"
      : "bg-surface-subtle text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* =========================
          HEADER
      ========================= */}

      <AdminPageHeader
        title="Delivery Fees"
        description="Manage UAE delivery areas, pricing and delivery times."
        action={
          <Button
            type="button"
            variant="primary"
            onClick={
              openCreateDialog
            }
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Plus className="h-4 w-4" />

              Add Delivery Fee
            </span>
          </Button>
        }
      />

      {/* =========================
          SUCCESS
      ========================= */}

      {successMessage && (
        <FormAlert
          variant="success"
          message={
            successMessage
          }
          onClose={() =>
            setSuccessMessage("")
          }
        />
      )}

      {loadError && (
        <FormAlert
          variant="error"
          message={loadError}
          onClose={() => setLoadError("")}
        />
      )}

      {/* =========================
          SUMMARY
      ========================= */}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Delivery Areas"
          value={
            deliveryFees.length
          }
          icon={
            <MapPin className="h-5 w-5" />
          }
        />

        <SummaryCard
          label="Active Areas"
          value={activeCount}
          icon={
            <Truck className="h-5 w-5" />
          }
        />

        <SummaryCard
          label="Emirates"
          value={emirateCount}
          icon={
            <MapPin className="h-5 w-5" />
          }
        />

        <SummaryCard
          label="Average Fee"
          value={`AED ${averageFee}`}
          icon={
            <Truck className="h-5 w-5" />
          }
        />
      </section>

      {/* =========================
          FILTERS
      ========================= */}

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-5">
        <div className="grid gap-3 xl:grid-cols-[1fr_190px_170px_auto]">
          <Input
            type="search"
            placeholder="Search area or emirate..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            leftIcon={
              <Search className="h-5 w-5" />
            }
            className="h-11 sm:h-12"
          />

          <div className="grid grid-cols-2 gap-2 xl:contents">
            {/* Emirate */}
            <select
              value={
                emirateFilter
              }
              onChange={(event) =>
                setEmirateFilter(
                  event.target.value
                )
              }
              className="h-11 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
            >
              <option value="all">
                All Emirates
              </option>

              <option value="Dubai">
                Dubai
              </option>

              <option value="Abu Dhabi">
                Abu Dhabi
              </option>

              <option value="Sharjah">
                Sharjah
              </option>

              <option value="Ajman">
                Ajman
              </option>

              <option value="Umm Al Quwain">
                Umm Al Quwain
              </option>

              <option value="Ras Al Khaimah">
                Ras Al Khaimah
              </option>

              <option value="Fujairah">
                Fujairah
              </option>
            </select>

            {/* Status */}
            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="h-11 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

            {/* Reset */}
            <Button
              type="button"
              variant="outline"
              onClick={
                resetFilters
              }
              className="col-span-2 h-11 w-full sm:h-12 xl:col-span-1 xl:w-auto"
            >
              Reset
            </Button>
          </div>
        </div>
      </section>

      {/* =========================
          CONTENT
      ========================= */}

      {filteredFees.length ===
      0 ? (
        <AdminEmptyState
          type="search"
          title="No delivery fees found"
          description="Try changing your filters or add a delivery area."
        />
      ) : (
        <>
          {/* =========================
              DESKTOP
          ========================= */}

          <section className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Area
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Emirate
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Delivery Fee
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      ETA
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Free Delivery
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
                  {filteredFees.map(
                    (fee) => (
                      <tr
                        key={fee.id}
                        className="border-t border-border"
                      >
                        {/* Area */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <MapPin className="h-4 w-4" />
                            </div>

                            <p className="text-sm font-semibold text-foreground">
                              {fee.area}
                            </p>
                          </div>
                        </td>

                        {/* Emirate */}
                        <td className="px-5 py-4 text-sm text-foreground">
                          {fee.emirate}
                        </td>

                        {/* Fee */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-foreground">
                            AED{" "}
                            {fee.fee.toLocaleString()}
                          </p>
                        </td>

                        {/* ETA */}
                        <td className="px-5 py-4 text-sm text-foreground">
                          {fee.eta}
                        </td>

                        {/* Free Delivery */}
                        <td className="px-5 py-4 text-sm text-foreground">
                          {fee.isFreeDelivery ? (
                            <span className="rounded-full bg-[var(--success-background)] px-3 py-1 text-xs font-medium text-success">
                              Free delivery
                            </span>
                          ) : fee.freeDeliveryThreshold !== null ? (
                            <span className="rounded-full bg-[var(--success-background)] px-3 py-1 text-xs font-medium text-success">
                              Above AED{" "}
                              {fee.freeDeliveryThreshold.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(
                                fee
                              )
                            }
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${getStatusClass(
                              fee.status
                            )}`}
                          >
                            {
                              fee.status
                            }
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              title="Edit Delivery Fee"
                              aria-label={`Edit delivery fee for ${fee.area}`}
                              onClick={() =>
                                openEditDialog(
                                  fee
                                )
                              }
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              title="Delete Delivery Fee"
                              aria-label={`Delete delivery fee for ${fee.area}`}
                              onClick={() =>
                                setFeeToDelete(
                                  fee
                                )
                              }
                              className="text-error hover:border-error hover:bg-[var(--error-background)] hover:text-error"
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
          </section>

          {/* =========================
              MOBILE
          ========================= */}

          <div className="space-y-3 md:hidden">
            {filteredFees.map(
              (fee) => (
                <article
                  key={fee.id}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  {/* Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-foreground">
                          {fee.area}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />

                          {fee.emirate}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleStatus(
                            fee
                          )
                        }
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          fee.status
                        )}`}
                      >
                        {fee.status}
                      </button>
                    </div>

                    {/* Fee + ETA */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-surface-subtle p-3">
                        <p className="text-xs text-muted-foreground">
                          Delivery Fee
                        </p>

                        <p className="mt-1 text-sm font-bold text-foreground">
                          AED{" "}
                          {fee.fee.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-xl bg-surface-subtle p-3">
                        <p className="text-xs text-muted-foreground">
                          Delivery Time
                        </p>

                        <p className="mt-1 text-sm font-bold text-foreground">
                          {fee.eta}
                        </p>
                      </div>
                    </div>

                    {/* Free Delivery */}
                    {(fee.isFreeDelivery || fee.freeDeliveryThreshold !== null) && (
                      <div className="mt-3 rounded-xl border border-border p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-muted-foreground">
                            Free Delivery
                          </span>

                          <span className="text-sm font-semibold text-success">
                            {fee.isFreeDelivery ? "Free for every order" : `Above AED ${fee.freeDeliveryThreshold}`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 border-t border-border bg-surface-subtle/30 p-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Edit Delivery Fee"
                      aria-label={`Edit delivery fee for ${fee.area}`}
                      onClick={() =>
                        openEditDialog(
                          fee
                        )
                      }
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Delete Delivery Fee"
                      aria-label={`Delete delivery fee for ${fee.area}`}
                      onClick={() =>
                        setFeeToDelete(
                          fee
                        )
                      }
                      className="text-error hover:border-error hover:bg-[var(--error-background)] hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </article>
              )
            )}
          </div>
        </>
      )}

      {/* =========================
          FORM DIALOG
      ========================= */}

      <DeliveryFeeFormDialog
        open={formDialogOpen}
        mode={
          editingFee
            ? "edit"
            : "create"
        }
        initialValues={
          editingFee
            ? {
                area:
                  editingFee.area,

                emirate:
                  editingFee.emirate,

                fee:
                  editingFee.fee,

                eta:
                  editingFee.eta,

                freeDeliveryThreshold:
                  editingFee.freeDeliveryThreshold ??
                  "",

                isFreeDelivery: editingFee.isFreeDelivery,

                status:
                  editingFee.status,
              }
            : undefined
        }
        onClose={
          closeFormDialog
        }
        onSubmit={
          saveDeliveryFee
        }
      />

      {/* =========================
          DELETE DIALOG
      ========================= */}

      <DeleteDeliveryFeeDialog
        open={
          Boolean(
            feeToDelete
          )
        }
        area={
          feeToDelete?.area
        }
        emirate={
          feeToDelete?.emirate
        }
        onClose={() =>
          setFeeToDelete(null)
        }
        onConfirm={
          confirmDelete
        }
      />
    </div>
  );
}

type SummaryCardProps = {
  label: string;

  value:
    | number
    | string;

  icon:
    React.ReactNode;
};

function SummaryCard({
  label,
  value,
  icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-primary">
          {icon}
        </div>

        <div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
