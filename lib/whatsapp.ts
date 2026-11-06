/**
 * WhatsApp Messaging & Deep-Link Standardization Utility
 * Swati Home Tuition Bureau (JOB-02)
 *
 * Ensures all phone numbers (especially 10-digit Indian mobile numbers)
 * are properly normalized with country code "91" so WhatsApp deep links (wa.me)
 * never fail with "Invalid Phone Number".
 */

export const CANONICAL_SUPPORT_PHONE = "919229738307";
export const CANONICAL_SUPPORT_PHONE_DISPLAY = "+91 92297 38307";
export const CANONICAL_SITE_URL = "https://swatihometuition.in";
export const TEACHER_LOGIN_URL = "https://swatihometuition.in/teacher/login";
export const PARENT_LOGIN_URL = "https://swatihometuition.in/portal/login";

/**
 * Normalizes an Indian phone number to include the '91' international country code
 * required by WhatsApp wa.me links.
 *
 * Examples:
 * - "9835012345" -> "919835012345"
 * - "09835012345" -> "919835012345"
 * - "+91 98350 12345" -> "919835012345"
 * - "+9109835012345" -> "919835012345"
 * - "919835012345" -> "919835012345"
 */
export function normalizeIndianPhone(phone: string | null | undefined): string {
  if (!phone) return "";

  // Strip all non-digit characters
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  // If phone starts with 910... (13 digits: 91 country code + leading 0 + 10 digits)
  if (digits.length === 13 && digits.startsWith("910")) {
    return `91${digits.slice(3)}`;
  }

  // If phone starts with a single leading zero followed by 10 digits (11 digits total: e.g. 09835012345)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // If 10 digits (Standard Indian mobile number), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // If already 12 digits starting with 91
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }

  // Return cleaned digits for other international lengths
  return digits;
}

/**
 * Generates a valid WhatsApp deep link (`https://wa.me/<phone>?text=<encoded_text>`).
 * Sanitizes the phone number with country code `91` to avoid "Invalid Phone Number" errors.
 * If phone is empty/null, returns a generic share link `https://wa.me/?text=...` or `https://wa.me/`.
 */
export function formatWhatsAppUrl(phone: string | null | undefined, text?: string): string {
  const normalizedPhone = normalizeIndianPhone(phone);
  const encodedText = text ? encodeURIComponent(text) : "";

  if (!normalizedPhone) {
    return encodedText ? `https://wa.me/?text=${encodedText}` : "https://wa.me/";
  }

  return encodedText
    ? `https://wa.me/${normalizedPhone}?text=${encodedText}`
    : `https://wa.me/${normalizedPhone}`;
}

/**
 * Helper to generate a WhatsApp link directly to Swati Home Tuition Bureau's support desk (+91 92297 38307).
 */
export function formatSupportWhatsAppUrl(text?: string): string {
  return formatWhatsAppUrl(CANONICAL_SUPPORT_PHONE, text);
}
