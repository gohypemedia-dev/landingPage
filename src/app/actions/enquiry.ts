"use server";

import { z } from "zod";

import { getPrisma } from "@/lib/server/db";
import { isDatabaseConfigured } from "@/lib/server/env";

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid phone number"),
  category: z.string().trim().max(120).optional(),
  requirement: z.string().trim().max(2000).optional(),
  pagePath: z.string().trim().max(300).optional(),
  // Honeypot: real visitors never fill this hidden field.
  website: z.string().max(0).optional(),
});

/**
 * Saves an enquiry so it shows up in Admin → Enquiries. The visitor is still
 * sent to WhatsApp by the form; this never blocks or fails that flow.
 */
export async function submitEnquiryAction(input: unknown): Promise<{ ok: boolean }> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success || !isDatabaseConfigured()) return { ok: false };

  const { name, phone, category, requirement, pagePath } = parsed.data;
  try {
    await getPrisma().enquiry.create({ data: { name, phone, category, requirement, pagePath } });
    return { ok: true };
  } catch (error) {
    console.error("[enquiry] could not be saved", error);
    return { ok: false };
  }
}
