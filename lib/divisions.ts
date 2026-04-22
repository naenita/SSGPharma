import { marketingImages } from "@/lib/marketing-images";

/** Use these exact `catalogCategory` strings when tagging medicines in admin so division pages filter correctly. */
export type ProductDivision = {
  slug: string;
  title: string;
  catalogCategory: string;
  blurb: string;
  imageSrc: string;
  imageAlt: string;
};

export const productDivisions: ProductDivision[] = [
  {
    slug: "oncology",
    title: "Oncology",
    catalogCategory: "Oncology",
    blurb: "Chemotherapy, targeted therapy, and supportive care lines for oncology wards.",
    imageSrc: marketingImages.research,
    imageAlt: "Laboratory research setting relevant to oncology drug supply",
  },
  {
    slug: "rheumatology",
    title: "Rheumatology",
    catalogCategory: "Rheumatology",
    blurb: "DMARDs, biologics, and pain management for rheumatology clinics.",
    imageSrc: marketingImages.consultation,
    imageAlt: "Clinical consultation — rheumatology and chronic care",
  },
  {
    slug: "diabetes",
    title: "Diabetes",
    catalogCategory: "Diabetes",
    blurb: "Oral antidiabetics, insulins, and GLP-1 lines with predictable replenishment.",
    imageSrc: marketingImages.packaging,
    imageAlt: "Pharmaceutical packaging and diabetes care products",
  },
  {
    slug: "nephrology",
    title: "Nephrology",
    catalogCategory: "Nephrology",
    blurb: "Dialysis adjuncts, renal therapies, and electrolyte management.",
    imageSrc: marketingImages.heroLab,
    imageAlt: "Pharmacy shelf with medicines — nephrology supply",
  },
  {
    slug: "antibiotics",
    title: "Antibiotics",
    catalogCategory: "Antibiotics",
    blurb: "Broad and narrow spectrum antibiotics for IPD and emergency use.",
    imageSrc: marketingImages.catalog,
    imageAlt: "Medicine bottles and catalog — antibiotics division",
  },
  {
    slug: "vaccines",
    title: "Vaccines",
    catalogCategory: "Vaccines",
    blurb: "Cold-chain aware vaccine supply for institutions and outreach programs.",
    imageSrc: marketingImages.consultation,
    imageAlt: "Healthcare professional — immunization programs",
  },
];

export function getProductDivision(slug: string) {
  return productDivisions.find((d) => d.slug === slug);
}

export const serviceLines = [
  {
    slug: "hospital-supply",
    title: "Hospital supply",
    href: "/services/hospital-supply",
    blurb: "Indents, consignment, and ward-level replenishment.",
  },
  {
    slug: "wholesale-distribution",
    title: "Wholesale distribution",
    href: "/services/wholesale-distribution",
    blurb: "Bulk fulfilment for distributors and retail chains.",
  },
  {
    slug: "specialty-sourcing",
    title: "Specialty sourcing",
    href: "/services/specialty-sourcing",
    blurb: "Named patient, imports, and hard-to-find molecules.",
  },
] as const;
