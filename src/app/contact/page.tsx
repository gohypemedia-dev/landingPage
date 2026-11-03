import type { Metadata } from "next";
import { SHOWROOM_INFO } from "@/data/products";
import { InfoPage } from "@/components/shop/InfoPage";

export const metadata: Metadata = {
  title: "Contact Us | Casablanca Sofas Kurnool",
  description: "Visit, call or WhatsApp Casablanca Sofas in Kurnool for furniture enquiries, prices and showroom visits.",
};

const whatsappUrl = `https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(
  "Hello Casablanca Sofas Kurnool, I have an enquiry."
)}`;

export default function ContactPage() {
  return (
    <InfoPage title="Contact Us">
      <div className="ip-contact">
        <div className="ip-contact-cards">
          <section>
            <h2>Showroom</h2>
            <p>{SHOWROOM_INFO.address}</p>
            <a href={SHOWROOM_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer">
              Get Directions →
            </a>
          </section>
          <section>
            <h2>Opening Hours</h2>
            <p>{SHOWROOM_INFO.timing}</p>
          </section>
          <section>
            <h2>Phone</h2>
            <a href={`tel:${SHOWROOM_INFO.phone}`}>{SHOWROOM_INFO.displayPhone}</a>
          </section>
          <section>
            <h2>Email</h2>
            <a href={`mailto:${SHOWROOM_INFO.email}`}>{SHOWROOM_INFO.email}</a>
          </section>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="cd-btn cd-btn--whatsapp">
            Send Inquiry
          </a>
        </div>
        <div className="ip-map">
          <iframe src={SHOWROOM_INFO.mapEmbedUrl} title="Showroom location on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </div>
    </InfoPage>
  );
}
