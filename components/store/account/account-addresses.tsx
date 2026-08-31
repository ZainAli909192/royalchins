"use client";

import {
  Building2,
  Check,
  ChevronDown,
  Home,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

type Emirate =
  | "Dubai"
  | "Abu Dhabi"
  | "Sharjah"
  | "Ajman"
  | "Umm Al Quwain"
  | "Ras Al Khaimah"
  | "Fujairah";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  emirate: Emirate;
  area: string;
  street: string;
  building: string;
  unit: string;
  landmark: string;
  isDefault: boolean;
};

type AddressFormData = Omit<
  Address,
  "id" | "isDefault"
>;

const emirates: Emirate[] = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

const initialAddresses: Address[] = [
  {
    id: "home",
    label: "Home",
    fullName: "Ahmed Daniyal",
    phone: "50 780 1110",
    emirate: "Dubai",
    area: "Dubai Marina",
    street: "Al Marsa Street",
    building: "Marina Residence",
    unit: "Apartment 1204",
    landmark: "",
    isDefault: true,
  },
  {
    id: "work",
    label: "Work",
    fullName: "Ahmed Daniyal",
    phone: "50 780 1110",
    emirate: "Dubai",
    area: "Business Bay",
    street: "Marasi Drive",
    building: "Business Centre",
    unit: "Office 402",
    landmark: "Near the canal",
    isDefault: false,
  },
];

const emptyForm: AddressFormData = {
  label: "",
  fullName: "",
  phone: "",
  emirate: "Dubai",
  area: "",
  street: "",
  building: "",
  unit: "",
  landmark: "",
};

export function AccountAddresses() {
  const [addresses, setAddresses] =
    useState<Address[]>(initialAddresses);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [deleteAddress, setDeleteAddress] =
    useState<Address | null>(null);

  function openAddAddress() {
    setEditingAddress(null);
    setFormOpen(true);
  }

  function openEditAddress(address: Address) {
    setEditingAddress(address);
    setFormOpen(true);
  }

  function handleSaveAddress(
    formData: AddressFormData
  ) {
    if (editingAddress) {
      setAddresses((current) =>
        current.map((address) =>
          address.id === editingAddress.id
            ? {
                ...address,
                ...formData,
              }
            : address
        )
      );
    } else {
      const newAddress: Address = {
        id: `address-${Date.now()}`,
        ...formData,
        isDefault: addresses.length === 0,
      };

      setAddresses((current) => [
        ...current,
        newAddress,
      ]);
    }

    setFormOpen(false);
    setEditingAddress(null);
  }

  function handleSetDefault(id: string) {
    setAddresses((current) =>
      current.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
  }

  function handleDelete() {
    if (!deleteAddress) return;

    setAddresses((current) => {
      const remaining = current.filter(
        (address) =>
          address.id !== deleteAddress.id
      );

      if (
        deleteAddress.isDefault &&
        remaining.length > 0
      ) {
        return remaining.map(
          (address, index) => ({
            ...address,
            isDefault: index === 0,
          })
        );
      }

      return remaining;
    });

    setDeleteAddress(null);
  }

  return (
    <>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              My Account
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Delivery Addresses
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Manage the addresses where your
              Royal Chins orders can be
              delivered.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={openAddAddress}
            className="h-11 w-full rounded-xl px-5 font-bold sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        </header>

        {addresses.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() =>
                  openEditAddress(address)
                }
                onDelete={() =>
                  setDeleteAddress(address)
                }
                onSetDefault={() =>
                  handleSetDefault(address.id)
                }
              />
            ))}

            <button
              type="button"
              onClick={openAddAddress}
              className="group flex min-h-[230px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5 sm:rounded-3xl"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Plus className="h-5 w-5" />
              </span>

              <p className="mt-4 text-sm font-bold text-foreground">
                Add another address
              </p>

              <p className="mt-1 max-w-[230px] text-xs leading-5 text-muted-foreground">
                Save another UAE delivery
                location to use during checkout.
              </p>
            </button>
          </div>
        ) : (
          <EmptyAddresses
            onAdd={openAddAddress}
          />
        )}

        <section className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:rounded-3xl sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MapPin className="h-4 w-4" />
            </span>

            <div>
              <p className="text-sm font-bold text-foreground">
                UAE Delivery
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Delivery fees may vary depending
                on the selected Emirate. The
                applicable fee will be shown
                during checkout.
              </p>
            </div>
          </div>
        </section>
      </div>

      {formOpen && (
        <AddressFormModal
          address={editingAddress}
          onClose={() => {
            setFormOpen(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
        />
      )}

      {deleteAddress && (
        <DeleteAddressModal
          address={deleteAddress}
          onClose={() =>
            setDeleteAddress(null)
          }
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const AddressIcon =
    address.label.toLowerCase() === "home"
      ? Home
      : Building2;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-5 ${
        address.isDefault
          ? "border-primary/40"
          : "border-border"
      }`}
    >
      {address.isDefault && (
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              address.isDefault
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary"
            }`}
          >
            <AddressIcon className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {address.label}
              </h2>

              {address.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-primary">
                  <Check className="h-3 w-3" />
                  Default
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {address.emirate}, UAE
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-bold text-foreground">
          {address.fullName}
        </p>

        <p className="mt-1 text-xs font-medium text-muted-foreground">
          +971 {address.phone}
        </p>

        <div className="mt-4 flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <p className="text-xs leading-5 text-muted-foreground">
            {address.unit},{" "}
            {address.building}
            <br />
            {address.street},{" "}
            {address.area}
            <br />
            {address.emirate}, UAE
          </p>
        </div>

        {address.landmark && (
          <div className="mt-3 rounded-xl bg-surface-subtle px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Landmark
            </p>

            <p className="mt-1 text-xs text-foreground">
              {address.landmark}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {!address.isDefault && (
          <Button
            type="button"
            variant="secondary"
            onClick={onSetDefault}
            className="h-9 rounded-lg px-3 text-xs font-bold"
          >
            <Star className="mr-1.5 h-3.5 w-3.5" />
            Set as Default
          </Button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${address.label} address`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-subtle text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${address.label} address`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-error/5 text-error transition-colors hover:bg-error/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function AddressFormModal({
  address,
  onClose,
  onSave,
}: {
  address: Address | null;
  onClose: () => void;
  onSave: (
    formData: AddressFormData
  ) => void;
}) {
  const [form, setForm] =
    useState<AddressFormData>(
      address
        ? {
            label: address.label,
            fullName: address.fullName,
            phone: address.phone,
            emirate: address.emirate,
            area: address.area,
            street: address.street,
            building: address.building,
            unit: address.unit,
            landmark: address.landmark,
          }
        : emptyForm
    );

  const [error, setError] =
    useState("");

  function updateField<
    K extends keyof AddressFormData
  >(
    field: K,
    value: AddressFormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !form.label.trim() ||
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.area.trim() ||
      !form.street.trim() ||
      !form.building.trim() ||
      !form.unit.trim()
    ) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    const cleanPhone = form.phone
      .replace(/\D/g, "")
      .replace(/^971/, "")
      .replace(/^0/, "");

    if (cleanPhone.length !== 9) {
      setError(
        "Please enter a valid UAE mobile number."
      );
      return;
    }

    onSave({
      ...form,
      label: form.label.trim(),
      fullName: form.fullName.trim(),
      phone: formatPhone(cleanPhone),
      area: form.area.trim(),
      street: form.street.trim(),
      building: form.building.trim(),
      unit: form.unit.trim(),
      landmark: form.landmark.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close address form"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-background shadow-2xl sm:max-w-[680px] sm:rounded-3xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              Delivery Address
            </p>

            <h2 className="mt-1 text-lg font-bold text-foreground">
              {address
                ? "Edit Address"
                : "Add New Address"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-subtle text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Address Label"
              required
            >
              <input
                value={form.label}
                onChange={(event) =>
                  updateField(
                    "label",
                    event.target.value
                  )
                }
                placeholder="Home, Work..."
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Full Name"
              required
            >
              <input
                value={form.fullName}
                onChange={(event) =>
                  updateField(
                    "fullName",
                    event.target.value
                  )
                }
                placeholder="Full name"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Mobile Number"
              required
            >
              <div className="flex h-12 overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary">
                <span className="flex shrink-0 items-center border-r border-border bg-surface-subtle px-3 text-sm font-semibold text-foreground">
                  +971
                </span>

                <input
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  inputMode="tel"
                  placeholder="50 123 4567"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </FormField>

            <FormField
              label="Emirate"
              required
            >
              <div className="relative">
                <select
                  value={form.emirate}
                  onChange={(event) =>
                    updateField(
                      "emirate",
                      event.target
                        .value as Emirate
                    )
                  }
                  className={`${inputClass} appearance-none pr-10`}
                >
                  {emirates.map(
                    (emirate) => (
                      <option
                        key={emirate}
                        value={emirate}
                      >
                        {emirate}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </FormField>

            <FormField
              label="Area / Community"
              required
            >
              <input
                value={form.area}
                onChange={(event) =>
                  updateField(
                    "area",
                    event.target.value
                  )
                }
                placeholder="Dubai Marina"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Street"
              required
            >
              <input
                value={form.street}
                onChange={(event) =>
                  updateField(
                    "street",
                    event.target.value
                  )
                }
                placeholder="Al Marsa Street"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Building / Villa"
              required
            >
              <input
                value={form.building}
                onChange={(event) =>
                  updateField(
                    "building",
                    event.target.value
                  )
                }
                placeholder="Building or villa name"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Apartment / Villa No."
              required
            >
              <input
                value={form.unit}
                onChange={(event) =>
                  updateField(
                    "unit",
                    event.target.value
                  )
                }
                placeholder="Apartment 1204"
                className={inputClass}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField label="Landmark">
                <input
                  value={form.landmark}
                  onChange={(event) =>
                    updateField(
                      "landmark",
                      event.target.value
                    )
                  }
                  placeholder="Optional nearby landmark"
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-xs font-semibold text-error">
              {error}
            </div>
          )}

          <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <p className="text-[11px] leading-5 text-muted-foreground">
                Please provide accurate delivery
                details so your Royal Chins
                order can be delivered to the
                correct location.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="h-11 rounded-xl px-5"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="h-11 rounded-xl px-6 font-bold"
            >
              {address
                ? "Save Changes"
                : "Save Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteAddressModal({
  address,
  onClose,
  onDelete,
}: {
  address: Address;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
      <button
        type="button"
        aria-label="Close delete confirmation"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-[430px] rounded-3xl bg-background p-5 shadow-2xl sm:p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
          <Trash2 className="h-5 w-5" />
        </span>

        <h2 className="mt-4 text-xl font-bold text-foreground">
          Delete address?
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Are you sure you want to delete your{" "}
          <span className="font-bold text-foreground">
            {address.label}
          </span>{" "}
          address? This action cannot be
          undone.
        </p>

        {address.isDefault && (
          <div className="mt-4 rounded-xl border border-warning/20 bg-warning/5 p-3">
            <p className="text-xs leading-5 text-muted-foreground">
              This is your default address. If
              deleted, another saved address
              will automatically become the
              default.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-11 rounded-xl px-5"
          >
            Keep Address
          </Button>

          <button
            type="button"
            onClick={onDelete}
            className="h-11 rounded-xl bg-error px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Delete Address
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyAddresses({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-border bg-background px-5 py-14 text-center shadow-sm sm:py-20">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MapPin className="h-7 w-7" />
      </span>

      <h2 className="mt-5 text-xl font-bold text-foreground">
        No saved addresses
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Add a delivery address to make your
        future checkout faster.
      </p>

      <Button
        type="button"
        variant="primary"
        onClick={onAdd}
        className="mt-6 h-11 rounded-xl px-6 font-bold"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Address
      </Button>
    </div>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-foreground">
        {label}

        {required && (
          <span className="ml-1 text-error">
            *
          </span>
        )}
      </span>

      <div className="mt-2">
        {children}
      </div>
    </label>
  );
}

function formatPhone(
  value: string
) {
  if (value.length !== 9) {
    return value;
  }

  return `${value.slice(
    0,
    2
  )} ${value.slice(
    2,
    5
  )} ${value.slice(5)}`;
}

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  