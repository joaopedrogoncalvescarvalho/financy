import { Toaster } from "@/components/ui/sonner";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="w-full px-4 pb-8 pt-8 sm:px-8 lg:px-12">{children}</main>
      <Toaster />
    </div>
  );
}
