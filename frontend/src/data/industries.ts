export interface IndustryGroup {
  label: string;
  options: string[];
}

export const industries: IndustryGroup[] = [
  {
    label: "Trade & Commerce",
    options: [
      "Retail & E-commerce",
      "Wholesale & Distribution",
      "Import & Export",
      "Consumer Goods & FMCG",
    ],
  },
  {
    label: "Industry & Manufacturing",
    options: [
      "Manufacturing (General)",
      "Automotive & Vehicle Assembly",
      "Aerospace & Defense",
      "Electronics & Semiconductors",
      "Chemicals & Petrochemicals",
      "Plastics & Rubber",
      "Metals & Steel",
      "Mining & Extractives",
      "Textile & Apparel",
      "Furniture & Home Goods",
      "Packaging & Containers",
      "Printing & Publishing",
    ],
  },
  {
    label: "Food & Agriculture",
    options: [
      "Agriculture & Agribusiness",
      "Food & Beverage Processing",
      "Cold Chain & Refrigeration",
      "Animal Feed & Veterinary",
      "Forestry, Timber & Paper",
      "Fishing & Aquaculture",
    ],
  },
  {
    label: "Energy & Resources",
    options: [
      "Oil & Gas",
      "Energy & Utilities",
      "Renewable Energy",
      "Water & Sanitation",
      "Waste Management & Recycling",
    ],
  },
  {
    label: "Health & Life Sciences",
    options: [
      "Pharmaceuticals",
      "Medical Devices & Equipment",
      "Healthcare & Hospitals",
      "Biotechnology",
      "Cosmetics & Personal Care",
    ],
  },
  {
    label: "Logistics & Infrastructure",
    options: [
      "Logistics & 3PL",
      "Warehousing & Fulfillment",
      "Transportation & Freight",
      "Marine & Shipping",
      "Rail & Road Infrastructure",
      "Aviation & Air Cargo",
      "Customs & Compliance",
    ],
  },
  {
    label: "Technology",
    options: [
      "Technology & Software",
      "Telecommunications",
      "Hardware & IT Equipment",
      "Cloud & Data Centers",
    ],
  },
  {
    label: "Finance & Professional Services",
    options: [
      "Financial Services & Banking",
      "Insurance",
      "Consulting & Advisory",
      "Legal Services",
    ],
  },
  {
    label: "Public & Social Sector",
    options: [
      "Government & Public Sector",
      "Non-Profit & NGO",
      "International Aid & Relief",
      "Education & Research",
      "Defence & Military Procurement",
    ],
  },
  {
    label: "Lifestyle & Services",
    options: [
      "Hospitality & Tourism",
      "Sports, Fitness & Recreation",
      "Media & Entertainment",
      "Real Estate & Construction",
      "Jewelry & Luxury Goods",
    ],
  },
  {
    label: "Other",
    options: ["Other"],
  },
];
