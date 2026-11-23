# Backend & admin

Next.js server code in this repo, no separate service:

- **PostgreSQL (Neon)** via Prisma 7: `prisma/schema.prisma`
- **Admin login** with Better Auth (email + password, public sign-up disabled)
- **Media** in Cloudflare R2, uploaded straight from the browser with short-lived presigned URLs
- **Admin panel** at `/admin`: homepage sections, products, categories, media library, enquiries

## Setup

1. `cp .env.example .env` and fill in:
   - `DATABASE_URL`: Neon **pooled** connection string. `DIRECT_DATABASE_URL`: Neon **direct** string (used by migrations).
   - `BETTER_AUTH_SECRET`: `openssl rand -base64 32`. `BETTER_AUTH_URL`: the site's public URL.
   - `R2_*`: see below. Leave both R2 credentials empty in development to save uploads to `public/uploads`.
2. `npm install` (also generates the Prisma client)
3. `npm run db:deploy` (creates the tables)
4. `ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run admin:create` (also resets a forgotten password)
5. `npm run dev` and open `/admin`

Without `DATABASE_URL` the public site still works and shows the built-in content.

### Cloudflare R2

1. Use the `malikarjuna` bucket and public media URL from `.env.example`.
2. Create a [Cloudflare R2 API token](https://developers.cloudflare.com/r2/api/tokens/) with *Object Read & Write* scoped to `malikarjuna`. Add its Access Key ID and Secret Access Key to the server environment as `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`.
3. Bucket → Settings → CORS policy:

```json
[{ "AllowedOrigins": ["https://your-domain.com", "http://localhost:3000"],
   "AllowedMethods": ["PUT"], "AllowedHeaders": ["content-type"], "MaxAgeSeconds": 3600 }]
```

`next.config.ts` adds the `R2_PUBLIC_URL` host to `next/image` automatically. Restart after changing it.

## How homepage content works

- `src/lib/site-content/schema.ts`: one Zod schema per section. The admin form is generated from it (labels and input types come from `.meta()`), and saves are validated against it.
- `src/lib/site-content/defaults.ts`: the original design. A section that was never edited (no row in `site_content`) uses these values.
- `src/lib/server/site-content.ts`: `getSiteContent()` merges saved sections over the defaults inside `'use cache'`. The homepage is static and is re-rendered only when an admin saves (`updateTag("site-content")`). If the database is unreachable, the defaults are served and retried within minutes.
- Components read their section with `useSiteContent()`, e.g. `const { hero } = useSiteContent()`.

**To make something else editable:** add the field to the schema, add its current value to the defaults, and read it in the component. The admin form picks it up automatically. To add a whole section, also register it in `siteContentSchemas` and `SITE_CONTENT_SECTIONS`.

## How products and categories work

- `src/lib/catalog/schema.ts`: Zod schemas for a product and a category. As with homepage sections, they validate saves and generate the admin forms (Admin → Products / Categories).
- Tables `products` and `categories`: one row per record; the slug is the key (`/product/<id>`, `/category/<slug>`) and the other fields are stored as JSON in `data`.
- `src/lib/server/catalog.ts`: `getCatalog()` reads both tables inside `'use cache'`; the root layout passes the result to every page through `CatalogProvider`. Saving in the admin calls `updateTag("catalog")`, so the whole site updates at once.
- Client components read products with `useCatalog()` (`src/lib/catalog/context.tsx`); server pages call `getCatalog()`. Helpers in `src/lib/catalog/queries.ts`.
- **Built-in catalog**: `src/data/products.ts` and `src/data/categories.ts` are only the starting point now. While both tables are empty (or the database is unreachable) the site shows them; the first save in the admin (or "Copy into database") copies them into the tables so nothing disappears. After that, edit products in the admin, not in those files.
- A product's **categories** are chosen on the product ("Show in categories"); a category page lists the products that tick it. The product **type** only drives "related products" and the breadcrumb. The Kurnool landing pages (`/sofas-kurnool` …) list the products in the category with the same slug.
- Collections (`/collections/*`, homepage rows) still pick products by rule and by the id lists in `src/data/collections.ts`.

## Files

| Path | Purpose |
| --- | --- |
| `src/lib/server/{env,db,auth,session,storage}.ts` | Config, Prisma client, Better Auth, admin guard, R2/local storage |
| `src/app/admin/actions.ts` | Server actions: save/reset sections, products, categories, media, enquiries (all require login) |
| `src/app/actions/enquiry.ts` | Public action: stores inquiry-form submissions |
| `src/app/api/auth/[...all]` | Better Auth endpoints |
| `src/app/api/uploads/presign` | Issues an upload URL (R2, or `/api/uploads/local` in dev) |
| `src/app/admin/**` | Admin pages; `src/components/admin/**` their UI |
| `scripts/create-admin.ts` | Creates an admin or resets a password |

## Commands

| Command | |
| --- | --- |
| `npm run db:migrate` | After editing `schema.prisma`: creates and applies a migration (dev) |
| `npm run db:deploy` | Applies migrations (production / Neon) |
| `npm run db:studio` | Browse the database |
| `npm run admin:create` | Add an admin / reset a password |
