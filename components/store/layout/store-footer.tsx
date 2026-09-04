"use client";

import Link from "next/link";

import {
    FileText,
    LockKeyhole,
    Mail,
    MessageCircle,
    Phone,
    RotateCcw,
    ShieldCheck,
} from "lucide-react";

import { useStoreSettings } from "@/components/store/layout/store-settings-provider";


const legalLinks = [
    {
        label: "Terms & Conditions",
        href: "/terms-and-conditions",
        icon: FileText,
    },
    {
        label: "Refund & Cancellation",
        href: "/refund-and-cancellation-policy",
        icon: RotateCcw,
    },
    {
        label: "Privacy Policy",
        href: "/privacy-policy",
        icon: ShieldCheck,
    },
     {
        label: "Employees",
        href: "/employees",
        icon: ShieldCheck,
    },
];


export function StoreFooter() {
    const { brand, contact } = useStoreSettings();

    const telephone = contact.phone.replace(/[^\d+]/g, "");
    const whatsappNumber = contact.whatsapp.replace(/\D/g, "");
    const instagramHandle = contact.instagram.replace(/^@/, "");

    return (
        <footer className="border-t border-border bg-secondary pb-[76px] text-secondary-foreground lg:pb-0">
            <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
                <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            className="inline-flex"
                        >
                            <div className="rounded-xl bg-background px-3 py-2">
                                <img
                                    src={brand.logo || "/logo.png"}
                                    alt={brand.storeName}
                                    className="h-[54px] w-[115px] object-contain"
                                />
                            </div>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-secondary-foreground/65">
                            Browse pets and accessories available from {brand.storeName}.
                        </p>

                        <p className="mt-3 max-w-sm text-xs leading-5 text-secondary-foreground/45">
                            Royal Chins is operated by Royal Chains, Abu Dhabi,
                            United Arab Emirates.
                        </p>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-secondary-foreground">
                            Legal
                        </h3>

                        <div className="mt-4 space-y-2">
                            {legalLinks.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group flex w-fit items-center gap-2.5 rounded-lg py-1 text-sm text-secondary-foreground/65 transition-colors hover:text-secondary-foreground"
                                    >
                                        <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-primary" />

                                        <span>
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-secondary-foreground">
                            Contact
                        </h3>

                        <div className="mt-4 space-y-2">
                            <ContactLink
                                href={`mailto:${contact.email}`}
                                icon={Mail}
                            >
                                {contact.email}
                            </ContactLink>

                            <ContactLink
                                href={`tel:${telephone}`}
                                icon={Phone}
                            >
                                {contact.phone}
                            </ContactLink>

                            <ContactLink
                                href={
                                    whatsappNumber
                                        ? `https://wa.me/${whatsappNumber}`
                                        : "#"
                                }
                                icon={MessageCircle}
                                external
                            >
                                {contact.whatsapp
                                    ? "WhatsApp"
                                    : "WhatsApp unavailable"}
                            </ContactLink>

                            <a
                                href={
                                    instagramHandle
                                        ? `https://www.instagram.com/${instagramHandle}/`
                                        : "#"
                                }
                                target={instagramHandle ? "_blank" : undefined}
                                rel={instagramHandle ? "noreferrer" : undefined}
                                className="flex w-fit items-center gap-2.5 rounded-lg py-1 text-sm text-secondary-foreground/65 transition-colors hover:text-secondary-foreground"
                            >
                                <InstagramIcon />

                                <span>
                                    {contact.instagram || "Instagram"}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-xs text-secondary-foreground/50 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p>
                            © 2026 {brand.storeName}. All rights reserved.
                        </p>

                        <p className="mt-1">
                            United Arab Emirates
                        </p>
                    </div>

                    <Link
                        href="/admin/login"
                        className="group inline-flex w-fit items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-secondary-foreground/40 transition-colors hover:bg-white/5 hover:text-secondary-foreground"
                    >
                        <LockKeyhole className="h-3.5 w-3.5 shrink-0 transition-colors group-hover:text-primary" />

                        <span>
                            Admin
                        </span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}


type ContactLinkProps = {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
    external?: boolean;
};


function ContactLink({
    href,
    icon: Icon,
    children,
    external = false,
}: ContactLinkProps) {
    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="flex w-fit items-center gap-2.5 rounded-lg py-1 text-sm text-secondary-foreground/65 transition-colors hover:text-secondary-foreground"
        >
            <Icon className="h-4 w-4 shrink-0" />

            <span>
                {children}
            </span>
        </a>
    );
}


function InstagramIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 shrink-0"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
            />

            <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
            />

            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
            />
        </svg>
    );
}