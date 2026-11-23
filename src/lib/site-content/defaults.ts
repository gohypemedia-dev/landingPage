import { PRODUCTS, REVIEWS, SHOWROOM_INFO } from "@/data/products";
import { SAMPLE_REVIEWS } from "@/data/sampleReviews";
import { SHOP_CATEGORIES } from "@/data/categories";
import type { SiteContent } from "@/lib/site-content/schema";

/**
 * The homepage exactly as designed. Sections that have not been edited in the
 * admin (no row in site_content) render these values, so the site looks the
 * same with an empty or unreachable database.
 */

const SAMPLE_PRODUCT_IDS = [
  "aurelia-wave-sofa",
  "cloudcomfort-motorized-recliner",
  "serenity-tufted-king-bed",
  "italian-marble-dining-table",
  "bespoke-motorized-curtains",
];

const defaultTestimonials = [
  ...REVIEWS.map((r) => ({ author: r.author, product: r.productName, rating: r.rating, comment: r.comment })),
  ...SAMPLE_PRODUCT_IDS.flatMap((id) => {
    const review = SAMPLE_REVIEWS[id]?.[0];
    const product = PRODUCTS.find((p) => p.id === id);
    return review && product
      ? [{ author: review.author, product: product.name, rating: review.rating, comment: review.comment }]
      : [];
  }),
];

const BED_PHOTO = "/images/796767853_18093958568640692_8492671734547745348_n.webp";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    eyebrow: "NEW ARRIVALS",
    title: "New Designs.",
    ctaText: "Shop Now",
    ctaHref: "/collections/new-designs",
    desktopVideo: "/hero.mp4",
    desktopPoster: "/images/hero-poster.jpg",
    mobileVideo: "/story.mp4",
    mobilePoster: "/images/hero-poster-mobile.jpg",
  },

  promoSlides: {
    enabled: true,
    slides: [
      {
        titleLine1: "Pieces Everyone’s",
        titleLine2: "Bringing Home",
        label: "Shop Bestsellers",
        href: "/collections/best-sellers",
        left: { src: "/images/catalogue-recliner-featured.jpg", alt: "Recliner sofa in a warm living room" },
        right: { src: "/images/bedroom-space.jpg", alt: "Wooden bed with premium linen" },
      },
    ],
  },

  festiveOffer: {
    enabled: true,
    eyebrow: "Celebrating",
    heading: "Diwali",
    saleLabel: "Festive Sale",
    tagline: "Deals that shine",
    taglineBold: "brighter than the diyas!",
    offers: [
      {
        sealTop: "Pay",
        sealBottom: "₹5,000",
        title: "Get Power Lift Recliner",
        worth: "₹35,000",
        note: "*On purchase of ₹1,50,000",
        image: { src: "/images/catalogue-recliner-featured.jpg", alt: "Power lift recliner" },
      },
      {
        sealTop: "Get",
        sealBottom: "Free",
        title: "Marble Coffee Table",
        worth: "₹6,500",
        note: "*On purchase of ₹1,00,000",
        image: { src: "/images/plinth-table.jpg", alt: "Marble coffee table" },
      },
    ],
    image: { src: "/images/mf-fluted-luxury-lounge.jpg", alt: "Luxury lounge seating" },
    perks: ["Free Delivery", "Free Installation", "Easy EMI"],
    terms: "*T&C Apply",
  },

  addOnSale: {
    enabled: true,
    headingTop: "Add-On",
    headingAccent: "Sale",
    subtitle: "Buy the hero piece, save on what completes the room.",
    columns: [
      {
        tags: ["Sofa", "Recliner"],
        href: "/sofas-kurnool",
        image: { src: "/images/mf-signature-curved-living.jpg", alt: "Sofa and recliner set" },
        discount: "10%",
        addOnLabel: "On Coffee Table",
        addOnImage: { src: "/images/plinth-table.jpg", alt: "Coffee table" },
      },
      {
        tags: ["Dining"],
        href: "/dining-tables-kurnool",
        image: { src: "/images/dining-space.jpg", alt: "Dining table set" },
        discount: "10%",
        addOnLabel: "On Side Board & Crockery Unit",
        addOnImage: { src: "/images/mf-showroom-gallery-wood.jpg", alt: "Wooden crockery unit" },
      },
      {
        tags: ["Bed"],
        href: "/beds-cots-kurnool",
        image: { src: BED_PHOTO, alt: "Wooden bed" },
        discount: "10%",
        addOnLabel: "On Mattress, Bedside Table or Wardrobe",
        addOnImage: { src: "/images/bedroom-space.jpg", alt: "Mattress and bedside table" },
      },
      {
        tags: ["Curtains"],
        href: "/curtains-blinds-kurnool",
        image: { src: "/images/banner-living.jpg", alt: "Living room curtains" },
        discount: "10%",
        addOnLabel: "On Decor & Lamps",
        addOnImage: { src: "/images/hashira-lamp.jpg", alt: "Designer lamp" },
      },
    ],
  },

  dealBanner: {
    enabled: true,
    eyebrow: "Limited Time Deal",
    saleBadge: "Royal Festive Sale",
    saleOff: "Upto 70% OFF",
    cashbackBold: "2% Cashback",
    cashbackText: "on UPI Payments",
    emiTitle: "No Cost EMI 3 & 6 Months",
    emiOn: "available on",
    banks: ["HDFC", "ICICI", "SBI", "AXIS"],
    banksMore: "+More",
    timerMode: "daily",
    timerEndsAt: "",
    terms: "*T&C, Min Purchase of Rs.5000/- and above",
  },

  popularCategories: {
    enabled: true,
    heading: "Popular Categories",
    items: SHOP_CATEGORIES.filter((c) => c.inCircles !== false).map((c) => ({
      label: c.label,
      href: c.href,
      image: c.image,
    })),
  },

  productRows: {
    newDesigns: { enabled: true, title: "New Designs" },
    bestSellers: { enabled: true, title: "Best Sellers" },
    onlineExclusive: { enabled: true, title: "Online Exclusive" },
  },

  atmosphere: {
    enabled: true,
    banners: [
      {
        title: "Living.",
        description: "Handcrafted modular seating, German motorized recliners, and curved statement loungers.",
        href: "/sofas-kurnool",
        linkText: "Shop Living",
        image: { src: "/images/banner-living.jpg", alt: "Living Atmosphere Mallikarjuna Furniture World" },
        objectPosition: "center 55%",
        background: "#85705C",
        productIds: [
          "contemporary-comfort-sofa",
          "cloudcomfort-motorized-recliner",
          "aurelia-wave-sofa",
          "royal-navy-tufted-suite",
          "penthouse-modular-sectional",
          "elysian-grand-living-suite",
        ],
      },
      {
        title: "Bedroom.",
        description: "Solid Burma teakwood king cots with German gas-lift hydraulic storage and custom headboards.",
        href: "/beds-cots-kurnool",
        linkText: "Shop Bedroom",
        image: { src: "/images/bedroom-space.jpg", alt: "Bedroom Atmosphere Mallikarjuna Furniture World" },
        objectPosition: "center 60%",
        background: "#9E8B76",
        productIds: ["serenity-tufted-king-bed", "bespoke-motorized-curtains", "heritage-teakwood-king-cot"],
      },
      {
        title: "Office.",
        description: "Statement lounge seating and stone-top tables for studies, home offices and executive suites.",
        href: "/furniture",
        linkText: "Shop Office",
        image: { src: "/images/dining-space.jpg", alt: "Office Atmosphere Mallikarjuna Furniture World" },
        objectPosition: "center 55%",
        background: "#524535",
        productIds: ["cloudcomfort-motorized-recliner", "plinth-natural-stone-table", "contemporary-comfort-sofa"],
      },
      {
        title: "Dining.",
        description: "Monolithic Italian marble and solid teak dining tables with sculptural ergonomic chairs.",
        href: "/dining-tables-kurnool",
        linkText: "Shop Dining",
        image: { src: "/images/lookbook.jpg", alt: "Dining Atmosphere Mallikarjuna Furniture World" },
        objectPosition: "center 60%",
        background: "#86745F",
        productIds: ["italian-marble-dining-table", "plinth-natural-stone-table", "penthouse-modular-sectional"],
      },
    ],
  },

  shopByLook: {
    enabled: true,
    heading: "Shop By Look",
    looks: [
      { title: "Power Recliners", href: "/recliners-kurnool", poster: "/images/catalogue-recliner-featured.jpg", video: "", instagram: "" },
      { title: "Wooden Queen Bed", href: "/beds-cots-kurnool", poster: BED_PHOTO, video: "", instagram: "" },
      { title: "Family Dining Sets", href: "/dining-tables-kurnool", poster: "/images/dining-space.jpg", video: "", instagram: "" },
      { title: "Signature Living", href: "/sofas-kurnool", poster: "/images/hero-poster-mobile.jpg", video: "/story.mp4", instagram: "" },
      { title: "Fluted Lounge Sofa", href: "/sofas-kurnool", poster: "/images/mf-fluted-luxury-lounge.jpg", video: "", instagram: "" },
      { title: "Bedroom Makeover", href: "/beds-cots-kurnool", poster: "/images/bedroom-space.jpg", video: "", instagram: "" },
      { title: "Curtains & Blinds", href: "/curtains-blinds-kurnool", poster: "/images/banner-living.jpg", video: "", instagram: "" },
    ],
  },

  faqs: {
    enabled: true,
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "How do I buy a product from the website?",
        answer:
          "Add the pieces you like to your Inquiry List, or tap Inquiry on any product. Our team will confirm the price, finish, size and delivery date with you on WhatsApp before anything is finalised.",
      },
      {
        question: "Can I see the furniture before buying?",
        answer: `Yes. Most designs are on display at our Kurnool showroom, open ${SHOWROOM_INFO.timing}. You can sit on the sofas, try the recliners and check fabrics and wood finishes in person.`,
      },
      {
        question: "Can I customise the size, fabric or colour?",
        answer:
          "Yes. Most sofas, beds and dining sets can be made in different sizes, fabrics, leatherettes and wood finishes. Share your room size and preferences on WhatsApp and we will suggest the best options.",
      },
      {
        question: "Do you deliver and install the furniture?",
        answer:
          "Yes. We deliver and install across Kurnool and nearby towns in Rayalaseema. For other locations, message us with your pincode and we will confirm delivery charges and timelines.",
      },
      {
        question: "Is No Cost EMI available?",
        answer:
          "Yes. No Cost EMI for 3 and 6 months is available on select bank cards for purchases of ₹5,000 and above. Terms and conditions apply; our team will share the eligible banks when you enquire.",
      },
      {
        question: "What warranty do I get?",
        answer:
          "Warranty depends on the product and is listed on each product page under More Information. Our solid teakwood frames come with a 15-year frame warranty.",
      },
    ],
  },

  testimonials: {
    enabled: true,
    heading: "What Our Customers Say",
    items: defaultTestimonials,
  },

  storyCards: {
    enabled: true,
    cards: [
      {
        heading: "About",
        title: "Kurnool's furniture showroom since 1998",
        text: "Mallikarjuna Furniture World brings sofas, recliners, beds, dining sets, mattresses and curtains under one roof, so you can see, sit and compare before you buy.",
        image: { src: "/images/mf-showroom-grand-hall.jpg", alt: "Inside the Mallikarjuna Furniture World showroom" },
        cta: "Read More",
        href: "/furniture-showroom-kurnool",
        external: false,
        showMap: false,
      },
      {
        heading: "International Collection",
        title: "Designed abroad, ready to see in Kurnool.",
        text: "Scandinavian designs, Italian marble, German recliner mechanisms and Belgian linen, on display at our showroom.",
        image: { src: "/images/mf-showroom-warehouse.jpg", alt: "International furniture on display in the showroom" },
        cta: "Explore Collection",
        href: "/collections/international-collection",
        external: false,
        showMap: false,
      },
      {
        heading: "Visit Us",
        title: "Our Kurnool Showroom",
        text: `${SHOWROOM_INFO.address}. ${SHOWROOM_INFO.timing}.`,
        image: { src: "/images/showroom-kurnool-main.jpg", alt: "Mallikarjuna Furniture World showroom in Kurnool" },
        cta: "Get Directions",
        href: SHOWROOM_INFO.googleMapsUrl,
        external: true,
        showMap: true,
      },
    ],
  },

  inquiryPopup: {
    autoOpen: true,
    delaySeconds: 0.8,
    showLauncher: true,
    launcherText: "INQUIRY",
    slides: [
      { image: "/images/eave-sofa.jpg", position: "78% 72%" },
      { image: "/images/678579352_122102739512690441_8609336410938895823_n.jpg", position: "70% 62%" },
      { image: "/images/plinth-table.jpg", position: "30% 75%" },
    ],
    title: "Request Pricing & Catalogue",
    subtitle: "Share your details and we'll reply on WhatsApp",
    categoryLabel: "Select Furniture Category",
    categories: [
      "Sofas & Couches",
      "Motorized Recliners",
      "Teakwood Beds & Cots",
      "Italian Marble Dining",
      "Curtains & Mattresses",
      "Complete Home Interior",
    ],
    buttonText: "Send Inquiry",
  },
};
