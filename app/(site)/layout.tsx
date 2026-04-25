import { Navbar } from "@/components/web/navbar";
import { SiteFooter } from "@/components/web/footer";
import { FloatingInquiry } from "@/components/marketing/floating-inquiry";
import { defaultPublicContactConfig, getContactConfig } from "@/lib/contact-config";

async function getSiteLayoutContactData() {
  const contactConfig = await getContactConfig().catch(() => defaultPublicContactConfig);

  return {
    primaryPhone: contactConfig.phones[0]?.value,
    primaryEmail: contactConfig.emails[0]?.value,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { primaryPhone, primaryEmail } = await getSiteLayoutContactData();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <div className="w-full flex-1">{children}</div>
      <SiteFooter />
      <FloatingInquiry primaryPhone={primaryPhone} primaryEmail={primaryEmail} />
    </div>
  );
}
