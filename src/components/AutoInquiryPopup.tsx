"use client";

import { submitEnquiryAction } from "@/app/actions/enquiry";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SHOWROOM_INFO } from "@/data/products";
import { BrandLogo } from "@/components/BrandLogo";
import type { SiteContent } from "@/lib/site-content/schema";

interface InquiryData {
  name: string;
  phone: string;
  category: string;
  requirement: string;
}

// Photos, text, categories and timing are edited in Admin → Inquiry popup.
const emptyForm = (categories: string[]): InquiryData => ({
  name: "",
  phone: "",
  category: categories[0] ?? "",
  requirement: "",
});

const SLIDE_INTERVAL_MS = 3500;
const THANK_YOU_DURATION_MS = 5000;

export const AutoInquiryPopup: React.FC<{ content: SiteContent["inquiryPopup"] }> = ({ content }) => {
  const { autoOpen, delaySeconds, showLauncher, launcherText, slides: PROMO_SLIDES, categories: CATEGORY_OPTIONS } = content;
  const [isOpen, setIsOpen] = useState(false);
  // Without auto-open, the floating button is the way in from the start.
  const [isMinimized, setIsMinimized] = useState(!autoOpen);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Form Fields
  const [formData, setFormData] = useState<InquiryData>(() => emptyForm(CATEGORY_OPTIONS));

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryData, string>>>({});

  // Opens on every page load (unless switched off in the admin), after a short delay so the page settles first
  useEffect(() => {
    const timer = autoOpen ? setTimeout(() => setIsOpen(true), delaySeconds * 1000) : undefined;

    // Support custom event to open inquiry modal from any button on site
    const handleOpenCustom = () => {
      setIsOpen(true);
      setIsMinimized(false);
      setIsSubmitted(false);
    };

    window.addEventListener("open-inquiry-modal", handleOpenCustom);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("open-inquiry-modal", handleOpenCustom);
    };
  }, [autoOpen, delaySeconds]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(true);
    // The thank-you screen is one-off: reopening the popup always starts from a fresh form.
    setIsSubmitted(false);
    setFormData(emptyForm(CATEGORY_OPTIONS));
    setErrors({});
    // Notice: We deliberately do NOT set sessionStorage here so that refreshing/reloading
    // the page will trigger the popup automatically as requested.
  }, [CATEGORY_OPTIONS]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Thank-you screen closes itself after a few seconds
  useEffect(() => {
    if (!isOpen || !isSubmitted) return;
    const timer = setTimeout(handleClose, THANK_YOU_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen, isSubmitted, handleClose]);

  // Auto-advance the banner carousel while the form is showing
  useEffect(() => {
    if (!isOpen || isSubmitted || PROMO_SLIDES.length < 2) return;
    const timer = setInterval(() => {
      setActiveSlide((i) => (i + 1) % PROMO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, PROMO_SLIDES.length]);

  const handleOpenManually = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Please enter your phone number";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    let message = `*Hello Mallikarjuna Furniture World Kurnool,*\n`;
    message += `I would like to inquire about your furniture collection:\n\n`;
    message += `👤 *Name:* ${formData.name.trim()}\n`;
    message += `📱 *Phone:* ${formData.phone.trim()}\n`;
    message += `🛋️ *Looking for:* ${formData.category}\n`;
    if (formData.requirement.trim()) {
      message += `📝 *Requirement:* ${formData.requirement.trim()}\n`;
    }
    message += `\nPlease share catalogue, current offers, and showroom visit details.`;

    const whatsappUrl = `https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Also record it for Admin → Enquiries. Fire-and-forget: WhatsApp opens regardless.
    submitEnquiryAction({
      name: formData.name,
      phone: formData.phone,
      category: formData.category,
      requirement: formData.requirement,
      pagePath: window.location.pathname,
    }).catch(() => undefined);

    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 350);
  };

  return (
    <>
      {/* Floating Re-Open Badge (when closed) */}
      {isMinimized && !isOpen && showLauncher && (
        <button
          type="button"
          onClick={handleOpenManually}
          id="inquiry-floating-launcher"
          className="inquiry-floating-launcher"
          aria-label="Open Inquiry Form"
        >
          <span className="inquiry-live-dot" aria-hidden="true" />
          <span className="inquiry-live-title">{launcherText}</span>
        </button>
      )}

      {/* Main Modal Backdrop & Container */}
      {isOpen && (
        <div
          id="inquiry-popup-backdrop"
          className="inquiry-popup-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
        >
          <div className="inquiry-popup-card compact-card" data-lenis-prevent>
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="inquiry-popup-close-btn"
              aria-label="Close inquiry window"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {!isSubmitted ? (
              <>
                {/* Promo banner: copy on the left, product photo bleeding in from the right */}
                <div className="inquiry-promo">
                  {PROMO_SLIDES.map((slide, i) => (
                    <Image
                      key={slide.image}
                      src={slide.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 370px, 460px"
                      className={`inquiry-promo-img ${i === activeSlide ? "is-active" : ""}`}
                      style={{ objectPosition: slide.position || "50% 50%" }}
                      priority={i === 0}
                    />
                  ))}
                  <div className="inquiry-promo-copy">
                    <BrandLogo height={36} className="inquiry-promo-logo" />
                  </div>

                  {PROMO_SLIDES.length > 1 && (
                    <div className="inquiry-promo-dots" role="tablist" aria-label="Banner images">
                      {PROMO_SLIDES.map((slide, i) => (
                        <button
                          key={slide.image}
                          type="button"
                          role="tab"
                          aria-selected={i === activeSlide}
                          aria-label={`Show image ${i + 1}`}
                          className={`inquiry-promo-dot ${i === activeSlide ? "is-active" : ""}`}
                          onClick={() => setActiveSlide(i)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="inquiry-compact-body">
                  <div className="inquiry-compact-header">
                    <h3 id="inquiry-modal-title" className="inquiry-compact-title">
                      {content.title}
                    </h3>
                    <p className="inquiry-compact-subtitle">{content.subtitle}</p>
                  </div>

                  <form onSubmit={handleWhatsAppSubmit} className="inquiry-compact-form">
                    {/* Category Dropdown (No icons, aligned and styled) */}
                    <div className="inquiry-input-box">
                      <label htmlFor="inquiry-category" className="inquiry-input-label">
                        {content.categoryLabel}
                      </label>
                      <div className="inquiry-select-wrap">
                        <select
                          id="inquiry-category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="inquiry-compact-select"
                          aria-label={content.categoryLabel}
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <span className="inquiry-select-arrow" aria-hidden="true">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 1.5 6 6.5 11 1.5"></polyline>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Name & Phone in 2 clean columns */}
                    <div className="inquiry-compact-row">
                      <div className="inquiry-input-box">
                        <label htmlFor="inquiry-name" className="inquiry-input-label">
                          Your Name <span className="inquiry-req">*</span>
                        </label>
                        <input
                          id="inquiry-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: undefined });
                          }}
                          placeholder="Your Name"
                          className={`inquiry-compact-input ${errors.name ? "is-error" : ""}`}
                        />
                        {errors.name && <span className="inquiry-error-msg">{errors.name}</span>}
                      </div>

                      <div className="inquiry-input-box">
                        <label htmlFor="inquiry-phone" className="inquiry-input-label">
                          WhatsApp Number <span className="inquiry-req">*</span>
                        </label>
                        <div className="inquiry-phone-wrap">
                          <span className="inquiry-phone-prefix">+91</span>
                          <input
                            id="inquiry-phone"
                            type="tel"
                            maxLength={12}
                            value={formData.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              setFormData({ ...formData, phone: val });
                              if (errors.phone) setErrors({ ...errors, phone: undefined });
                            }}
                            placeholder="98490 XXXXX"
                            className={`inquiry-compact-input with-prefix ${errors.phone ? "is-error" : ""}`}
                          />
                        </div>
                        {errors.phone && <span className="inquiry-error-msg">{errors.phone}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="inquiry-compact-actions">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inquiry-btn-whatsapp"
                        id="inquiry-submit-whatsapp"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        <span>{isSubmitting ? "Connecting..." : content.buttonText}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              /* Success View */
              <div className="inquiry-compact-success">
                <div className="inquiry-success-medallion">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5A45D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                <h4 className="inquiry-success-title">
                  Thank You, {formData.name || "Esteemed Guest"}!
                </h4>

                <p className="inquiry-success-desc">
                  Your inquiry for <strong className="text-navy">{formData.category}</strong> has been received. Our Kurnool furniture specialist is preparing details and will reach out to you shortly.
                </p>

                <span
                  className="inquiry-success-timer"
                  style={{ animationDuration: `${THANK_YOU_DURATION_MS}ms` }}
                  aria-hidden="true"
                />

                <div className="inquiry-success-actions">
                  <a
                    href={`https://wa.me/${SHOWROOM_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Mallikarjuna Furniture World Kurnool, I submitted an inquiry for ${formData.category} on your website. My name is ${formData.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inquiry-btn-whatsapp"
                    style={{ textDecoration: "none" }}
                  >
                    <span>Chat on WhatsApp Directly</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="inquiry-btn-callback-link"
                  >
                    Close &amp; Continue Browsing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
