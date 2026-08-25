"use client";

import {
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Edit3,
  FileText,
  HelpCircle,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";

import {
  FaqFormDialog,
  type FaqFormValues,
} from "@/components/admin/pages/faq-form-dialog";

import { DeleteFaqDialog } from "@/components/admin/pages/delete-faq-dialog";

import { FormAlert } from "@/components/forms/form-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab =
  | "pages"
  | "faqs";

type ContentStatus =
  | "Active"
  | "Inactive";

type ContentPage = {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: ContentStatus;
  updatedAt: string;
};

type Faq = {
  id: number;
  category: string;
  question: string;
  answer: string;
  status: ContentStatus;
  sortOrder: number;
};

const initialPages: ContentPage[] = [
  {
    id: 1,
    title: "About Royal Chins",
    slug: "about",
    description:
      "Manage the main About Us content shown on the website.",
    status: "Active",
    updatedAt: "24 Aug 2026",
  },

  {
    id: 3,
    title: "Privacy Policy",
    slug: "privacy-policy",
    description:
      "Manage the website privacy policy content.",
    status: "Active",
    updatedAt: "20 Aug 2026",
  },
  {
    id: 4,
    title: "Terms & Conditions",
    slug: "terms",
    description:
      "Manage customer-facing terms and conditions.",
    status: "Active",
    updatedAt: "18 Aug 2026",
  },
];

const initialFaqs: Faq[] = [
  {
    id: 1,
    category: "Orders",
    question:
      "How can I place an order?",
    answer:
      "Choose the animal or accessory you want, select Buy Now, sign in or create an account, enter delivery details, review your order and complete payment.",
    status: "Active",
    sortOrder: 1,
  },
  {
    id: 2,
    category: "Delivery",
    question:
      "Where does Royal Chins deliver?",
    answer:
      "Royal Chins currently delivers within the UAE according to available delivery coverage.",
    status: "Active",
    sortOrder: 2,
  },
  {
    id: 3,
    category: "Payments",
    question:
      "Which payment methods are accepted?",
    answer:
      "Customers can pay using credit or debit card, Tamara or Tabby.",
    status: "Active",
    sortOrder: 3,
  },
  {
    id: 4,
    category: "Reviews",
    question:
      "Who can submit a review?",
    answer:
      "Reviews are available to verified customers who purchased the related product.",
    status: "Active",
    sortOrder: 4,
  },
];

export default function PagesFaqPage() {
    const router = useRouter();
  const [tab, setTab] =
    useState<Tab>("pages");

  const [pages] =
    useState<ContentPage[]>(
      initialPages
    );

  const [faqs, setFaqs] =
    useState<Faq[]>(
      initialFaqs
    );

  const [search, setSearch] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    faqDialogOpen,
    setFaqDialogOpen,
  ] = useState(false);

  const [
    editingFaq,
    setEditingFaq,
  ] = useState<Faq | null>(
    null
  );

  const [
    faqToDelete,
    setFaqToDelete,
  ] = useState<Faq | null>(
    null
  );

  /* =========================
     FILTERED DATA
  ========================= */

  const filteredFaqs =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      return [...faqs]
        .sort(
          (a, b) =>
            a.sortOrder -
            b.sortOrder
        )
        .filter(
          (faq) =>
            faq.question
              .toLowerCase()
              .includes(value) ||
            faq.answer
              .toLowerCase()
              .includes(value) ||
            faq.category
              .toLowerCase()
              .includes(value)
        );
    }, [faqs, search]);

  const filteredPages =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      return pages.filter(
        (page) =>
          page.title
            .toLowerCase()
            .includes(value) ||
          page.description
            .toLowerCase()
            .includes(value)
      );
    }, [pages, search]);

  /* =========================
     FAQ CREATE / EDIT
  ========================= */

  const openCreateFaq =
    () => {
      setEditingFaq(null);
      setFaqDialogOpen(true);
    };

  const openEditFaq = (
    faq: Faq
  ) => {
    setEditingFaq(faq);
    setFaqDialogOpen(true);
  };

  const closeFaqDialog =
    () => {
      setFaqDialogOpen(false);
      setEditingFaq(null);
    };

  const handleSaveFaq = (
    values: FaqFormValues
  ) => {
    if (editingFaq) {
      setFaqs(
        (current) =>
          current.map(
            (faq) =>
              faq.id ===
              editingFaq.id
                ? {
                    ...faq,
                    ...values,
                  }
                : faq
          )
      );

      setSuccessMessage(
        "FAQ updated successfully."
      );
    } else {
      const nextOrder =
        faqs.length
          ? Math.max(
              ...faqs.map(
                (faq) =>
                  faq.sortOrder
              )
            ) + 1
          : 1;

      const newFaq: Faq = {
        id: Date.now(),
        ...values,
        sortOrder:
          nextOrder,
      };

      setFaqs(
        (current) => [
          ...current,
          newFaq,
        ]
      );

      setSuccessMessage(
        "FAQ added successfully."
      );
    }

    closeFaqDialog();
  };

  /* =========================
     FAQ DELETE
  ========================= */

  const confirmDeleteFaq =
    () => {
      if (!faqToDelete) {
        return;
      }

      setFaqs((current) => {
        const remaining =
          current
            .filter(
              (faq) =>
                faq.id !==
                faqToDelete.id
            )
            .sort(
              (a, b) =>
                a.sortOrder -
                b.sortOrder
            );

        return remaining.map(
          (faq, index) => ({
            ...faq,
            sortOrder:
              index + 1,
          })
        );
      });

      setFaqToDelete(null);

      setSuccessMessage(
        "FAQ deleted successfully."
      );
    };

  /* =========================
     FAQ STATUS
  ========================= */

  const toggleFaqStatus = (
    faq: Faq
  ) => {
    setFaqs(
      (current) =>
        current.map(
          (item) =>
            item.id === faq.id
              ? {
                  ...item,
                  status:
                    item.status ===
                    "Active"
                      ? "Inactive"
                      : "Active",
                }
              : item
        )
    );

    setSuccessMessage(
      faq.status === "Active"
        ? "FAQ set to inactive."
        : "FAQ activated successfully."
    );
  };

  /* =========================
     FAQ ORDER
  ========================= */

  const moveFaq = (
    faqId: number,
    direction:
      | "up"
      | "down"
  ) => {
    const sorted =
      [...faqs].sort(
        (a, b) =>
          a.sortOrder -
          b.sortOrder
      );

    const index =
      sorted.findIndex(
        (faq) =>
          faq.id === faqId
      );

    if (index === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        sorted.length
    ) {
      return;
    }

    const reordered =
      [...sorted];

    [
      reordered[index],
      reordered[targetIndex],
    ] = [
      reordered[targetIndex],
      reordered[index],
    ];

    setFaqs(
      reordered.map(
        (faq, faqIndex) => ({
          ...faq,
          sortOrder:
            faqIndex + 1,
        })
      )
    );
  };

  const getStatusClass = (
    status: ContentStatus
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
        title="Pages / FAQ"
        description="Manage basic website content and frequently asked questions."
        action={
          tab === "faqs" ? (
            <Button
              type="button"
              variant="primary"
              onClick={
                openCreateFaq
              }
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                Add FAQ
              </span>
            </Button>
          ) : undefined
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

      {/* =========================
          TABS
      ========================= */}

      <section className="rounded-xl border border-border bg-white p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2 sm:inline-grid">
          <button
            type="button"
            onClick={() => {
              setTab("pages");
              setSearch("");
            }}
            className={`flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
              tab === "pages"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface-subtle hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            Pages
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("faqs");
              setSearch("");
            }}
            className={`flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
              tab === "faqs"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface-subtle hover:text-foreground"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            FAQs
          </button>
        </div>
      </section>

      {/* =========================
          SEARCH
      ========================= */}

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm sm:p-5">
        <Input
          type="search"
          placeholder={
            tab === "faqs"
              ? "Search FAQs..."
              : "Search pages..."
          }
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
      </section>

      {/* =========================
          FAQS
      ========================= */}

      {tab === "faqs" &&
        (filteredFaqs.length ===
        0 ? (
          <AdminEmptyState
            type="search"
            title="No FAQs found"
            description="Try changing your search or add a new FAQ."
          />
        ) : (
          <>
            {/* Desktop */}
            <section className="hidden overflow-hidden rounded-xl border border-border bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead className="bg-surface-subtle">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Order
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Question
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
                    {filteredFaqs.map(
                      (
                        faq,
                        index
                      ) => (
                        <tr
                          key={
                            faq.id
                          }
                          className="border-t border-border"
                        >
                          {/* Order */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="min-w-[24px] text-sm font-semibold text-muted-foreground">
                                {
                                  faq.sortOrder
                                }
                              </span>

                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  title="Move Up"
                                  aria-label="Move FAQ up"
                                  disabled={
                                    index ===
                                    0
                                  }
                                  onClick={() =>
                                    moveFaq(
                                      faq.id,
                                      "up"
                                    )
                                  }
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  title="Move Down"
                                  aria-label="Move FAQ down"
                                  disabled={
                                    index ===
                                    filteredFaqs.length -
                                      1
                                  }
                                  onClick={() =>
                                    moveFaq(
                                      faq.id,
                                      "down"
                                    )
                                  }
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-medium text-foreground">
                              {
                                faq.category
                              }
                            </span>
                          </td>

                          {/* Question */}
                          <td className="max-w-[520px] px-5 py-4">
                            <p className="text-sm font-semibold text-foreground">
                              {
                                faq.question
                              }
                            </p>

                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                              {
                                faq.answer
                              }
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                toggleFaqStatus(
                                  faq
                                )
                              }
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${getStatusClass(
                                faq.status
                              )}`}
                            >
                              {
                                faq.status
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
                                title="Edit FAQ"
                                aria-label={`Edit ${faq.question}`}
                                onClick={() =>
                                  openEditFaq(
                                    faq
                                  )
                                }
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                title="Delete FAQ"
                                aria-label={`Delete ${faq.question}`}
                                onClick={() =>
                                  setFaqToDelete(
                                    faq
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
                MOBILE FAQ CARDS
            ========================= */}

            <div className="space-y-3 md:hidden">
              {filteredFaqs.map(
                (
                  faq,
                  index
                ) => (
                  <article
                    key={
                      faq.id
                    }
                    className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                  >
                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="inline-flex rounded-full bg-surface-subtle px-2.5 py-1 text-xs font-medium text-foreground">
                            {
                              faq.category
                            }
                          </span>

                          <h3 className="mt-3 text-sm font-semibold leading-6 text-foreground">
                            {
                              faq.question
                            }
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleFaqStatus(
                              faq
                            )
                          }
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${getStatusClass(
                            faq.status
                          )}`}
                        >
                          {
                            faq.status
                          }
                        </button>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {
                          faq.answer
                        }
                      </p>
                    </div>

                    {/* Mobile Actions */}
                    <div className="border-t border-border bg-surface-subtle/30 p-3">
                      <div className="flex items-center justify-between gap-3">
                        {/* Reorder */}
                        <div className="flex items-center gap-2">
                          <span className="min-w-[22px] text-xs font-semibold text-muted-foreground">
                            #
                            {
                              faq.sortOrder
                            }
                          </span>

                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              title="Move Up"
                              aria-label="Move FAQ up"
                              disabled={
                                index ===
                                0
                              }
                              onClick={() =>
                                moveFaq(
                                  faq.id,
                                  "up"
                                )
                              }
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              title="Move Down"
                              aria-label="Move FAQ down"
                              disabled={
                                index ===
                                filteredFaqs.length -
                                  1
                              }
                              onClick={() =>
                                moveFaq(
                                  faq.id,
                                  "down"
                                )
                              }
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Edit / Delete */}
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Edit FAQ"
                            aria-label={`Edit ${faq.question}`}
                            onClick={() =>
                              openEditFaq(
                                faq
                              )
                            }
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Delete FAQ"
                            aria-label={`Delete ${faq.question}`}
                            onClick={() =>
                              setFaqToDelete(
                                faq
                              )
                            }
                            className="text-error hover:border-error hover:bg-[var(--error-background)] hover:text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          </>
        ))}

      {/* =========================
          PAGES
      ========================= */}

     {/* =========================
    PAGES
========================= */}

{tab === "pages" &&
  (filteredPages.length === 0 ? (
    <AdminEmptyState
      type="search"
      title="No pages found"
      description="Try changing your search."
    />
  ) : (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filteredPages.map((page) => (
        <article
          key={page.id}
          className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-white
            p-5
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-primary/20
            hover:shadow-md
          "
        >
          {/* Purple accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                page.status
              )}`}
            >
              {page.status}
            </span>
          </div>

          {/* Content */}
          <div className="mt-5">
            <h2 className="text-lg font-bold text-foreground">
              {page.title}
            </h2>

            <p className="mt-2 min-h-[48px] text-sm leading-6 text-muted-foreground">
              {page.description}
            </p>
          </div>

          {/* Meta */}
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-surface-subtle p-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Page URL
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-foreground">
                /{page.slug}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Last Updated
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {page.updatedAt}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Website content
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(
                  `/admin/pages/${page.slug}`
                )
              }
              className="
                border-primary/30
                text-primary
                hover:border-primary
                hover:bg-primary/5
                hover:text-primary
              "
            >
              <span className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Content
              </span>
            </Button>
          </div>
        </article>
      ))}
    </div>
  ))}


      <FaqFormDialog
        open={
          faqDialogOpen
        }
        mode={
          editingFaq
            ? "edit"
            : "create"
        }
        initialValues={
          editingFaq
            ? {
                category:
                  editingFaq.category,

                question:
                  editingFaq.question,

                answer:
                  editingFaq.answer,

                status:
                  editingFaq.status,
              }
            : undefined
        }
        onClose={
          closeFaqDialog
        }
        onSubmit={
          handleSaveFaq
        }
      />

      <DeleteFaqDialog
        open={
          Boolean(
            faqToDelete
          )
        }
        question={
          faqToDelete?.question
        }
        onClose={() =>
          setFaqToDelete(null)
        }
        onConfirm={
          confirmDeleteFaq
        }
      />
    </div>
  );
}