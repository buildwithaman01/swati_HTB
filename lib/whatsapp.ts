/**
 * WhatsApp Messaging & Deep-Link Standardization Utility
 * Swati Home Tuition Bureau (JOB-02)
 *
 * Ensures all phone numbers (especially 10-digit Indian mobile numbers)
 * are properly normalized with country code "91" so WhatsApp deep links (wa.me)
 * never fail with "Invalid Phone Number".
 *
 * Houses canonical WhatsApp message templates for:
 * 1. New tutor onboarding announcement message (for recruitment & system upgrades)
 * 2. Post-form submission 4-step onboarding explanation
 * 3. Teacher & Student/Parent portal credentials
 * 4. Tuition assignment notifications & review requests
 */

export const CANONICAL_SUPPORT_PHONE = "919229738307";
export const CANONICAL_SUPPORT_PHONE_DISPLAY = "+91 92297 38307";
export const BACKUP_SUPPORT_PHONE = "919229738307";
export const BACKUP_SUPPORT_PHONE_DISPLAY = "+91 92297 38307";
export const CANONICAL_SITE_URL = "https://swatihometuition.in";
export const TEACHER_LOGIN_URL = "https://swatihometuition.in/teacher/login";
export const PARENT_LOGIN_URL = "https://swatihometuition.in/portal/login";
export const JOIN_TUTOR_URL = "https://swatihometuition.in/join";

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

// ─────────────────────────────────────────────────────────────────────────────
// 1. NEW TUTOR ONBOARDING ANNOUNCEMENT MESSAGE
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Broadcast message sent to prospective and existing tutors in Patna
 * inviting them to register/onboard on the upgraded Swati HTB platform.
 */
export function buildTutorOnboardingAnnouncementMessage(): string {
  return (
    `🚀 *Exciting Announcement for Home Tutors in Patna!*\n\n` +
    `Dear Educator,\n\n` +
    `*Swati Home Tuition Bureau* (Patna's premier home tutoring network) has upgraded to a modern, digital management platform!\n\n` +
    `We are expanding our verified faculty network across all major Patna localities (Boring Road, Kankarbagh, Patliputra, Bailey Road, Saguna More, Ashiana, Anisabad, and more).\n\n` +
    `🌟 *Why Teach With Swati Home Tuition Bureau?*\n` +
    `✅ *Verified Faculty ID Card* — Official ID with QR credentials to present to parents.\n` +
    `✅ *Digital Tutor Dashboard* — Track your active students, classes, and monthly schedules.\n` +
    `✅ *Transparent Payouts* — Guaranteed on-time monthly fee disbursements (75% teacher share).\n` +
    `✅ *Consistent Tuition Leads* — Verified student requirements matching your preferred subjects and PIN codes.\n\n` +
    `📋 *How to Register (Quick 3-Minute Form):*\n` +
    `👉 Fill your application here:\n` +
    `${JOIN_TUTOR_URL}\n\n` +
    `Our academic matching team will review your profile and initiate your 4-Step Verification within 24-48 hours.\n\n` +
    `📞 *Questions or Assistance?*\n` +
    `Call/WhatsApp: ${CANONICAL_SUPPORT_PHONE_DISPLAY}\n` +
    `Website: ${CANONICAL_SITE_URL}\n\n` +
    `— *Faculty Relations Desk*\nSwati Home Tuition Bureau, Patna`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. POST-FORM SUBMISSION 4-STEP ONBOARDING PROCESS EXPLANATION
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Explains the official 4-step onboarding journey to applicant teachers:
 * Document Verification -> Subject Interview -> ID Card Generation -> Student Tuition Matching
 */
export function buildTutor4StepOnboardingMessage(teacherName?: string): string {
  const salutation = teacherName?.trim() ? `Dear ${teacherName.trim()},` : "Dear Teacher,";

  return (
    `📋 *Swati Home Tuition Bureau — Teacher Onboarding Journey*\n\n` +
    `${salutation}\n\n` +
    `Thank you for applying to join *Swati Home Tuition Bureau*! We have received your profile details.\n\n` +
    `To ensure high teaching standards for our parents and safe, dignified assignments for our teachers, every educator completes our *4-Step Verification Process*:\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `1️⃣ *Step 1: Document Verification*\n` +
    `   Our team verifies your government ID (Aadhaar) and highest qualification credentials.\n\n` +
    `2️⃣ *Step 2: Subject & Pedagogy Interview*\n` +
    `   A brief 10–15 minute telephonic/in-person interaction discussing your subject expertise, preferred boards (CBSE/ICSE/BSEB), and teaching methodology.\n\n` +
    `3️⃣ *Step 3: Official Bureau ID Card Generation*\n` +
    `   Once approved, your official Swati HTB Faculty ID Card is generated with a verifiable QR code for student visits.\n\n` +
    `4️⃣ *Step 4: Student Tuition Matching*\n` +
    `   We pair you with confirmed home tuition assignments in your preferred Patna localities and facilitate your first demo class.\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `⏳ *Estimated Timeline:* 24 to 48 hours.\n\n` +
    `🔗 *Teacher Portal Login:* ${TEACHER_LOGIN_URL}\n\n` +
    `📞 *Need to expedite your review?*\n` +
    `Reply directly to this WhatsApp message or call our Teacher Support Desk at ${CANONICAL_SUPPORT_PHONE_DISPLAY}.\n\n` +
    `— *Swati Home Tuition Bureau, Patna*`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEACHER & STUDENT / PARENT CREDENTIAL MESSAGES
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Teacher welcome message with login credentials and next steps.
 */
export function buildTeacherCredentialsMessage(params: {
  teacherName: string;
  loginId: string;
  password?: string;
}): string {
  const { teacherName, loginId, password } = params;
  const pwDisplay = password?.trim() || "[Password set by Bureau Administrator]";

  return (
    `🎉 *Welcome to Swati Home Tuition Bureau!*\n\n` +
    `Dear ${teacherName},\n\n` +
    `You have been approved as a verified teacher on our platform.\n\n` +
    `*Your Login Details:*\n` +
    `🔗 Teacher Portal: ${TEACHER_LOGIN_URL}\n` +
    `📧 Login ID / Phone: ${loginId}\n` +
    `🔑 Password: ${pwDisplay}\n\n` +
    `*Your Teacher ID* will be visible on your dashboard after login.\n\n` +
    `*Next Steps:*\n` +
    `1. Log in to your portal: ${TEACHER_LOGIN_URL}\n` +
    `2. Download your verified Swati HTB Faculty ID Card\n` +
    `3. Confirm your teaching localities and available time slots\n` +
    `4. Review your active student assignments\n\n` +
    `📞 *Support Helpline:* ${CANONICAL_SUPPORT_PHONE_DISPLAY} (or reply directly to this message)\n\n` +
    `— *Swati Home Tuition Bureau Team*`
  );
}

/**
 * Teacher approval notice (sent when status changes to approved, without resetting password).
 */
export function buildTeacherApprovalMessage(teacherName: string): string {
  return (
    `✅ *Your Tutor Profile has been Approved!*\n\n` +
    `Dear ${teacherName},\n\n` +
    `Welcome to *Swati Home Tuition Bureau* — Patna's Most Trusted Tuition Service.\n\n` +
    `Your teacher account is now active. You can log in to your dashboard anytime:\n` +
    `🔗 Teacher Portal: ${TEACHER_LOGIN_URL}\n\n` +
    `Our matching team will contact you shortly with confirmed home tuition assignments matching your preferred localities and subjects.\n\n` +
    `📞 *Support Helpline:* ${CANONICAL_SUPPORT_PHONE_DISPLAY}\n` +
    `— *Swati Home Tuition Bureau Team*`
  );
}

/**
 * Student / Parent portal access credentials message with clear instructions.
 */
export function buildStudentCredentialsMessage(params: {
  studentName: string;
  parentName?: string;
  loginId: string;
  password?: string;
}): string {
  const { studentName, parentName, loginId, password } = params;
  const greeting = parentName ? `Dear ${parentName} (Parent/Guardian of *${studentName}*)` : `Dear Parent/Guardian of *${studentName}*`;
  const pwDisplay = password?.trim() || "[Password set by Bureau Administrator]";

  return (
    `🎉 *Welcome to Swati Home Tuition Bureau!*\n\n` +
    `${greeting},\n\n` +
    `Your official Parent Portal account is now active.\n\n` +
    `*Your Login Credentials:*\n` +
    `🔗 Parent Portal: ${PARENT_LOGIN_URL}\n` +
    `📧 Login ID / Phone: ${loginId}\n` +
    `🔑 Password: ${pwDisplay}\n\n` +
    `*How to Access Your Portal:*\n` +
    `1. Click the portal link: ${PARENT_LOGIN_URL}\n` +
    `2. Enter your Phone/Email: ${loginId}\n` +
    `3. Enter your Password: ${pwDisplay}\n\n` +
    `*Inside Your Parent Portal, You Can:*\n` +
    `✅ Track tutor attendance & verified session logs\n` +
    `✅ Review monthly student test scores & progress reports\n` +
    `✅ View fee receipts & tuition payment records\n` +
    `✅ Rate and review your assigned tutor\n\n` +
    `📞 *Need Assistance?* Call/WhatsApp: ${CANONICAL_SUPPORT_PHONE_DISPLAY} (or reply to this message)\n\n` +
    `— *Swati Home Tuition Bureau Team*`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ASSIGNMENT NOTIFICATION & REVIEW MESSAGES
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Assignment notification to teacher.
 */
export function buildTeacherAssignmentMessage(params: {
  teacherName: string;
  studentName?: string;
  parentName?: string;
  subject: string;
  fee?: number | string;
  schedule?: string;
  locality?: string;
}): string {
  const { teacherName, studentName, parentName, subject, fee, schedule, locality } = params;

  let feeSection = "";
  if (fee) {
    const feeNum = typeof fee === "number" ? fee : parseFloat(fee);
    if (!isNaN(feeNum)) {
      feeSection = `💰 *Monthly Fee:* ₹${feeNum.toLocaleString("en-IN")}\n`;
    }
  }

  const schedSection = schedule ? `⏰ *Schedule:* ${schedule}\n` : "";
  const locSection = locality ? `📍 *Locality:* ${locality}\n` : "";

  return (
    `🔔 *New Tuition Assignment!*\n\n` +
    `Dear ${teacherName || "Teacher"},\n\n` +
    `You have been assigned a new tuition for *${subject || "Home Tuition"}*.\n\n` +
    `👤 *Student:* ${studentName || "Assigned Student"}\n` +
    `👨‍👩‍👧 *Parent/Guardian:* ${parentName || "Parent"}\n` +
    locSection +
    schedSection +
    feeSection +
    `\nPlease open your Teacher Dashboard to review full student details, home address, and session guidelines.\n` +
    `🔗 Teacher Portal: ${TEACHER_LOGIN_URL}\n\n` +
    `📞 Support: ${CANONICAL_SUPPORT_PHONE_DISPLAY}\n` +
    `— *Swati Home Tuition Bureau*`
  );
}

/**
 * Assignment notification to parent.
 */
export function buildParentAssignmentMessage(params: {
  parentName: string;
  studentName: string;
  teacherName: string;
  subject: string;
  fee?: number | string;
  schedule?: string;
}): string {
  const { parentName, studentName, teacherName, subject, fee, schedule } = params;

  let feeSection = "";
  if (fee) {
    const feeNum = typeof fee === "number" ? fee : parseFloat(fee);
    if (!isNaN(feeNum)) {
      feeSection = `💰 *Monthly Fee:* ₹${feeNum.toLocaleString("en-IN")}\n`;
    }
  }

  const schedSection = schedule ? `⏰ *Schedule:* ${schedule}\n` : "";

  return (
    `🎓 *Teacher Assigned — Swati Home Tuition Bureau*\n\n` +
    `Dear ${parentName || "Parent"},\n\n` +
    `We have assigned *${teacherName || "our verified teacher"}* as your home tutor for *${subject || "Tuition"}* (${studentName || "Student"}).\n\n` +
    schedSection +
    feeSection +
    `You can track tutor attendance, class logs, test scores, and fee records anytime in your Parent Portal:\n` +
    `🔗 Parent Portal: ${PARENT_LOGIN_URL}\n\n` +
    `📞 Questions or assistance? Call/WhatsApp: ${CANONICAL_SUPPORT_PHONE_DISPLAY}\n` +
    `— *Swati Home Tuition Bureau*`
  );
}

/**
 * Review request message sent to parent.
 */
export function buildParentReviewRequestMessage(params: {
  parentName?: string;
  studentName?: string;
  teacherName?: string;
  subject?: string;
  reviewUrl: string;
}): string {
  const { parentName, studentName, teacherName, subject, reviewUrl } = params;
  const parentGreeting = parentName ? `Dear ${parentName} ji` : "Dear Parent";
  const studentRef = studentName ? `*${studentName}*` : "your child";
  const teacherRef = teacherName ? `*${teacherName}*` : "our tutor";
  const subjectRef = subject ? `*${subject}*` : "home tuition";

  return (
    `Namaste ${parentGreeting}! 🙏\n\n` +
    `We hope ${studentRef} is having productive and enjoyable classes with ${teacherRef} for ${subjectRef}.\n\n` +
    `Your feedback is very valuable to us at Swati Home Tuition Bureau to ensure the highest teaching quality.\n\n` +
    `Could you please take 1 minute to share a quick rating and review of ${teacherRef}?\n\n` +
    `👉 Tap here to submit your review:\n` +
    `${reviewUrl}\n\n` +
    `Thank you for placing your trust in Swati Home Tuition Bureau! 🌟`
  );
}
