"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock3,
  Package,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";

import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/store/shared/reveal";
import { Button } from "@/components/ui/button";

const refundReasons = [
  "Order cancelled before delivery",
  "Animal or item arrived with an issue",
  "Wrong item received",
  "Item damaged during delivery",
  "Duplicate payment",
  "Other",
];

export default function RefundRequestPage() {
  const [reason, setReason] =
    useState("");

  const [details, setDetails] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const params = useParams<{ id: string }>();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!reason || submitting) {
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch(`/api/store/account/orders/${encodeURIComponent(params.id)}/refund`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason, customerNote: details }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message ?? "Unable to submit refund request.");
      setSubmitted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit refund request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <RefundSubmitted />;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal
        direction="left"
        distance={30}
      >
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />

          <span>Back to orders</span>
        </Link>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <Reveal
            direction="up"
            distance={35}
          >
            <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:rounded-3xl sm:p-7 lg:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <RotateCcw className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Refund Request
                  </p>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Request a refund
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Tell us why you are requesting
                    a refund. Royal Chins will
                    review your request before any
                    refund is processed.
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-5"
          >
            <Reveal
              direction="up"
              distance={30}
              delay={0.05}
            >
              <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:rounded-3xl sm:p-7">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Why are you requesting a refund?
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Select the reason that best
                    describes your request.
                  </p>
                </div>

                <RevealGroup
                  stagger={0.06}
                  className="mt-5 grid gap-3"
                >
                  {refundReasons.map(
                    (item) => (
                      <RevealItem
                        key={item}
                        direction="up"
                        distance={15}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setReason(item)
                          }
                          className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                            reason === item
                              ? "border-primary bg-primary/5"
                              : "border-border bg-background hover:border-primary/40"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              reason === item
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                          >
                            {reason === item && (
                              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                            )}
                          </span>

                          <span className="text-sm font-semibold text-foreground">
                            {item}
                          </span>
                        </button>
                      </RevealItem>
                    )
                  )}
                </RevealGroup>
              </section>
            </Reveal>

            <Reveal
              direction="up"
              distance={30}
            >
              <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:rounded-3xl sm:p-7">
                <label
                  htmlFor="refund-details"
                  className="text-sm font-bold text-foreground"
                >
                  Additional details
                </label>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Add any information that may help
                  us review your request.
                </p>

                <textarea
                  id="refund-details"
                  value={details}
                  onChange={(event) =>
                    setDetails(
                      event.target.value
                    )
                  }
                  rows={5}
                  maxLength={1000}
                  placeholder="Tell us more about the issue..."
                  className="mt-4 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <div className="mt-2 text-right text-[11px] text-muted-foreground">
                  {details.length}/1000
                </div>
              </section>
            </Reveal>

            <Reveal
              direction="up"
              distance={25}
            >
              <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
                {error && <p className="mb-4 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">{error}</p>}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    asChild
                    type="button"
                    variant="secondary"
                    className="h-12 rounded-xl px-5"
                  >
                    <Link
                      href="/account/orders"
                      className="whitespace-nowrap"
                    >
                      Cancel
                    </Link>
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!reason || submitting}
                    className="h-12 rounded-xl px-6 sm:min-w-[190px]"
                  >
                    <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                      <RotateCcw className="h-4 w-4 shrink-0" />

                      <span>
                        {submitting ? "Submitting..." : "Submit Request"}
                      </span>
                    </span>
                  </Button>
                </div>
              </section>
            </Reveal>
          </form>
        </div>

        <aside className="space-y-4">
          <Reveal
            direction="right"
            distance={35}
          >
            <OrderSummary />
          </Reveal>

          <Reveal
            direction="right"
            distance={35}
            delay={0.08}
          >
            <RefundInformation />
          </Reveal>
        </aside>
      </div>
    </main>
  );
}

function OrderSummary() {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:rounded-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
        Order
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
          <Package className="h-5 w-5 text-foreground" />
        </span>

        <div>
          <p className="text-sm font-bold text-foreground">
            Order details
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Your eligible order will
            appear here.
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Refund amount
          </span>

          <span className="text-sm font-bold text-foreground">
            Calculated after review
          </span>
        </div>
      </div>
    </section>
  );
}

function RefundInformation() {
  const items = [
    {
      icon: Clock3,
      title: "Admin review",
      text: "Every refund request is reviewed before approval.",
    },
    {
      icon: Banknote,
      title: "Original payment method",
      text: "Approved refunds are returned through the original payment method.",
    },
    {
      icon: ShieldCheck,
      title: "Secure processing",
      text: "Payment refunds are processed securely through the payment provider.",
    },
  ];

  return (
    <section className="rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:rounded-3xl">
      <h2 className="text-sm font-bold text-foreground">
        What happens next?
      </h2>

      <div className="mt-4 space-y-4">
        {items.map(
          ({
            icon: Icon,
            title,
            text,
          }) => (
            <div
              key={title}
              className="flex items-start gap-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                <Icon className="h-4 w-4" />
              </span>

              <div>
                <p className="text-xs font-bold text-foreground">
                  {title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  {text}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function RefundSubmitted() {
  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-2xl items-center justify-center px-4 py-10 sm:px-6">
      <Reveal
        direction="scale"
        scaleFrom={0.94}
      >
        <section className="w-full rounded-3xl border border-border bg-background p-6 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </span>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Request Submitted
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            We received your refund request
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Royal Chins will review your request.
            You can check its latest status from
            your order details.
          </p>

          <Button
            asChild
            variant="primary"
            className="mt-7 h-12 rounded-xl px-6"
          >
            <Link
              href="/account/orders"
              className="whitespace-nowrap"
            >
              <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <Package className="h-4 w-4 shrink-0" />

                <span>
                  View My Orders
                </span>
              </span>
            </Link>
          </Button>
        </section>
      </Reveal>
    </main>
  );
}
