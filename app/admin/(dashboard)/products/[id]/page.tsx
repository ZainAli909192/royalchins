"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  Pencil,
  Tag,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { Button } from "@/components/ui/button";

type Animal = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: "Active" | "Inactive";
  description: string;
  images: string[];
};

const animals: Animal[] = [
  {
    id: 1,
    name: "White Chinchilla",
    category: "Chinchillas",
    price: 1450,
    quantity: 8,
    status: "Active",
    description:
      "Beautiful white chinchilla with a soft coat and calm temperament.",
    images: [
      "/images/animals/chinchilla-1.jpg",
      "/images/animals/chinchilla-2.jpg",
    ],
  },
  {
    id: 2,
    name: "Grey Chinchilla",
    category: "Chinchillas",
    price: 1350,
    quantity: 2,
    status: "Active",
    description:
      "Friendly grey chinchilla with a soft coat and active personality.",
    images: [],
  },
];

export default function AnimalDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const animalId = Number(params.id);

  const animal = animals.find((item) => item.id === animalId);

  if (!animal) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Animal Details"
          description="View animal information."
        />

        <div className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-foreground">
            Animal not found
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            The animal you are looking for does not exist.
          </p>

          <Button
            variant="outline"
            onClick={() => router.push("/admin/products")}
            className="mt-5"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Animals
            </span>
          </Button>
        </div>
      </div>
    );
  }

  const stockStatus =
    animal.quantity === 0
      ? "Out of Stock"
      : animal.quantity <= 2
        ? "Low Stock"
        : "In Stock";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Animal Details"
        description="View animal information, pricing and stock."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/animals")}
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <ArrowLeft className="h-4 w-4" />
                Back
              </span>
            </Button>

            <Button
              variant="primary"
              onClick={() =>
                router.push(`/admin/animals/${animal.id}/edit`)
              }
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <Pencil className="h-4 w-4" />
                Edit Animal
              </span>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Animal Images
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Uploaded images for this animal.
            </p>
          </div>

          {animal.images.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {animal.images.map((image, index) => (
                <div
                  key={image}
                  className="relative overflow-hidden rounded-xl border border-border bg-surface-subtle"
                >
                  <Image
                    src={image}
                    alt={`${animal.name} image ${index + 1}`}
                    width={500}
                    height={500}
                    className="aspect-square w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-1 text-[10px] font-medium text-white">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-xl bg-surface-subtle">
              <p className="text-sm text-muted-foreground">
                No images available.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {animal.name}
              </h2>

              <p className="mt-1 text-sm text-primary">
                {animal.category}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                animal.status === "Active"
                  ? "bg-[var(--success-background)] text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {animal.status}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface-subtle p-4">
              <p className="text-xs text-muted-foreground">
                Price
              </p>

              <p className="mt-1 text-lg font-bold text-foreground">
                AED {animal.price.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-surface-subtle p-4">
              <p className="text-xs text-muted-foreground">
                Quantity
              </p>

              <p className="mt-1 text-lg font-bold text-foreground">
                {animal.quantity}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />

                <span className="text-sm text-muted-foreground">
                  Category
                </span>
              </div>

              <span className="text-sm font-medium text-foreground">
                {animal.category}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Boxes className="h-5 w-5 text-primary" />

                <span className="text-sm text-muted-foreground">
                  Stock Status
                </span>
              </div>

              <span
                className={`text-sm font-medium ${
                  stockStatus === "Out of Stock"
                    ? "text-error"
                    : stockStatus === "Low Stock"
                      ? "text-warning"
                      : "text-success"
                }`}
              >
                {stockStatus}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground">
              Description
            </h3>

            <div className="mt-2 rounded-xl bg-surface-subtle p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {animal.description}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}