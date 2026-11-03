// ⚠️ PLACEHOLDER REVIEWS FOR DESIGN / DEVELOPMENT ONLY.
// These are written examples, not real customer reviews. Replace them with genuine reviews
// (e.g. from Google, WhatsApp feedback or order follow-ups) before the site goes live,
// or delete this file — the product page falls back to an empty state without it.

import { PRODUCTS } from "@/data/products";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

const AUTHORS = [
  "Venkata R.", "Lakshmi P.", "Suresh K.", "Anjali M.", "Ramesh B.", "Divya S.", "Kiran T.", "Harika N.",
  "Prasad V.", "Swathi G.", "Mahesh Y.", "Pavani R.", "Naveen C.", "Sravani K.", "Arjun D.", "Bhavana L.",
];

const DATES = ["14 Oct 2026", "2 Oct 2026", "21 Sep 2026", "9 Sep 2026", "28 Aug 2026", "15 Aug 2026", "3 Aug 2026", "19 Jul 2026"];

const COMMENTS: Record<string, [number, string][]> = {
  sofas: [
    [5, "Seating is firm but very comfortable, and the fabric feels premium. Delivery team set it up neatly in our living room."],
    [4, "Looks exactly like the showroom piece. The cushions took a week to settle in, now they are perfect."],
    [5, "We chose a custom size and colour and it fits our hall perfectly. Good finishing on the legs and stitching."],
    [4, "Solid frame, no creaks at all. Took a little longer than expected to deliver but worth the wait."],
    [5, "Guests always ask where we bought it. Easy to clean, our kids have not managed to stain it yet."],
  ],
  recliners: [
    [5, "The motor is very quiet and the recline is smooth. My father uses it every evening for his back."],
    [4, "Very comfortable for movies. The USB port is handy. Only wish the remote had a longer cable."],
    [5, "Tried it in the showroom first and it feels the same at home. Leatherette is soft and easy to wipe."],
    [4, "Good build quality and the headrest support is great. Installation was quick."],
  ],
  beds: [
    [5, "Strong teak frame, no noise at all. The polish is rich and even. Storage space is very useful."],
    [4, "Sturdy bed and good finishing. It is heavy, so plan placement before delivery."],
    [5, "Delivered and assembled on the same day. The headboard carving looks beautiful in our bedroom."],
    [4, "Good quality wood and smooth drawers. Slight delay in delivery but the team kept us updated."],
  ],
  dining: [
    [5, "The marble top is stunning and very easy to clean. Chairs are comfortable for long family dinners."],
    [4, "Good size for our family of six. Table is heavy and stable, finishing is neat."],
    [5, "Looks premium in our dining room. Staff helped us choose the right size for the space."],
    [4, "Quality is great. Seat cushions are a bit firm initially but softening with use."],
  ],
  curtains: [
    [5, "They came home to measure and the fitting is perfect. The motorised track is very smooth and quiet."],
    [4, "Blackout lining works well in the bedroom. Fabric quality is good for the price."],
    [5, "Lots of fabric options to choose from. Installation was clean with no mess."],
  ],
  objects: [
    [5, "Beautiful piece, the glass colour is lovely in natural light. Packed very safely."],
    [4, "Looks elegant on our console table. Slightly smaller than I imagined but still very nice."],
    [5, "Great quality and finish. Makes a perfect gift."],
  ],
  lighting: [
    [5, "Gives a warm, soft light that makes the room feel cosy. Dimmer works smoothly."],
    [4, "Well made and looks great beside the bed. Bulb is not very bright, which suits a reading corner."],
    [5, "Lovely design and good build quality. Arrived well packed."],
  ],
};

// Three or four reviews per product, rotated through its category's pool
export const SAMPLE_REVIEWS: Record<string, ProductReview[]> = Object.fromEntries(
  PRODUCTS.map((p, n) => {
    const pool = COMMENTS[p.category] ?? COMMENTS.sofas;
    const count = 3 + (n % 2);
    const reviews = Array.from({ length: Math.min(count, pool.length) }, (_, i) => {
      const [rating, comment] = pool[(n + i) % pool.length];
      return {
        id: `${p.id}-sample-${i + 1}`,
        author: AUTHORS[(n * 3 + i) % AUTHORS.length],
        rating,
        date: DATES[(n + i * 2) % DATES.length],
        comment,
      };
    });
    return [p.id, reviews];
  })
);
