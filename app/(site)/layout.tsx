import { Navbar } from "@/components/web/navbar";
import { SiteFooter } from "@/components/web/footer";
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <div className="w-full flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
