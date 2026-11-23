import { HomeClient } from "@/app/HomeClient";
import { getSiteContent } from "@/lib/server/site-content";
import { SiteContentProvider } from "@/lib/site-content/context";

// Content is cached (and prerendered) until an admin publishes a change.
export default async function Home() {
  const content = await getSiteContent();

  return (
    <SiteContentProvider value={content}>
      <HomeClient />
    </SiteContentProvider>
  );
}
