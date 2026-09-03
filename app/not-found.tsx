import Link from "next/link";

import {
    Home,
    PawPrint,
} from "lucide-react";

import { Reveal } from "@/components/store/shared/reveal";
import {StoreHeader} from "@/components/store/layout/store-header";

export default function NotFound() {
    return (
        <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-background">
            <StoreHeader />
            {/* Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

                <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

                <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" />

                <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5" />
            </div>

            <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-[1440px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-3xl text-center">
                    {/* Icon */}
                    <Reveal
                        direction="down"
                        distance={18}
                    >
                        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                            <PawPrint className="h-6 w-6" />
                        </div>
                    </Reveal>

                    {/* 404 */}
                    <Reveal
                        direction="up"
                        distance={20}
                        delay={0.05}
                    >
                        <div className="relative mx-auto w-fit">
                            <p className="select-none text-[110px] font-black leading-none tracking-[-0.08em] text-secondary sm:text-[150px] lg:text-[190px]">
                                404
                            </p>

                            <div className="absolute right-[-12px] top-[8px] h-4 w-4 rounded-full bg-primary sm:right-[-18px] sm:top-[15px] sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                        </div>
                    </Reveal>

                    {/* Content */}
                    <Reveal
                        direction="up"
                        distance={20}
                        delay={0.1}
                    >
                        <div className="mx-auto mt-3 max-w-xl">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                                Looks like this little one wandered off
                            </p>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                                Page not found.
                            </h1>

                            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                                The page you&apos;re looking for may have moved,
                                been removed, or never existed. Let&apos;s get
                                you back to Royal Chins.
                            </p>
                        </div>
                    </Reveal>

                    {/* Actions */}
                    <Reveal
                        direction="up"
                        distance={20}
                        delay={0.15}
                    >
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/"
                                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 sm:w-auto"
                            >
                                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                    <Home className="h-4 w-4 shrink-0" />

                                    <span>
                                        Back to Home
                                    </span>
                                </span>
                            </Link>

                            
                        </div>
                    </Reveal>

                    {/* Bottom text */}
                    <Reveal
                        direction="up"
                        distance={16}
                        delay={0.2}
                    >
                        <div className="mx-auto mt-12 max-w-2xl border-t border-border pt-6">
                            <p className="text-xs leading-5 text-muted-foreground">
                                Looking for a companion? Explore our Chinchillas,
                                Guinea Pigs, Micro Squirrels and accessories.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </main>
    );
}