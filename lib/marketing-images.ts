export const marketingImages = {
  heroLab: "/marketing/hero-lab.svg",
  warehouse: "/marketing/warehouse.svg",
  consultation: "/marketing/consultation.svg",
  packaging: "/marketing/packaging.svg",
  research: "/marketing/research.svg",
  catalog: "/marketing/catalog.svg",
  hospitalInterior: "/marketing/office.svg",
  pillsDetail: "/marketing/pills-detail.svg",
  teamMeeting: "/marketing/team.svg",
  delivery: "/marketing/delivery.svg",
  reception: "/marketing/office.svg",
  microscope: "/marketing/molecule.svg",
} as const;

const catalogFallbackImages = [
  marketingImages.heroLab,
  marketingImages.consultation,
  marketingImages.warehouse,
  marketingImages.packaging,
  marketingImages.research,
  marketingImages.catalog,
] as const;

export function getStableMarketingFallback(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return catalogFallbackImages[hash % catalogFallbackImages.length] ?? marketingImages.heroLab;
}
