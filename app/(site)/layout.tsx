import { Navbar } from "@/components/web/navbar";
import { SiteFooter } from "@/components/web/footer";
import { FloatingInquiry } from "@/components/marketing/floating-inquiry";
import { formatBusinessDays, formatBusinessHours, getContactConfig } from "@/lib/contact-config";

async function getSiteLayoutData() {
  try {
    const contactConfig = await getContactConfig();
    const primaryPhone = contactConfig.phones[0]?.value ?? "";
    const primaryPhoneLabel = contactConfig.phones[0]?.description ? `${contactConfig.phones[0].description}: ${contactConfig.phones[0].value}` : primaryPhone;
    const primaryEmail = contactConfig.emails[0]?.value ?? "";
    const hoursLabel = `${formatBusinessDays(contactConfig)} · ${formatBusinessHours(contactConfig)}`;

    return { primaryPhone, primaryPhoneLabel, primaryEmail, hoursLabel };
  } catch {
    return null;
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const layoutData = await getSiteLayoutData();
  if (!layoutData) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <Navbar />
        <div className="w-full flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <div className="w-full flex-1">{children}</div>
      <SiteFooter />
      <FloatingInquiry
        primaryPhone={layoutData.primaryPhone}
        primaryPhoneLabel={layoutData.primaryPhoneLabel}
        primaryEmail={layoutData.primaryEmail}
        hoursLabel={layoutData.hoursLabel}
      />
    </div>
  );
}
