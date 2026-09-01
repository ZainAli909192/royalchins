import Image from "next/image";
import Link from "next/link";

import {
    Mail,
    MessageCircle,
    Phone,
} from "lucide-react";


export function StoreFooter() {
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
                                <Image
                                    src="/logo.png"
                                    alt="Royal Chins"
                                    width={140}
                                    height={65}
                                    className="h-[54px] w-[115px] object-contain"
                                />
                            </div>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-secondary-foreground/65">
                            Browse pets and accessories available from Royal Chins.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-secondary-foreground">
                            Contact
                        </h3>

                        <div className="mt-4 space-y-2">
                            <ContactLink
                                href="mailto:theroyalchins@gmail.ae"
                                icon={Mail}
                            >
                                theroyalchins@gmail.ae
                            </ContactLink>

                            <ContactLink
                                href="tel:++971507801110"
                                icon={Phone}
                            >
                                +971 50 780 1110
                            </ContactLink>

                            <ContactLink
                                href="https://wa.me/971507801110"
                                icon={MessageCircle}
                            >
                                WhatsApp
                            </ContactLink>

                            <a
                                href="https://www.instagram.com/royal.chins/"
                                className="flex w-fit items-center gap-2.5 rounded-lg py-1 text-sm text-secondary-foreground/65 transition-colors hover:text-secondary-foreground"
                            >
                                <InstagramIcon />

                                <span>
                                    Instagram
                                </span>
                            </a>
                            <a href="/admin/login" >
                                Admin
                            </a>    
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-secondary-foreground/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © 2026 Royal Chins. All rights reserved.
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
