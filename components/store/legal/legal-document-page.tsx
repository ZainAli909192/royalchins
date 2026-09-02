"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  Mail,
  MessageSquareText,
  Scale,
} from "lucide-react";

import {
  Reveal,
} from "@/components/store/shared/reveal";

import type {
  LegalSection,
} from "@/lib/store/legal/terms-content";

type LegalDocumentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  effectiveDate?: string;
  sections: LegalSection[];
};

export function LegalDocumentPage({
  eyebrow,
  title,
  description,
  lastUpdated,
  effectiveDate,
  sections,
}: LegalDocumentPageProps) {
  return (
    <main
      id="top"
      className="bg-[#FAFAFA] text-foreground"
    >
      {/* Hero */}
      <section className="border-b border-border bg-[#F7F3FC]">
        <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <Reveal
            direction="left"
            distance={25}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-primary sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />

              <span>
                Back to Royal Chins
              </span>
            </Link>
          </Reveal>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <Reveal
              direction="up"
              distance={25}
            >
              <div className="max-w-3xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Scale className="h-5 w-5" />
                </div>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                  {eyebrow}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] lg:leading-[1.08]">
                  {title}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
                  {description}
                </p>
              </div>
            </Reveal>

            <Reveal
              direction="right"
              distance={25}
            >
              <div className="rounded-2xl border border-primary/15 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-4.5 w-4.5" />
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Business identity
                    </p>

                    <p className="mt-1 text-sm font-bold text-foreground">
                      Royal Chins
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Customer-facing brand
                      operated by Royal Chains,
                      Abu Dhabi, UAE.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal
            direction="up"
            distance={20}
            delay={0.05}
          >
            <div className="mt-7 flex flex-wrap gap-3">
              <MetaBadge
                label="Last updated"
                value={lastUpdated}
              />

              {effectiveDate && (
                <MetaBadge
                  label="Effective"
                  value={effectiveDate}
                />
              )}

              <MetaBadge
                label="Jurisdiction"
                value="United Arab Emirates"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <Reveal
            direction="left"
            distance={25}
            className="hidden lg:block"
          >
            <aside className="sticky top-24">
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="border-b border-border px-4 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />

                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
                      On this page
                    </p>
                  </div>

                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    Jump directly to any
                    section.
                  </p>
                </div>

                <nav className="max-h-[68vh] overflow-y-auto p-2">
                  {sections.map(
                    (
                      section,
                      index
                    ) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="group flex items-start gap-3 rounded-xl px-3 py-2.5 text-xs transition-colors hover:bg-primary/5"
                      >
                        <span className="mt-0.5 flex h-5 min-w-5 items-center justify-center rounded-md bg-surface-subtle px-1.5 text-[10px] font-bold text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-white">
                          {index + 1}
                        </span>

                        <span className="min-w-0 flex-1 font-semibold leading-5 text-muted-foreground transition-colors group-hover:text-primary">
                          {section.title.replace(
                            /^\d+\.\s*/,
                            ""
                          )}
                        </span>

                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </a>
                    )
                  )}
                </nav>
              </div>

              <div className="mt-4 rounded-2xl bg-black p-4 text-white">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Need clarification?
                </p>

                <p className="mt-2 text-sm font-bold">
                  Contact Royal Chins
                </p>

                <p className="mt-1 text-xs leading-5 text-white/60">
                  Our team can help with
                  orders, delivery,
                  refunds or account
                  questions.
                </p>

                <div className="mt-4 space-y-2">
                  <a
                    href="mailto:hello@royalchins.ae"
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-xs font-bold transition-colors hover:bg-white/15"
                  >
                    <Mail className="h-3.5 w-3.5" />

                    <span>
                      Email Us
                    </span>
                  </a>

                  <a
                    href="https://wa.me/971507801110"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-xs font-bold transition-colors hover:bg-white/15"
                  >
                    <MessageSquareText className="h-3.5 w-3.5" />

                    <span>
                      WhatsApp
                    </span>
                  </a>
                </div>
              </div>
            </aside>
          </Reveal>

          {/* Legal Document */}
          <div className="min-w-0">
            <Reveal
              direction="up"
              distance={20}
            >
              <div className="mb-5 rounded-2xl border border-primary/15 bg-primary/[0.045] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Important information
                    </p>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                      These Terms and Conditions
                      form part of your agreement
                      with Royal Chins when you
                      create an account, place an
                      order, or purchase through
                      our website.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="space-y-4">
              {sections.map(
                (
                  section,
                  index
                ) => (
                  <Reveal
                    key={section.id}
                    direction="up"
                    distance={22}
                  >
                    <article
                      id={section.id}
                      className="scroll-mt-28 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:p-6 lg:p-7"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg font-bold tracking-tight text-black sm:text-xl">
                            {section.title.replace(
                              /^\d+\.\s*/,
                              ""
                            )}
                          </h2>
                        </div>
                      </div>

                      {section.paragraphs &&
                        section.paragraphs.length >
                          0 && (
                          <div className="mt-5 space-y-4 sm:pl-[52px]">
                            {section.paragraphs.map(
                              (
                                paragraph,
                                paragraphIndex
                              ) => (
                                <p
                                  key={`${section.id}-${paragraphIndex}`}
                                  className="max-w-[780px] text-sm leading-7 text-muted-foreground sm:text-[15px] sm:leading-7"
                                >
                                  {paragraph}
                                </p>
                              )
                            )}
                          </div>
                        )}

                      {section.bullets &&
                        section.bullets.length >
                          0 && (
                          <ul className="mt-5 space-y-3 sm:pl-[52px]">
                            {section.bullets.map(
                              (
                                bullet,
                                bulletIndex
                              ) => (
                                <li
                                  key={`${section.id}-bullet-${bulletIndex}`}
                                  className="flex max-w-[780px] gap-3 text-sm leading-7 text-muted-foreground sm:text-[15px]"
                                >
                                  <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                                  <span>
                                    {bullet}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                    </article>
                  </Reveal>
                )
              )}
            </div>

            {/* Bottom CTA */}
            <Reveal
              direction="up"
              distance={25}
              className="mt-8"
            >
              <div className="overflow-hidden rounded-3xl bg-black">
                <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                      Questions about these terms?
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                      Contact Royal Chins
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                      If you need clarification
                      regarding an order,
                      delivery, refund or your
                      account, our team is
                      available to help.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href="mailto:hello@royalchins.ae"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    >
                      <Mail className="h-4 w-4" />

                      <span>
                        Email Us
                      </span>
                    </a>

                    <a
                      href="https://wa.me/971507801110"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white/10 px-5 text-sm font-bold text-white transition-colors hover:bg-white/15"
                    >
                      <MessageSquareText className="h-4 w-4" />

                      <span>
                        WhatsApp
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal
              direction="up"
              distance={15}
              className="mt-7 flex justify-center"
            >
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior:
                      "smooth",
                  });
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
              >
                <ArrowUp className="h-4 w-4" />

                <span>
                  Back to top
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

function MetaBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-primary/10 bg-white px-3.5 py-2 shadow-sm">
      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" />

      <p className="text-[11px] text-muted-foreground sm:text-xs">
        <span className="font-bold text-foreground">
          {label}:
        </span>{" "}
        {value}
      </p>
    </div>
  );
}