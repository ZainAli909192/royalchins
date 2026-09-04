import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import {
    BadgeCheck,
    Building2,
    ShieldCheck,
} from "lucide-react";

import {
    employees,
} from "@/lib/store/employees";


export const metadata: Metadata = {
    title: "Employee Verification",
    description:
        "Verify official Royal Chins employees using their employee identification number.",
    robots: { index: false, follow: false },
};


export default function EmployeesPage() {
    const employeeList =
        Object.values(employees);

    return (
        <main className="min-h-screen bg-[#f7f7f8] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Hero */}
                <section className="overflow-hidden rounded-3xl border border-[#6F3CC3]/15 bg-white shadow-sm">
                    <div className="relative px-5 py-10 text-center sm:px-8 sm:py-14">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-[#6F3CC3]/8 blur-3xl"
                        />

                        <div className="relative">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6F3CC3]/10 text-[#6F3CC3]">
                                <ShieldCheck className="h-7 w-7" />
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#6F3CC3]">
                                Official Verification
                            </p>

                            <h1 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                                Royal Chins Employees
                            </h1>

                            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-black/55 sm:text-base">
                                Verify official Royal Chins employees and confirm
                                their current employment status.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Employees */}
                <section className="mt-7">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6F3CC3]">
                                Employee Directory
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-black sm:text-2xl">
                                Verified Employees
                            </h2>
                        </div>

                        <p className="text-sm text-black/45">
                            {employeeList.length}{" "}
                            {employeeList.length === 1
                                ? "employee"
                                : "employees"}
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {employeeList.map((employee) => {
                            const isVerified =
                                employee.verified &&
                                employee.active;

                            return (
                                <Link
                                    key={employee.employeeId}
                                    href="#"
                                    className="group overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#6F3CC3]/20 hover:shadow-lg"
                                >
                                    {/* Image */}
                                    <div className="relative flex h-[340px] items-center justify-center overflow-hidden bg-[#fafafa] p-5">
                                        <Image
                                            src={employee.image}
                                            alt={`${employee.name} Royal Chins employee card`}
                                            width={900}
                                            height={1550}
                                            className="h-full w-auto rounded-xl object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                        />

                                        {isVerified && (
                                            <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                                                <BadgeCheck className="h-4 w-4 text-green-600" />

                                                Verified
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="border-t border-border p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6F3CC3]">
                                                    {employee.employeeId}
                                                </p>

                                                <h3 className="mt-2 text-lg font-bold leading-snug text-black">
                                                    {employee.name}
                                                </h3>

                                                <p className="mt-1 text-sm font-medium text-black/55">
                                                    {employee.designation}
                                                </p>
                                            </div>

                                            
                                        </div>

                                        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-black/45">
                                            <Building2 className="h-4 w-4 text-[#6F3CC3]" />

                                            <span>
                                                Royal Chins
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Verification Note */}
                <section className="mt-7 rounded-2xl border border-[#6F3CC3]/15 bg-[#6F3CC3]/5 p-5 sm:p-6">
                    <div className="flex gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6F3CC3]" />

                        <div>
                            <h3 className="text-sm font-bold text-black">
                                Employee Verification
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-black/55">
                                Each official Royal Chins employee card contains
                                an employee ID and may contain a QR code linking
                                directly to the employee&apos;s verification
                                page.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
