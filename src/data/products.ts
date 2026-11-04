import { CurrencyCode, CurrencyConfig, LookbookRoom, MaterialSpotlight, PressQuote, Product, ReviewItem } from "@/types";

export const SHOWROOM_INFO = {
  brandName: "Mallikarjuna Furniture World",
  shortName: "Mallikarjuna Furniture World",
  tagline: "Comfort. Quality. Timeless Living.",
  city: "Kurnool",
  state: "Andhra Pradesh",
  phone: "+91 98490 12345",
  whatsappNumber: "919849012345",
  displayPhone: "+91 98490 12345",
  displayWhatsApp: "+91 98490 12345",
  address: "980-B1, Sanjeevaiah Circle, D.No. 87, near Nandyal Check Post, Valmiki Nagar, Madhavi Nagar, Kalluru, Kurnool, Andhra Pradesh 518002",
  landmark: "Near Nandyal Check Post, Sanjeevaiah Circle",
  timing: "10:00 AM – 9:00 PM (Open All 7 Days)",
  email: "enquiry@casablancasofas.com",
  instagramUrl: "https://www.instagram.com/mallikarjunafurnitureworld",
  // Google Business listing (Mallikarjuna Furniture World, Kurnool)
  googleMapsUrl: "https://share.google/O7MppyYwSSvoYCgfK",
  // Keyless Google Maps embed of the same listing (used for the "Visit Us" map)
  mapEmbedUrl: "https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sMallikarjuna+Furniture+World,+Kurnool",
  experienceArea: "15,000+ Sq. Ft. Multi-floor Luxury Showroom",
  establishedYear: 1998,
  guaranteeYears: 15,
};

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", rate: 1.0 },
  USD: { code: "USD", symbol: "$", rate: 0.012 },
  EUR: { code: "EUR", symbol: "€", rate: 0.011 },
  GBP: { code: "GBP", symbol: "£", rate: 0.0095 },
};

export const formatPriceINR = (amount: number): string => {
  const rounded = Math.round(amount);
  const str = rounded.toString();
  if (str.length <= 3) return `₹${str}`;
  const lastThree = str.slice(-3);
  const other = str.slice(0, -3);
  const formattedOther = other.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `₹${formattedOther},${lastThree}`;
};

export const formatPriceNumber = (amount: number): string => {
  const rounded = Math.round(amount);
  const str = rounded.toString();
  if (str.length <= 3) return str;
  const lastThree = str.slice(-3);
  const other = str.slice(0, -3);
  const formattedOther = other.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${formattedOther},${lastThree}`;
};

export const formatNumberDeterministic = (amount: number): string => {
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPriceWithCurrency = (priceUSD: number, currency: CurrencyCode, priceINR?: number): string => {
  if (currency === "INR") {
    const inr = priceINR || Math.round(priceUSD * 83.5);
    return formatPriceINR(inr);
  }
  const curr = CURRENCIES[currency];
  const converted = Math.round((priceINR ? priceINR / 83.5 : priceUSD) * (curr.rate / CURRENCIES.USD.rate));
  return `${curr.symbol}${formatNumberDeterministic(converted)}`;
};

export const getWhatsAppEnquiryUrl = (
  productName: string,
  config?: string,
  color?: string,
  budget?: string
): string => {
  let msg = `Hello Mallikarjuna Furniture World,\nI am interested in this product:\nProduct: ${productName}`;
  if (config) msg += `\nConfiguration: ${config}`;
  if (color) msg += `\nPreferred colour: ${color}`;
  if (budget) msg += `\nBudget: ${budget}`;
  msg += `\nPlease share the price, availability and showroom details.`;
  return `https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`;
};

export const getProductPDPWhatsAppUrl = (
  product: Product,
  configuration?: string,
  color?: string,
  budgetRange?: string
): string => {
  return getWhatsAppEnquiryUrl(product.name, configuration, color, budgetRange);
};

export const getShowroomBookingWhatsAppUrl = (
  date?: string,
  time?: string,
  interest?: string
): string => {
  let msg = `Hello Mallikarjuna Furniture World Kurnool,\nI would like to plan a visit to your showroom near Nandyal Check Post.`;
  if (date) msg += `\nPreferred Date: ${date}`;
  if (time) msg += `\nPreferred Time: ${time}`;
  if (interest) msg += `\nLooking for: ${interest}`;
  msg += `\nPlease confirm executive assistance and provide directions.`;
  return `https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`;
};

export const CATEGORIES_LIST = [
  {
    id: "sofas",
    slug: "sofas-kurnool",
    title: "Sofas & Couches",
    shortTitle: "Sofas",
    subtitle: "3-seater, Sectionals, L-shaped & Recliner sets",
    count: 24,
    description: "Discover curated sofas for every living space. Ergonomic lumbar support, high-density foam, and luxury European fabrics.",
  },
  {
    id: "recliners",
    slug: "recliners-kurnool",
    title: "Recliners & Loungers",
    shortTitle: "Recliners",
    subtitle: "Motorized zero-gravity, leather & swivel recliners",
    count: 16,
    description: "Experience effortless motorized relaxation. Certified German OKIN mechanisms with 5-year replacement warranty.",
  },
  {
    id: "beds",
    slug: "beds-cots-kurnool",
    title: "Beds & Mattresses",
    shortTitle: "Beds & Cots",
    subtitle: "Solid teakwood king cots & hydraulic storage",
    count: 28,
    description: "Handcrafted Burma teakwood cots and orthopedic pocket-spring mattresses engineered for spine alignment.",
  },
  {
    id: "dining",
    slug: "dining-tables-kurnool",
    title: "Dining Tables & Chairs",
    shortTitle: "Dining",
    subtitle: "6 & 8-seater Italian marble and teak sets",
    count: 18,
    description: "Bring family together over monolithic marble and hand-planed solid teak dining tables built for generations.",
  },
  {
    id: "curtains",
    slug: "curtains-blinds-kurnool",
    title: "Curtains & Blinds",
    shortTitle: "Curtains & Blinds",
    subtitle: "Motorized blackout drapes & sheer fabrics",
    count: 12,
    description: "Complete your interior transformation with tailored blackout fabrics, motorized Roman shades, and sheer linens.",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "contemporary-comfort-sofa",
    name: "Contemporary Comfort Sofa",
    subtitle: "Clean lines, soft upholstery and a modern silhouette with high-density comfort",
    category: "sofas",
    priceUSD: 650,
    priceINR: 48000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Signature Living",
    year: 2025,
    description: "Designed for modern Kurnool living rooms seeking understated luxury. Features curved armrests, 40-density cold-cure foam cores, and solid treated teak inner frames backed by our 15-year termite-proof warranty.",
    details: [
      "Solid Grade-A treated teakwood internal frame with anti-termite guarantee",
      "High-resilience 40-density virgin foam with plush pocketed spring suspension",
      "Stain-resistant luxury chenille & bouclé fabric with 50,000 Martindale rubs",
      "Customizable into 3-seater, 2-seater, 1-seater or L-shape chaise configurations",
    ],
    dimensions: "W 215 cm x D 92 cm x H 85 cm (Seat Height: 44 cm)",
    materials: "Treated Solid Teakwood, 40-Density Foam, Italian Bouclé Blend",
    primaryImage: "/images/mf-fluted-luxury-lounge.jpg",
    tag: "Bestseller",
    badge: "In Kurnool Showroom",
    warranty: "15-Year Teakwood Frame Warranty",
    availability: "Ready for immediate delivery in Kurnool & Rayalaseema",
    configurations: ["1-seater", "2-seater", "3-seater", "L-shaped / sectional", "3+1+1 Suite"],
    colors: [
      { name: "Warm Ivory Bouclé", hex: "#F3ECE1" },
      { name: "Midnight Navy", hex: "#102B46" },
      { name: "Pebble Charcoal", hex: "#3A3F45" },
      { name: "Muted Terracotta", hex: "#9C6250" },
    ],
    budgetRanges: ["Under ₹30,000", "₹30,000–₹60,000", "₹60,000–₹1,00,000", "Above ₹1,00,000", "Need guidance"],
    expandableSections: [
      {
        title: "Product Overview",
        content: "The Contemporary Comfort Sofa balances generous seating depth with structured architectural arms. Perfectly scaled for luxury apartments and independent villas in Kurnool.",
      },
      {
        title: "Frame & Internal Construction",
        content: "Constructed using chemically treated, kiln-seasoned Grade-A Burma teakwood. Every joint is doweled, glued, and corner-blocked to prevent creaks or structural sagging for decades.",
      },
      {
        title: "Customisation & Fabrics",
        content: "Choose from over 120+ stain-resistant European fabrics, pure leatherette, or genuine Italian leather. Swatches can be viewed in person at our Kurnool showroom.",
      },
      {
        title: "Warranty & Showroom Display",
        content: "Includes 15-year structural teakwood warranty and 5-year cushion sag warranty. On live display at Mallikarjuna Furniture World, near Nandyal Check Post, Kurnool.",
      },
    ],
    rating: 4.9,
    reviewCount: 46,
    inStock: true,
    featured: true,
    finishes: [
      { id: "ivory-boucle", name: "Warm Ivory Bouclé", colorHex: "#F3ECE1" },
      { id: "midnight-navy", name: "Midnight Navy Velvet", colorHex: "#102B46" },
      { id: "slate-charcoal", name: "Slate Charcoal Wool", colorHex: "#3A3F45" },
    ],
  },
  {
    id: "aurelia-wave-sofa",
    name: "Aurelia Wave Sculptural Curved Sofa",
    subtitle: "Organic flowing contours upholstered in tactile bouclé for conversational living",
    category: "sofas",
    priceUSD: 980,
    priceINR: 78000,
    priceOnEnquiry: true,
    designer: "Mallikarjuna Couture Atelier",
    year: 2026,
    description: "An architectural statement piece featuring a sweeping organic arc that redefines high-end living spaces. Soft, rounded contours invite intimate conversation and cocooning comfort.",
    details: [
      "Sculptural curved silhouette designed for open-plan luxury living",
      "Seamless heavy bouclé upholstery with water-repellent nano coating",
      "Dual-layered pocket spring and high-density memory foam base",
      "Handcrafted in Kurnool with reinforced hardwood internal armature",
    ],
    dimensions: "W 260 cm x D 110 cm x H 78 cm (Seat Height: 42 cm)",
    materials: "Kiln-dried Hardwood, Memory Foam, Premium Textured Bouclé",
    primaryImage: "/images/mf-signature-curved-living.jpg",
    tag: "Designer Choice",
    badge: "Flagship Collection",
    warranty: "15-Year Internal Frame Guarantee",
    availability: "Made to order / On display in Grand Hall",
    configurations: ["3-seater curved", "4-seater curved", "Curved Sectional with Ottoman"],
    colors: [
      { name: "Champagne Cream", hex: "#EAE3D4" },
      { name: "Royal Gold Velvet", hex: "#C5A45D" },
      { name: "Deep Forest", hex: "#23382F" },
    ],
    budgetRanges: ["₹60,000–₹1,00,000", "Above ₹1,00,000", "Custom bespoke pricing"],
    expandableSections: [
      {
        title: "Design Philosophy",
        content: "Inspired by soft Scandinavian minimalism, the Aurelia Wave breaks free from rigid rectangular geometry to foster warm, connected family gatherings.",
      },
      {
        title: "Custom Sizes",
        content: "Our master carpenters can customize the curve angle and dimensions to harmonize with your living room floor plan in Kurnool.",
      },
    ],
    rating: 5.0,
    reviewCount: 32,
    inStock: true,
    featured: true,
    finishes: [
      { id: "champagne", name: "Champagne Cream", colorHex: "#EAE3D4" },
      { id: "navy", name: "Navy Luxe", colorHex: "#102B46" },
      { id: "gold", name: "Gold Velvet", colorHex: "#C5A45D" },
    ],
  },
  {
    id: "cloudcomfort-motorized-recliner",
    name: "CloudComfort Motorized Zero-Gravity Recliner",
    subtitle: "Whisper-quiet German OKIN motor with multi-position ergonomic lumbar relief",
    category: "recliners",
    priceUSD: 480,
    priceINR: 36000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Ergonomics Lab",
    year: 2025,
    description: "Engineered for pure relaxation after long days. The motorized zero-gravity mechanism gently elevates feet above heart level to optimize circulation and alleviate spinal pressure.",
    details: [
      "Original German OKIN heavy-duty linear actuator motor with smooth silent glide",
      "Zero-gravity 165° reclining position for orthopedic spine decompression",
      "Integrated side USB-A & USB-C fast charging ports with brushed metal controls",
      "Breathable high-grade air-leatherette resistant to cracking in Rayalaseema heat",
    ],
    dimensions: "W 88 cm x D 96 cm x H 104 cm (Fully reclined: 172 cm)",
    materials: "Tempered Steel Mechanism, German OKIN Motor, Breathable Nappa Leatherette",
    primaryImage: "/images/catalogue-recliner-featured.jpg",
    tag: "Ergonomic Award",
    badge: "Ready in Showroom",
    warranty: "5-Year Motor & Mechanism Warranty",
    availability: "In stock — Same day delivery available in Kurnool",
    configurations: ["Single Seater Motorized", "Manual Rocker Recliner", "Dual-Seater Loveseat with Console", "3-Seater Theatre Row"],
    colors: [
      { name: "Cognac Amber Leatherette", hex: "#7E4E2C" },
      { name: "Deep Navy Blue", hex: "#102B46" },
      { name: "Mocha Brown", hex: "#42322A" },
      { name: "Slate Grey", hex: "#4A4E53" },
    ],
    budgetRanges: ["Under ₹30,000", "₹30,000–₹60,000", "₹60,000–₹1,00,000", "Home Theatre Set"],
    expandableSections: [
      {
        title: "Mechanism & Motor",
        content: "German OKIN motor tested for 25,000 continuous cycles. Operates smoothly under 45 decibels with child-safe auto shut-off.",
      },
      {
        title: "Health & Lumbar Benefits",
        content: "Recommended by Kurnool orthopedic practitioners for relief from lower back strain, varicose veins, and cervical fatigue.",
      },
    ],
    rating: 4.9,
    reviewCount: 58,
    inStock: true,
    featured: true,
    finishes: [
      { id: "cognac", name: "Cognac Amber", colorHex: "#7E4E2C" },
      { id: "navy", name: "Navy Blue", colorHex: "#102B46" },
      { id: "grey", name: "Slate Grey", colorHex: "#4A4E53" },
    ],
  },
  {
    id: "heritage-teakwood-king-cot",
    name: "Heritage Solid Teakwood King Cot",
    subtitle: "Seasoned Grade-A Burma teakwood with smooth German hydraulic storage",
    category: "beds",
    priceUSD: 950,
    priceINR: 76000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Master Joinery",
    year: 2024,
    description: "An heirloom-grade bedstead crafted from mature 100% solid Burma teakwood. Features an understated fluted architectural headboard and effortless German gas-lift hydraulic storage to keep bedroom clutter out of sight.",
    details: [
      "100% Solid mature Burma Teakwood with zero MDF or particle board",
      "German gas-lift hydraulic pistons with 150 kg effortless lifting capacity",
      "Termite-resistant, borer-proof, and humidity-stabilized for Andhra Pradesh climate",
      "Hand-rubbed natural polyurethane satin finish that highlights genuine wood grain",
    ],
    dimensions: "W 198 cm x L 216 cm x H 115 cm (Fits standard 72\" x 78\" King Mattress)",
    materials: "Grade-A Burma Teakwood, Marine-grade Plywood Decking, German Gas Springs",
    primaryImage: "/images/bedroom-space.jpg",
    tag: "15-Yr Warranty",
    badge: "Heirloom Grade",
    warranty: "15-Year 100% Termite Replacement Guarantee",
    availability: "Available for quick delivery in Kurnool, Nandyal, Dhone",
    configurations: ["King Size (72\" x 78\") with Hydraulic Storage", "Queen Size (60\" x 78\") with Hydraulic Storage", "King Size Box Bed with Drawers"],
    colors: [
      { name: "Natural Honey Teak", hex: "#A8723C" },
      { name: "Rich Walnut Satin", hex: "#4A3326" },
      { name: "Smoked Dark Teak", hex: "#32231B" },
    ],
    budgetRanges: ["₹60,000–₹1,00,000", "Above ₹1,00,000"],
    expandableSections: [
      {
        title: "Solid Teak Guarantee",
        content: "Every cubic inch of exterior framing is solid teakwood. We provide a stamped 15-year certificate guaranteeing protection against termites, borers, and structural cracking.",
      },
      {
        title: "Hydraulic Storage",
        content: "Provides over 1,100 liters of dust-free storage space for extra quilts, suitcases, and seasonal bedding.",
      },
    ],
    rating: 5.0,
    reviewCount: 64,
    inStock: true,
    featured: true,
    finishes: [
      { id: "honey-teak", name: "Natural Honey Teak", colorHex: "#A8723C" },
      { id: "walnut", name: "Rich Walnut Satin", colorHex: "#4A3326" },
      { id: "smoked", name: "Smoked Dark Teak", colorHex: "#32231B" },
    ],
  },
  {
    id: "italian-marble-dining-table",
    name: "Onyx Marble 6-Seater Dining Suite",
    subtitle: "Imported Italian natural marble top set upon solid fluted teakwood pedestals",
    category: "dining",
    priceUSD: 1100,
    priceINR: 88000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Architectural Dining",
    year: 2025,
    description: "The centerpiece of memorable family dinners. A 30mm thick slab of polished Italian Onyx marble paired with 6 ergonomically cushioned teak dining chairs upholstered in stain-resistant velvet.",
    details: [
      "Natural imported Italian Onyx marble with chamfered bullnose edge and mirror polish",
      "Stain-shield sealed top resistant to turmeric, curries, and citrus etching",
      "Solid dual-pedestal teakwood base allowing unhindered legroom all around",
      "Includes 6 matching high-back solid teak dining chairs with lumbar padding",
    ],
    dimensions: "L 185 cm x W 95 cm x H 76 cm (Table) | Chair: W 48 cm x H 98 cm",
    materials: "Sealed Italian Marble, Solid Teakwood Pedestals, Stain-proof Velvet",
    primaryImage: "/images/dining-space.jpg",
    tag: "Luxury Dining",
    badge: "In Showroom Display",
    warranty: "10-Year Base & Chair Warranty",
    availability: "On live display in Kurnool Showroom Dining Gallery",
    configurations: ["6-Seater (Table + 6 Chairs)", "8-Seater (Table + 8 Chairs)", "Table Only"],
    colors: [
      { name: "Kunis Onyx Pearl", hex: "#D6CBB8" },
      { name: "Calacatta Gold Vein", hex: "#E8E4DE" },
      { name: "Dark Emperador", hex: "#46362C" },
    ],
    budgetRanges: ["₹60,000–₹1,00,000", "Above ₹1,00,000"],
    expandableSections: [
      {
        title: "Indian Culinary Protection",
        content: "Treated with our proprietary 3-layer anti-stain nanotechnology to ensure zero yellowing or staining from hot curries, oil, or turmeric.",
      },
    ],
    rating: 4.9,
    reviewCount: 39,
    inStock: true,
    featured: true,
    finishes: [
      { id: "onyx-pearl", name: "Kunis Onyx Pearl", colorHex: "#D6CBB8" },
      { id: "calacatta", name: "Calacatta Gold", colorHex: "#E8E4DE" },
    ],
  },
  {
    id: "penthouse-modular-sectional",
    name: "Penthouse Grand Modular Sectional",
    subtitle: "Sprawling L-shaped lounge with deep seating and interchangeable chaise",
    category: "sofas",
    priceUSD: 1450,
    priceINR: 118000,
    priceOnEnquiry: true,
    designer: "Mallikarjuna Signature Living",
    year: 2026,
    description: "Crafted for grand living rooms and duplexes. Unites wide track arms with deep feather-blend down cushions for the ultimate lounging experience.",
    details: [
      "Interchangeable left or right chaise orientation",
      "Plush duck-down wrapped cold-cure foam core",
      "Full solid teak frame with reinforced steel brackets",
      "Accommodates up to 7 adults with generous room to stretch out",
    ],
    dimensions: "W 320 cm x Chaise L 185 cm x H 82 cm",
    materials: "Burma Teak Frame, Feather-foam Core, Textured Linen Weave",
    primaryImage: "/images/mf-penthouse-sectional.jpg",
    tag: "Grand Estate",
    badge: "Custom Made",
    warranty: "15-Year Structural Teak Warranty",
    availability: "Custom crafted in 14 days",
    configurations: ["6-Seater L-Shape", "7-Seater U-Shape", "Custom Sizing"],
    colors: [
      { name: "Sandstone Beige", hex: "#D4C8B5" },
      { name: "Navy Sovereign", hex: "#102B46" },
      { name: "Olive Slate", hex: "#484D44" },
    ],
    budgetRanges: ["Above ₹1,00,000"],
    rating: 5.0,
    reviewCount: 28,
    inStock: true,
    featured: false,
    finishes: [
      { id: "sandstone", name: "Sandstone Beige", colorHex: "#D4C8B5" },
      { id: "navy", name: "Navy Sovereign", colorHex: "#102B46" },
    ],
  },
  {
    id: "royal-navy-tufted-suite",
    name: "Royal Navy Chesterfield Living Suite",
    subtitle: "Classic deep button diamond tufting with hand-hammered antique brass studs",
    category: "sofas",
    priceUSD: 850,
    priceINR: 68000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Heritage Masters",
    year: 2024,
    description: "The quintessential symbol of British colonial elegance and timeless majesty. Each button is deep-pulled by hand into seasoned teak framing.",
    details: [
      "Traditional 8-way hand-tied spring suspension for lifetime buoyancy",
      "Stain-treated rich navy royal velvet that feels silky to touch",
      "Antiqued solid brass individual decorative nailhead trim",
      "Turned solid teak bun feet with rich dark walnut stain",
    ],
    dimensions: "W 225 cm x D 98 cm x H 78 cm",
    materials: "Treated Teak, Royal Velvet, Antique Brass Studs",
    primaryImage: "/images/mf-tufted-navy-living.jpg",
    tag: "Royal Heritage",
    badge: "In Showroom",
    warranty: "15-Year Termite Proof Teak Guarantee",
    availability: "In stock at Kurnool Showroom",
    configurations: ["3-seater only", "3+1+1 Complete Suite", "3+2 Suite"],
    colors: [
      { name: "Royal Navy Velvet", hex: "#102B46" },
      { name: "Deep Emerald", hex: "#1C3B2B" },
      { name: "Antique Tan Leather", hex: "#754C29" },
    ],
    budgetRanges: ["₹60,000–₹1,00,000", "Above ₹1,00,000"],
    rating: 4.8,
    reviewCount: 34,
    inStock: true,
    featured: false,
    finishes: [
      { id: "navy-velvet", name: "Royal Navy", colorHex: "#102B46" },
      { id: "tan-leather", name: "Antique Tan", colorHex: "#754C29" },
    ],
  },
  {
    id: "bespoke-motorized-curtains",
    name: "Bespoke Textured Velvet & Sheer Curtains",
    subtitle: "Custom-tailored blackout curtains and motorized architectural blinds",
    category: "curtains",
    priceUSD: 240,
    priceINR: 18000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Soft Furnishings",
    year: 2025,
    description: "Elevate your windows with heavy triple-weave acoustic blackout fabrics paired with ethereal sheer linen panels. Available with Tuya or Alexa motorized smart tracks.",
    details: [
      "100% Total light blackout with thermal heat reflection for Rayalaseema summers",
      "Whisper-quiet motorized remote control tracks with smartphone app integration",
      "Free in-home measurement and professional installation across Kurnool town",
      "Over 400+ Turkish and Belgian fabrics displayed in our fabrics studio",
    ],
    dimensions: "Custom fabricated to exact window & ceiling height",
    materials: "Triple-weave Velvet, Pure Belgian Linen Sheers, Aluminum Track",
    primaryImage: "/images/banner-living.jpg",
    tag: "Smart Home",
    badge: "Free In-Home Measurement",
    warranty: "5-Year Track & Motor Guarantee",
    availability: "Stitched & installed within 5 days in Kurnool",
    configurations: ["Manual Pleated Drapes", "Motorized Smart Track", "Zebra Blinds", "Wooden Venetian"],
    colors: [
      { name: "Warm Gold Beige", hex: "#C5A45D" },
      { name: "Charcoal Blackout", hex: "#252B30" },
      { name: "Ivory Sheer", hex: "#F7F3EA" },
    ],
    budgetRanges: ["Under ₹30,000", "₹30,000–₹60,000", "Full Home Package"],
    rating: 4.9,
    reviewCount: 41,
    inStock: true,
    featured: false,
    finishes: [
      { id: "gold-beige", name: "Warm Gold Beige", colorHex: "#C5A45D" },
      { id: "charcoal", name: "Charcoal Grey", colorHex: "#252B30" },
    ],
  },
  {
    id: "plinth-natural-stone-table",
    name: "Plinth Monolithic Stone Center Table",
    subtitle: "Honed natural limestone with sculptural minimalist proportions and chamfered edges",
    category: "dining",
    priceUSD: 420,
    priceINR: 32000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Architectural Studio",
    year: 2025,
    description: "A sculptural monolithic statement piece crafted from solid honed Kunis Breccia limestone. Brings tactile weight, natural geological veining, and grounding serenity into modern living spaces.",
    details: [
      "Solid natural honed limestone and travertine construction",
      "Hand-chamfered minimalist geometric profile",
      "Stain-shield sealed top resistant to water rings, tea and beverages",
      "On live display in Kurnool showroom",
    ],
    dimensions: "L 100 cm x W 60 cm x H 38 cm",
    materials: "Honed Natural Limestone, Internal Reinforcement",
    primaryImage: "/images/plinth-table.jpg",
    tag: "Architectural",
    badge: "In Showroom Display",
    warranty: "10-Year Stone Structure Guarantee",
    availability: "In stock at Kurnool Showroom",
    configurations: ["Low Rectangle (100x60cm)", "Square Lounge (80x80cm)"],
    colors: [
      { name: "Kunis Breccia", hex: "#D6CBB8" },
      { name: "Warm Travertine", hex: "#E8E0D2" },
    ],
    budgetRanges: ["₹30,000–₹60,000"],
    rating: 4.9,
    reviewCount: 22,
    inStock: true,
    featured: false,
    finishes: [
      { id: "breccia", name: "Kunis Breccia", colorHex: "#D6CBB8" },
    ],
  },
  {
    id: "serenity-tufted-king-bed",
    name: "Serenity Button-Tufted Master Teak Bedstead",
    subtitle: "Hand-tufted acoustic headboard with whisper-quiet hydraulic gas-lift base",
    category: "beds",
    priceUSD: 890,
    priceINR: 72000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Bedroom Atelier",
    year: 2025,
    description: "Designed for restorative rest and quiet luxury. Combines a deeply padded button-tufted acoustic headboard with 100% solid Burma teakwood frame and 1,200 liters of dust-free hydraulic storage.",
    details: [
      "Deep diamond button-tufting with acoustic sound-softening linen",
      "100% Solid Burma teakwood internal framing with 15-year warranty",
      "German dual gas-lift hydraulic pistons with safety catch",
      "Integrated mattress retainer brackets",
    ],
    dimensions: "W 195 cm x L 218 cm x H 128 cm (Fits 72\" x 78\" Mattress)",
    materials: "Solid Burma Teak, Acoustic Foam, Belgian Textured Linen",
    primaryImage: "/images/796767853_18093958568640692_8492671734547745348_n.webp",
    tag: "Acoustic Luxury",
    badge: "Master Collection",
    warranty: "15-Year Teakwood Frame Guarantee",
    availability: "Available for quick delivery in Kurnool",
    configurations: ["King Size with Hydraulic Storage", "Queen Size with Hydraulic Storage"],
    colors: [
      { name: "Oatmeal Linen", hex: "#DDD6C8" },
      { name: "Slate Grey", hex: "#4A4E53" },
    ],
    budgetRanges: ["₹60,000–₹1,00,000"],
    rating: 5.0,
    reviewCount: 31,
    inStock: true,
    featured: false,
    finishes: [
      { id: "oatmeal", name: "Oatmeal Linen", colorHex: "#DDD6C8" },
    ],
  },
  {
    id: "elysian-grand-living-suite",
    name: "Elysian Signature 3+2 Living Suite",
    subtitle: "Tailored luxury sofa suite with cold-cure foam and brushed brass accent legs",
    category: "sofas",
    priceUSD: 1150,
    priceINR: 92000,
    priceOnEnquiry: false,
    designer: "Mallikarjuna Signature Living",
    year: 2025,
    description: "An architectural full-room living suite designed for luxury residences. Combines deep, supportive ergonomics with tailored Italian chenille upholstery and solid teakwood internal construction.",
    details: [
      "Complete 3-seater and 2-seater coordinated salon suite",
      "Reinforced Grade-A Burma teakwood frame with 15-year guarantee",
      "Multi-layer cold-cure foam core with pocket spring suspension",
      "Stain-resistant textured weave with water-repellent coating",
    ],
    dimensions: "3-Seater: W 220 cm x D 94 cm x H 84 cm | 2-Seater: W 165 cm x D 94 cm x H 84 cm",
    materials: "Solid Burma Teak, Cold-Cure Foam, Italian Chenille Blend",
    primaryImage: "/images/mf-living-suite-311.jpg",
    tag: "Signature Suite",
    badge: "In Showroom Display",
    warranty: "15-Year Structural Frame Guarantee",
    availability: "Ready in Showroom / Custom fabrics in 10 days",
    configurations: ["3+2 Suite", "3+2+1 Suite", "3-Seater Only"],
    colors: [
      { name: "Pearl Cream", hex: "#EBE5DB" },
      { name: "Navy Velvet", hex: "#102B46" },
      { name: "Charcoal Slate", hex: "#383E44" },
    ],
    budgetRanges: ["₹60,000–₹1,00,000", "Above ₹1,00,000"],
    rating: 5.0,
    reviewCount: 37,
    inStock: true,
    featured: true,
    finishes: [
      { id: "pearl-cream", name: "Pearl Cream", colorHex: "#EBE5DB" },
      { id: "navy", name: "Navy Luxe", colorHex: "#102B46" },
    ],
  },
  // Homepage "New Designs" showcase pieces
  {
    id: "eave-modular-sofa",
    name: "Eave Modular Bouclé Sofa",
    subtitle: "Architectural curves inspired by building eaves with tactile luxury bouclé",
    category: "sofas",
    priceUSD: 1250,
    priceINR: 98000,
    priceOnEnquiry: false,
    designer: "Norm Architects for Audo Copenhagen",
    year: 2025,
    description: "Taking its name from 'eaves' – the lower edges of a roof that overhang a wall – the Eave Modular Sofa is an architectural piece that curves gently into open-plan spaces.",
    details: [
      "Modular components for flexible corner or straight configurations",
      "Tactile bouclé upholstery with high Martindale rub endurance",
      "Generous curved internal armrests engineered for lounging",
    ],
    dimensions: "W 240 cm x D 96 cm x H 70 cm (Seat Height: 40 cm)",
    materials: "Kiln-dried solid frame, High-resilience cold foam, Bouclé wool blend",
    primaryImage: "/images/eave-sofa.jpg",
    finishes: [
      { id: "ivory-boucle", name: "Ivory Bouclé", colorHex: "#F2EDE4" },
      { id: "charcoal", name: "Charcoal Wool", colorHex: "#333538" },
      { id: "terracotta", name: "Warm Terracotta", colorHex: "#A05A46" },
    ],
    rating: 5.0,
    reviewCount: 38,
    inStock: true,
    featured: true,
  },
  {
    id: "echasse-smoked-vase",
    name: "Échasse Smoked Glass Brass Vase",
    subtitle: "Mouth-blown drop-shaped smoked glass balanced upon stilted brass legs",
    category: "objects",
    priceUSD: 320,
    priceINR: 24000,
    priceOnEnquiry: false,
    designer: "Theresa Rand for Audo Copenhagen",
    year: 2025,
    description: "The Échasse Vase reimagines the classic elegance of glass vessels. The French word 'échasse' means stilts – the slender, stilt-like brass legs that suspend the smoked glass form.",
    details: [
      "Mouth-blown smoked glass with subtle gradient tinting",
      "Solid bronzed brass stilt armature with brushed satin finish",
      "Sculptural presence both empty or arranged with botanical branches",
    ],
    dimensions: "Diameter 28 cm x H 60 cm",
    materials: "Mouth-blown Smoked Glass, Solid Bronzed Brass",
    primaryImage: "/images/echasse-vase.jpg",
    finishes: [
      { id: "smoked-brass", name: "Smoked Glass & Brass", colorHex: "#C5A45D" },
      { id: "amber-bronze", name: "Amber Glass & Dark Bronze", colorHex: "#4A3326" },
    ],
    rating: 4.9,
    reviewCount: 29,
    inStock: true,
    featured: true,
  },
  {
    id: "hashira-ambient-column-lamp",
    name: "Hashira Ambient Column Lamp",
    subtitle: "Geometric Japanese lantern inspiration in natural linen and blackened steel",
    category: "lighting",
    priceUSD: 410,
    priceINR: 32000,
    priceOnEnquiry: false,
    designer: "Norm Architects for Audo Copenhagen",
    year: 2026,
    description: "Taking inspiration from traditional Japanese paper lanterns, Hashira combines a cylindrical silhouette with a translucent linen shade that diffuses light in multiple directions.",
    details: [
      "Natural raw woven linen shade casting warm ambient glow",
      "Blackened ash wood base with tactile brass dimmer dial",
      "Architectural column geometry suited for bedside or living corners",
    ],
    dimensions: "Diameter 24 cm x H 83 cm",
    materials: "Natural Linen, Blackened Ash, Solid Brass Dial",
    primaryImage: "/images/hashira-lamp.jpg",
    finishes: [
      { id: "raw-linen", name: "Raw Oat Linen", colorHex: "#D8CDBA" },
      { id: "white-linen", name: "Pure White Linen", colorHex: "#F7F5F0" },
    ],
    rating: 4.9,
    reviewCount: 42,
    inStock: true,
    featured: true,
  },
];

export const CURRENT_PROMOTIONS = [
  {
    id: "wedding-luxe-package",
    badge: "FESTIVE & WEDDING SPECIAL",
    title: "The Kurnool Complete Home Suite",
    description: "Furnish your entire 3BHK villa or apartment with solid teakwood: King Cot + Hydraulic Storage, 3+1+1 Contemporary Sofa Suite, and 6-Seater Marble Dining Table.",
    originalPriceINR: 235000,
    offerPriceINR: 189000,
    savingsText: "Save ₹46,000 with showroom bundle",
    highlights: ["Complimentary delivery in Kurnool", "Free orthopedic mattress included", "0% EMI options available"],
  },
  {
    id: "recliner-upgrade",
    badge: "COMFORT UPGRADE",
    title: "Exchange & Upgrade to Motorized Recliner",
    description: "Bring your old sofa or chair and get up to ₹12,000 exchange bonus towards any German OKIN motorized recliner lounge.",
    originalPriceINR: 42000,
    offerPriceINR: 32000,
    savingsText: "Flat ₹10,000 Instant Discount",
    highlights: ["5-year motor replacement warranty", "Free leatherette care kit"],
  },
];

export const PRESS_QUOTES: PressQuote[] = [
  {
    publication: "Rayalaseema Architectural Digest",
    quote: "Mallikarjuna Furniture World has elevated furniture retail in Kurnool to the standards of luxury international design ateliers.",
    authorOrIssue: "Annual Design Edition 2025",
  },
  {
    publication: "Andhra Living Magazine",
    quote: "Their uncompromised focus on authentic Burma teakwood and 15-year termite guarantees has made them a household name across the region.",
    authorOrIssue: "Cover Feature: Kurnool Luxury Spaces",
  },
  {
    publication: "The Deccan Herald Interior Journal",
    quote: "A masterclass in balancing tactile softness, ergonomics, and heirloom woodworking without excessive ostentation.",
    authorOrIssue: "South India Retail Excellence",
  },
];

export const REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Dr. K. Srinivasulu Reddy",
    role: "Senior Consultant Cardiologist",
    location: "Doctors Colony, Kurnool",
    rating: 5,
    date: "March 2026",
    comment: "Mallikarjuna Furniture World is without question the finest furniture showroom in Kurnool. We bought the 6-seater Italian marble dining table and the CloudComfort recliner. The quality of Burma teak and finishing matches international standards.",
    productName: "Italian Marble Dining & Motorized Recliner",
  },
  {
    id: "rev-2",
    author: "Lakshmi & Venkat Rao",
    role: "Villa Homeowners",
    location: "River View Colony, Bellary Road, Kurnool",
    rating: 5,
    date: "February 2026",
    comment: "The 15,000 sq ft showroom is breathtaking. You can touch the teakwood, test the sofa cushion softness, and speak directly to their knowledgeable team. Delivered on time with spotless installation.",
    productName: "Contemporary Comfort 3+1+1 Suite & King Cot",
  },
  {
    id: "rev-3",
    author: "Mahesh Babu Naidu",
    role: "Civil Contractor & Builder",
    location: "Nandyal Road, Kurnool",
    rating: 5,
    date: "January 2026",
    comment: "For my new residence, I compared showrooms across Hyderabad and Kurnool. Mallikarjuna Furniture World gave superior teakwood quality and 15-year termite guarantee at far better pricing. Highly recommended!",
    productName: "Solid Teakwood Heritage Bedroom Set",
  },
];

export const WHY_CHOOSE_US_POINTS = [
  {
    icon: "selection",
    title: "15,000+ Sq. Ft. Selection",
    description: "Browse 500+ ready designs across sofas, recliners, teak beds, and dining suites under one expansive roof in Kurnool.",
  },
  {
    icon: "quality",
    title: "15-Year Teakwood Guarantee",
    description: "Every solid teak cot, dining set, and sofa frame is chemically treated and backed by our formal 15-year anti-termite replacement warranty.",
  },
  {
    icon: "assistance",
    title: "Personal Interior Guidance",
    description: "Our experienced furniture specialists assist with floor planning, fabric selection, and custom sizing suited to your room dimensions.",
  },
  {
    icon: "showroom",
    title: "Experience Before You Decide",
    description: "Feel genuine leather, test motorized recliner mechanisms, and sit on high-density cushions in person at our Kurnool showroom.",
  },
];

export const MATERIAL_SPOTLIGHTS: MaterialSpotlight[] = [
  {
    id: "burma-teakwood",
    name: "Seasoned Burma Teakwood",
    origin: "Sustainable Grade-A Teak Forests",
    tagline: "Natural high oil content, termite immunity, and golden patina that deepens with age.",
    description:
      "Every heirloom bed, sofa armature, and dining pedestal is carved from mature, kiln-seasoned Burma teak. Chemically treated against borers and backed by our stamped 15-year warranty.",
    tactileCharacteristics: [
      "Naturally termite and borer resistant",
      "Stable across hot Rayalaseema summers",
      "Hand-rubbed natural polyurethane satin sheen",
      "Traditional mortise-and-tenon joinery",
    ],
    accentColor: "#C5A45D",
  },
  {
    id: "italian-marble",
    name: "Italian Onyx & Natural Marble",
    origin: "Tuscan & Carrara Quarries",
    tagline: "Mirror-polished architectural stone sealed against turmeric and culinary oils.",
    description:
      "Selected for delicate crystalline depth and striking organic veining. Chamfered bullnose edges and 3-layer anti-stain nanotechnology ensure complete resilience against Indian dining.",
    tactileCharacteristics: [
      "Stain-shield sealed against spices & citrus",
      "Thermal heat resistant for steaming serving dishes",
      "Cool-to-touch polished surface",
      "Custom monolithic slab sizing available",
    ],
    accentColor: "#102B46",
  },
  {
    id: "german-okin-actuator",
    name: "German OKIN Motor Mechanisms",
    origin: "Kirchlengern, Germany",
    tagline: "Whisper-quiet motorized linear actuators engineered for zero-gravity decompression.",
    description:
      "Installed in all our motorized recliners and home theatre lounges. Delivers silky, silent reclining under 45 dB with emergency battery backups and integrated USB ports.",
    tactileCharacteristics: [
      "Tested for 25,000 continuous cycle longevity",
      "Dual-motor independent backrest & footrest control",
      "Heavy-gauge cold-rolled carbon steel chassis",
      "5-Year direct replacement warranty",
    ],
    accentColor: "#252B30",
  },
  {
    id: "boucle-air-leather",
    name: "Tactile Bouclé & Breathable Leatherette",
    origin: "European Weaving Mills",
    tagline: "High Martindale abrasion resistance and breathable micro-porous texture.",
    description:
      "Curated for Andhra Pradesh's climate to resist peeling, cracking, or heat retention. Repels accidental water spills while offering tactile warmth and sumptuous living room presence.",
    tactileCharacteristics: [
      "50,000+ Martindale heavy-domestic rub count",
      "Hydrophobic water-repellent surface treatment",
      "Hypoallergenic & pet-friendly weave",
      "Over 120+ custom colour swatches in showroom",
    ],
    accentColor: "#7E4E2C",
  },
];

export const DESIGNERS = [
  {
    role: "HEAD OF HEIRLOOM JOINERY",
    name: "Mallikarjuna Master Woodworking Guild",
    base: "Kurnool Showroom Atelier",
    bio: "Pioneering traditional mortise-and-tenon teakwood joinery in Rayalaseema for over 27 years. Every cot, dining set, and sofa armature is hand-planed and inspected for flawless grain balance.",
    signature: "Heritage Teakwood King Cot & Onyx Dining Suite",
  },
  {
    role: "ERGONOMICS & MOTORIZED COMFORT",
    name: "Mallikarjuna Recliner Engineering Lab",
    base: "In Collaboration with OKIN Germany",
    bio: "Focused on orthopedic posture alignment, zero-gravity weightlessness, and motorized lounge mechanisms designed to relieve lower back pain and fatigue in busy professionals.",
    signature: "CloudComfort Motorized Zero-Gravity Recliner",
  },
  {
    role: "CURATED TEXTILES & INTERIOR STYLING",
    name: "Mallikarjuna Soft Furnishings Studio",
    base: "Kurnool Showroom",
    bio: "Specializing in acoustic blackout drapery, Belgian sheer linens, and tactile European bouclés. Offering free laser in-home measurement across Kurnool and Nandyal.",
    signature: "Bespoke Textured Velvet & Smart Motorized Drapes",
  },
];

export const LOOKBOOK_ROOMS: LookbookRoom[] = [
  {
    id: "grand-living-pavilion",
    title: "The Grand Living Pavilion",
    subtitle: "Architectural Volume & Conversational Seating",
    description:
      "An expansive Kurnool living space anchored by the Contemporary Comfort Sofa Suite, curved bouclé accent chairs, and layered ambient lighting.",
    image: "/images/mf-royal-living-fireplace.jpg",
    hotspots: [
      {
        id: "hs-1",
        xPercent: 48,
        yPercent: 62,
        productId: "contemporary-comfort-sofa",
        title: "Contemporary Comfort Sofa",
        category: "Sofas & Couches",
        priceUSD: 650,
      },
      {
        id: "hs-2",
        xPercent: 78,
        yPercent: 55,
        productId: "cloudcomfort-motorized-recliner",
        title: "CloudComfort Recliner",
        category: "Motorized Recliners",
        priceUSD: 480,
      },
    ],
  },
  {
    id: "master-bedroom-sanctuary",
    title: "The Master Bedroom Sanctuary",
    subtitle: "Handcrafted Teakwood & Restorative Serenity",
    description:
      "Solid Burma teakwood king bedstead featuring fluted headboard, German gas-lift hydraulic storage, and pocket-spring orthopedic mattress.",
    image: "/images/Analysis output 2.png",
    hotspots: [
      {
        id: "hs-3",
        xPercent: 50,
        yPercent: 65,
        productId: "heritage-teakwood-king-cot",
        title: "Heritage Solid Teakwood King Cot",
        category: "Beds & Mattresses",
        priceUSD: 950,
      },
    ],
  },
  {
    id: "royal-dining-gallery",
    title: "The Royal Dining Gallery",
    subtitle: "Natural Italian Stone & Hospitality Elegance",
    description:
      "Polished Italian Onyx marble paired with 6 solid teakwood dining chairs, creating an inviting space for family celebrations.",
    image: "/images/Analysis output 1 (1).png",
    hotspots: [
      {
        id: "hs-4",
        xPercent: 52,
        yPercent: 60,
        productId: "italian-marble-dining-table",
        title: "Onyx Marble 6-Seater Dining Suite",
        category: "Dining Tables",
        priceUSD: 1100,
      },
    ],
  },
  {
    id: "artisan-teak-atelier",
    title: "The Teakwood Heritage Salon",
    subtitle: "Master Joinery & Timeless Proportions",
    description:
      "Authentic solid Burma teakwood and hand-finished upholstery crafted with heirloom mortise-and-tenon structural precision.",
    image: "/images/Analysis output 1.png",
    hotspots: [
      {
        id: "hs-5",
        xPercent: 50,
        yPercent: 58,
        productId: "contemporary-comfort-sofa",
        title: "Teakwood Craftsmanship Suite",
        category: "Living Heritage",
        priceUSD: 650,
      },
    ],
  },
  {
    id: "architectural-lookbook-lounge",
    title: "The Architectural Atelier Lounge",
    subtitle: "Sculpting Light, Texture & Volume",
    description:
      "Curated low-profile seating and organic materials designed to transform residential living into meditative sanctuaries.",
    image: "/images/lookbook.jpg",
    hotspots: [
      {
        id: "hs-6",
        xPercent: 54,
        yPercent: 60,
        productId: "aurelia-wave-sofa",
        title: "Aurelia Wave Curved Lounge",
        category: "Sofas & Couches",
        priceUSD: 980,
      },
    ],
  },
];

