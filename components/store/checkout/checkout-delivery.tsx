"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Home,
  MapPin,
  Phone,
  Plus,
  UserRound,
} from "lucide-react";
import {
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  type CheckoutOrderItem,
  OrderSummary,
} from "@/components/store/checkout/order-summary";
import {
  getCheckout,
  saveCheckout,
} from "@/lib/store/checkout-storage";

type AddressMode =
  | "saved"
  | "new";

type Emirate =
  | ""
  | "Dubai"
  | "Abu Dhabi"
  | "Sharjah"
  | "Ajman"
  | "Umm Al Quwain"
  | "Ras Al Khaimah"
  | "Fujairah";

type DeliveryForm = {
  fullName: string;
  phone: string;
  emirate: Emirate;
  area: string;
  street: string;
  building: string;
  unit: string;
  landmark: string;
  notes: string;
  saveAddress: boolean;
};

const fallbackAddress = {
  id: "home",
  label: "Home",
  fullName: "Ahmed Daniyal",
  phone: "+971 50 780 1110",
  emirate: "Dubai" as Emirate,
  area: "Dubai Marina",
  street: "Al Marsa Street",
  building: "Marina Residence",
  unit: "Apartment 1204",
};

const deliveryFees: Record<
  Exclude<Emirate, "">,
  number
> = {
  Dubai: 35,
  "Abu Dhabi": 50,
  Sharjah: 40,
  Ajman: 45,
  "Umm Al Quwain": 55,
  "Ras Al Khaimah": 60,
  Fujairah: 60,
};

export function CheckoutDelivery() {
  const router = useRouter();

  const [checkoutItems, setCheckoutItems] =
    useState<CheckoutOrderItem[]>([]);

  const [checkoutLoaded, setCheckoutLoaded] =
    useState(false);

  const [addressMode, setAddressMode] =
    useState<AddressMode>("saved");
  const [savedAddress, setSavedAddress] = useState(fallbackAddress);
  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] =
    useState<DeliveryForm>({
      fullName: "",
      phone: "",
      emirate: "",
      area: "",
      street: "",
      building: "",
      unit: "",
      landmark: "",
      notes: "",
      saveAddress: true,
    });

  useEffect(() => {
    const checkout = getCheckout();

    if (!checkout || checkout.items.length === 0) {
      setCheckoutLoaded(true);
      return;
    }

    setCheckoutItems(
      checkout.items.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        image: item.image,
        type: item.type,
        price: item.price,
        quantity: item.quantity,
        shortMeta: item.shortMeta,
      }))
    );

    setCheckoutLoaded(true);
  }, []);

  useEffect(() => {
    fetch("/api/store/auth/session")
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (!response.ok) { router.replace("/checkout/auth"); return; }
        const address = data.customer?.addresses?.[0];
        if (!address) { setAddressMode("new"); return; }
        setSavedAddress({ id: address.id, label: address.label, fullName: address.recipientName, phone: address.phone, emirate: address.emirate, area: address.area, street: address.street, building: address.building, unit: address.unit ?? "" });
        setSavedAddressId(address.id);
      })
      .catch(() => router.replace("/checkout/auth"));
  }, [router]);

  const selectedEmirate =
    addressMode === "saved"
      ? savedAddress.emirate
      : form.emirate;

  const deliveryFee =
    selectedEmirate
      ? deliveryFees[selectedEmirate]
      : null;

  const subtotal = useMemo(
    () =>
      checkoutItems.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      ),
    [checkoutItems]
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (checkoutItems.length === 0) {
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      let addressId = savedAddressId;
      if (addressMode === "new" || !addressId) {
        const response = await fetch("/api/store/checkout/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: "Home", recipientName: form.fullName, phone: form.phone, emirate: form.emirate, area: form.area, street: form.street, building: form.building, unit: form.unit, landmark: form.landmark, notes: form.notes, isDefault: form.saveAddress }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        addressId = result.id;
      }
      const checkout = getCheckout();
      if (checkout && addressId) saveCheckout({ ...checkout, addressId, deliveryFee: deliveryFee ?? 0 });
      router.push("/checkout/review");
    } catch (caught) {
      setSubmitError(caught instanceof Error ? caught.message : "Unable to save this delivery address.");
    } finally { setSubmitting(false); }
  };

  if (!checkoutLoaded) {
    return <DeliveryLoading />;
  }

  if (checkoutItems.length === 0) {
    return (
      <EmptyCheckout
        onBrowse={() =>
          router.push("/")
        }
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div className="min-w-0">
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Delivery Details
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Where should we deliver?
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Choose a saved address
              or enter a new delivery
              address for your order.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-surface-subtle p-1">
            <button
              type="button"
              onClick={() =>
                setAddressMode(
                  "saved"
                )
              }
              className={`flex h-11 items-center justify-center gap-2 rounded-lg px-2 text-xs font-bold transition-colors sm:text-sm ${
                addressMode ===
                "saved"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
              />

              <span>
                Saved Address
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setAddressMode("new")
              }
              className={`flex h-11 items-center justify-center gap-2 rounded-lg px-2 text-xs font-bold transition-colors sm:text-sm ${
                addressMode === "new"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Plus
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
              />

              <span>
                New Address
              </span>
            </button>
          </div>

          {addressMode ===
          "saved" ? (
            <SavedAddress address={savedAddress} />
          ) : (
            <NewAddressForm
              form={form}
              setForm={setForm}
            />
          )}

          {deliveryFee !==
            null && (
            <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </span>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    Delivery to{" "}
                    {
                      selectedEmirate
                    }
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Delivery fee
                    calculated for the
                    selected emirate.
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-base font-bold text-primary">
                AED{" "}
                {deliveryFee.toLocaleString()}
              </p>
            </div>
          )}

          {submitError && <p className="mt-5 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">{submitError}</p>}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              asChild
              type="button"
              variant="secondary"
              className="h-12 rounded-xl px-5"
            >
              <Link
                href="/checkout/auth"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                />

                <span>Back</span>
              </Link>
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="h-12 rounded-xl px-6 text-sm font-bold"
            >
              <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <span>
                  {submitting ? "Saving..." : "Review"}
                </span>

                <ArrowRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  strokeWidth={2}
                />
              </span>
            </Button>
          </div>
        </section>

        <div className="mt-4 lg:hidden">
          <OrderSummary
            items={
              checkoutItems
            }
            deliveryFee={
              deliveryFee
            }
          />
        </div>
      </div>

      <div className="hidden lg:block">
        <OrderSummary
          items={
            checkoutItems
          }
          deliveryFee={
            deliveryFee
          }
        />
      </div>
    </form>
  );
}

function SavedAddress({ address: savedAddress }: { address: typeof fallbackAddress }) {
  return (
    <div className="mt-6">
      <p className="mb-3 text-sm font-bold text-foreground">
        Select delivery address
      </p>

      <button
        type="button"
        className="relative w-full rounded-2xl border-2 border-primary bg-primary/5 p-4 text-left transition-colors sm:p-5"
      >
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={2.5}
          />
        </span>

        <div className="flex items-start gap-3 pr-9">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Home
              aria-hidden="true"
              className="h-4 w-4"
            />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-foreground">
                {
                  savedAddress.label
                }
              </p>

              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Default
              </span>
            </div>

            <p className="mt-2 text-sm font-semibold text-foreground">
              {
                savedAddress.fullName
              }
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {
                savedAddress.unit
              }
              ,{" "}
              {
                savedAddress.building
              }
              <br />

              {
                savedAddress.street
              }
              ,{" "}
              {
                savedAddress.area
              }
              <br />

              {
                savedAddress.emirate
              }
              , UAE
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Phone
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />

              {
                savedAddress.phone
              }
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => {
          /*
           * We'll connect this to the
           * saved-address system later.
           */
        }}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
        />

        <span>
          Add another address
        </span>
      </button>
    </div>
  );
}

function NewAddressForm({
  form,
  setForm,
}: {
  form: DeliveryForm;
  setForm: Dispatch<
    SetStateAction<DeliveryForm>
  >;
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full Name"
          required
        >
          <InputWrapper
            icon={UserRound}
          >
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    fullName:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="Full name"
              className={inputClass}
            />
          </InputWrapper>
        </Field>

        <Field
          label="Mobile Number"
          required
        >
          <div className="flex h-12 overflow-hidden rounded-xl border border-border bg-background transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <span className="flex shrink-0 items-center border-r border-border bg-surface-subtle px-3 text-sm font-semibold text-foreground">
              +971
            </span>

            <input
              type="tel"
              required
              value={form.phone}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    phone:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="50 123 4567"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Emirate"
          required
        >
          <div className="relative">
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />

            <select
              required
              value={form.emirate}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    emirate:
                      event.target
                        .value as Emirate,
                  })
                )
              }
              className="h-12 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="">
                Select emirate
              </option>

              {Object.keys(
                deliveryFees
              ).map(
                (emirate) => (
                  <option
                    key={emirate}
                    value={
                      emirate
                    }
                  >
                    {emirate}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </Field>

        <Field
          label="Area / Community"
          required
        >
          <InputWrapper
            icon={MapPin}
          >
            <input
              type="text"
              required
              value={form.area}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    area:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="e.g. Dubai Marina"
              className={inputClass}
            />
          </InputWrapper>
        </Field>
      </div>

      <Field
        label="Street"
        required
      >
        <InputWrapper
          icon={MapPin}
        >
          <input
            type="text"
            required
            value={form.street}
            onChange={(event) =>
              setForm(
                (current) => ({
                  ...current,
                  street:
                    event.target
                      .value,
                })
              )
            }
            placeholder="Street name"
            className={inputClass}
          />
        </InputWrapper>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Building / Villa"
          required
        >
          <InputWrapper
            icon={Building2}
          >
            <input
              type="text"
              required
              value={
                form.building
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    building:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="Building or villa"
              className={inputClass}
            />
          </InputWrapper>
        </Field>

        <Field
          label="Apartment / Villa No."
          required
        >
          <InputWrapper
            icon={Home}
          >
            <input
              type="text"
              required
              value={form.unit}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    unit:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="e.g. 1204"
              className={inputClass}
            />
          </InputWrapper>
        </Field>
      </div>

      <Field label="Landmark">
        <input
          type="text"
          value={form.landmark}
          onChange={(event) =>
            setForm(
              (current) => ({
                ...current,
                landmark:
                  event.target.value,
              })
            )
          }
          placeholder="Nearby landmark (optional)"
          className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </Field>

      <Field label="Delivery Notes">
        <textarea
          value={form.notes}
          onChange={(event) =>
            setForm(
              (current) => ({
                ...current,
                notes:
                  event.target.value,
              })
            )
          }
          placeholder="Any instructions for delivery? (optional)"
          rows={4}
          className="w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </Field>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4">
        <input
          type="checkbox"
          checked={
            form.saveAddress
          }
          onChange={(event) =>
            setForm(
              (current) => ({
                ...current,
                saveAddress:
                  event.target
                    .checked,
              })
            )
          }
          className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
        />

        <div>
          <p className="text-sm font-semibold text-foreground">
            Save this address
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            Use this address faster
            on your next order.
          </p>
        </div>
      </label>
    </div>
  );
}

const inputClass =
  "h-12 w-full bg-transparent pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground";

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-foreground">
        {label}

        {required && (
          <span className="ml-1 text-error">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function InputWrapper({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: ReactNode;
}) {
  return (
    <div className="relative h-12 rounded-xl border border-border bg-background transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />

      {children}
    </div>
  );
}

function DeliveryLoading() {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 rounded-2xl border border-border bg-background p-4 sm:rounded-3xl sm:p-6 lg:p-8">
        <div className="h-3 w-32 rounded bg-surface-subtle" />

        <div className="mt-4 h-8 w-72 max-w-full rounded-lg bg-surface-subtle" />

        <div className="mt-3 h-4 w-full max-w-lg rounded bg-surface-subtle" />

        <div className="mt-8 h-12 rounded-xl bg-surface-subtle" />

        <div className="mt-6 h-48 rounded-2xl bg-surface-subtle" />
      </div>

      <div className="hidden h-[380px] rounded-3xl bg-surface-subtle lg:block" />
    </div>
  );
}

function EmptyCheckout({
  onBrowse,
}: {
  onBrowse: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-background p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin
            aria-hidden="true"
            className="h-6 w-6"
          />
        </span>

        <h1 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">
          No active checkout
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Your checkout does not
          contain any products. Choose
          an animal or accessory to
          continue.
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={onBrowse}
          className="mt-6 h-12 rounded-xl px-6 font-bold"
        >
          Browse Products
        </Button>
      </div>
    </div>
  );
}
