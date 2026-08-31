"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Search,
  ShoppingBag,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { AdminPageLoader } from "@/components/admin/shared/admin-page-loader";
import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  getCustomers,
  type CustomerResponse,
} from "@/lib/api/customers";
import { getErrorMessage } from "@/lib/api/error-message";

type CustomerStatus =
  | "Active"
  | "Inactive";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  memberSince: string;
  status: CustomerStatus;
};

const pageSize = 6;

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [formError, setFormError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [activity, setActivity] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  useEffect(() => {
    getCustomers()
      .then((items) => {
        setCustomers(
          items.map(
            (
              customer: CustomerResponse
            ) => ({
              id: customer.id,
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              totalOrders:
                customer._count.orders,
              totalSpent:
                customer.orders.reduce(
                  (sum, order) =>
                    sum +
                    Number(order.total),
                  0
                ),
              lastOrder:
                customer.orders[0]
                  ? new Intl.DateTimeFormat(
                      "en-AE",
                      {
                        dateStyle:
                          "medium",
                      }
                    ).format(
                      new Date(
                        customer.orders[0]
                          .createdAt
                      )
                    )
                  : "—",
              memberSince:
                new Intl.DateTimeFormat(
                  "en-AE",
                  {
                    dateStyle: "medium",
                  }
                ).format(
                  new Date(
                    customer.createdAt
                  )
                ),
              status:
                customer.isActive
                  ? "Active"
                  : "Inactive",
            })
          )
        );
      })
      .catch((error) => {
        setFormError(
          getErrorMessage(
            error,
            "Unable to load customers."
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredCustomers =
    useMemo(() => {
      return customers.filter(
        (customer) => {
          const searchValue =
            search.toLowerCase();

          const matchesSearch =
            customer.name
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            customer.email
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            customer.phone
              .toLowerCase()
              .includes(
                searchValue
              );

          const matchesStatus =
            status === "all" ||
            customer.status.toLowerCase() ===
              status;

          let matchesActivity = true;

          if (
            activity ===
            "with-orders"
          ) {
            matchesActivity =
              customer.totalOrders > 0;
          }

          if (
            activity ===
            "multiple-orders"
          ) {
            matchesActivity =
              customer.totalOrders > 1;
          }

          return (
            matchesSearch &&
            matchesStatus &&
            matchesActivity
          );
        }
      );
    }, [
      search,
      status,
      activity,
      customers,
    ]);

  const totalPages = Math.ceil(
    filteredCustomers.length /
      pageSize
  );

  const paginatedCustomers =
    filteredCustomers.slice(
      (currentPage - 1) *
        pageSize,
      currentPage * pageSize
    );

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status ===
        "Active"
    ).length;

  const customersWithOrders =
    customers.filter(
      (customer) =>
        customer.totalOrders > 0
    ).length;

  const newCustomers =
    customers.filter(
      (customer) =>
        customer.memberSince.includes(
          "Aug 2026"
        )
    ).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    status,
    activity,
  ]);

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setActivity("all");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers"
        description="Manage customer accounts and order activity."
      />

      {formError && (
        <FormAlert
          variant="error"
          message={formError}
          onClose={() =>
            setFormError("")
          }
        />
      )}

      {isLoading ? (
        <AdminPageLoader label="Loading customers..." />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-subtle text-primary">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Customers
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {totalCustomers}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--success-background)] text-success">
                  <UserCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Active
                  </p>

                  <p className="mt-1 text-2xl font-bold text-success">
                    {activeCustomers}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-subtle text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    With Orders
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {customersWithOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-subtle text-primary">
                  <UserPlus className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    New This Month
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {newCustomers}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-5">
            <div className="grid gap-3 xl:grid-cols-[1fr_180px_200px_auto]">
              <Input
                type="search"
                placeholder="Search customers..."
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                leftIcon={
                  <Search className="h-5 w-5" />
                }
                className="h-11 sm:h-12"
              />

              <div className="grid grid-cols-2 gap-2 xl:contents">
                <select
                  value={status}
                  onChange={(
                    event
                  ) =>
                    setStatus(
                      event.target
                        .value
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

                <select
                  value={activity}
                  onChange={(
                    event
                  ) =>
                    setActivity(
                      event.target
                        .value
                    )
                  }
                  className="h-11 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
                >
                  <option value="all">
                    All Activity
                  </option>

                  <option value="with-orders">
                    With Orders
                  </option>

                  <option value="multiple-orders">
                    Repeat Customers
                  </option>
                </select>

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

          {filteredCustomers.length ===
          0 ? (
            <AdminEmptyState
              type="search"
              title="No customers found"
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
                          Customer
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Contact
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Orders
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Total Spent
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                          Last Order
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
                      {paginatedCustomers.map(
                        (
                          customer
                        ) => (
                          <tr
                            key={
                              customer.id
                            }
                            className="border-t border-border"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold">
                                {
                                  customer.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Customer #
                                {
                                  customer.id
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm">
                                {
                                  customer.email
                                }
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {
                                  customer.phone
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold">
                              {
                                customer.totalOrders
                              }
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold">
                              AED{" "}
                              {customer.totalSpent.toLocaleString()}
                            </td>

                            <td className="px-5 py-4 text-sm text-muted-foreground">
                              {
                                customer.lastOrder
                              }
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  customer.status ===
                                  "Active"
                                    ? "bg-[var(--success-background)] text-success"
                                    : "bg-surface-subtle text-muted-foreground"
                                }`}
                              >
                                {
                                  customer.status
                                }
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    router.push(
                                      `/admin/customers/${customer.id}`
                                    )
                                  }
                                >
                                  <span className="flex items-center gap-2 whitespace-nowrap">
                                    <Eye className="h-4 w-4" />
                                    View
                                    Customer
                                  </span>
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
                  currentPage={
                    currentPage
                  }
                  totalPages={
                    totalPages
                  }
                  totalItems={
                    filteredCustomers.length
                  }
                  pageSize={
                    pageSize
                  }
                  onPageChange={
                    setCurrentPage
                  }
                />
              </section>

              <div className="space-y-3 md:hidden">
                {paginatedCustomers.map(
                  (
                    customer
                  ) => (
                    <article
                      key={
                        customer.id
                      }
                      className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="text-base font-semibold">
                              {
                                customer.name
                              }
                            </h2>

                            <p className="mt-1 break-all text-xs text-muted-foreground">
                              {
                                customer.email
                              }
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {
                                customer.phone
                              }
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                              customer.status ===
                              "Active"
                                ? "bg-[var(--success-background)] text-success"
                                : "bg-surface-subtle text-muted-foreground"
                            }`}
                          >
                            {
                              customer.status
                            }
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-surface-subtle p-3">
                            <p className="text-xs text-muted-foreground">
                              Orders
                            </p>

                            <p className="mt-1 text-lg font-bold">
                              {
                                customer.totalOrders
                              }
                            </p>
                          </div>

                          <div className="rounded-lg bg-surface-subtle p-3">
                            <p className="text-xs text-muted-foreground">
                              Total Spent
                            </p>

                            <p className="mt-1 text-sm font-bold">
                              AED{" "}
                              {customer.totalSpent.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Last
                            Order
                          </span>

                          <span className="font-medium">
                            {
                              customer.lastOrder
                            }
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-border bg-surface-subtle/40 p-3">
                        <Button
                          variant="primary"
                          onClick={() =>
                            router.push(
                              `/admin/customers/${customer.id}`
                            )
                          }
                          className="w-full"
                        >
                          <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                            <Eye className="h-4 w-4 shrink-0" />
                            <span>
                              View Customer
                            </span>
                          </span>
                        </Button>
                      </div>
                    </article>
                  )
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
                      filteredCustomers.length
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
        </>
      )}
    </div>
  );
}