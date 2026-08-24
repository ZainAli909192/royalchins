import type { ReactNode } from "react";

type AdminAuthLayoutProps = {
  children: ReactNode;
};

export default function AdminAuthLayout({
  children,
}: AdminAuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {children}
    </main>
  );
}