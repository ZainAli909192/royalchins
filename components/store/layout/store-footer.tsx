"use client";

import Link from "next/link";

import {
    Mail,
    MessageCircle,
    Phone,
} from "lucide-react";

import { useStoreSettings } from "@/components/store/layout/store-settings-provider";


export function StoreFooter() {
    const { brand, contact } = useStoreSettings();
    const telephone = contact.phone.replace(/[^\d+]/g, "");
    const whatsappNumber = contact.whatsapp.replace(/\D/g, "");
    const instagramHandle = contact.instagram.replace(/^@/, "");

    return (
        <footer className="border-t border-border bg-secondary pb-[76px] text-secondary-foreground lg:pb-0">
            <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
                <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
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
                    </div>

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
                                href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#"}
                                icon={MessageCircle}
                            >
                                {contact.whatsapp ? "WhatsApp" : "WhatsApp unavailable"}
                            </ContactLink>

                            <a
                                href={instagramHandle ? `https://www.instagram.com/${instagramHandle}/` : "#"}
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

                <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-secondary-foreground/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © 2026 {brand.storeName}. All rights reserved.
                    </p>

                    <p>
                        United Arab Emirates
                    </p>
                </div>
            </div>
        </footer>
    );
}

type FooterColumnProps = {
    title: string;
    links: {
        label: string;
        href: string;
    }[];
};

function FooterColumn({
    title,
    links,
}: FooterColumnProps) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-secondary-foreground">
                {title}
            </h3>

            <div className="mt-4 space-y-3">
                {links.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="block w-fit text-sm text-secondary-foreground/65 transition-colors hover:text-secondary-foreground"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

type ContactLinkProps = {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
};

function ContactLink({
    href,
    icon: Icon,
    children,
}: ContactLinkProps) {
    return (
        <a
            href={href}
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
