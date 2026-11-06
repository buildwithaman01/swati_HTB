/**
 * SWATI HOME TUITION BUREAU (JOB-02) — GOOGLE APPS SCRIPT WEBHOOK & MASTER CONTROLLER
 * Location: Patna, Bihar | Project: Swati Home Tuition Bureau
 * Official Website: https://swatihometuition.in
 * Master Workbook ID: 1xQytzs7Jz9et2dREZjjYWwvoB37m63GzFct-rMSjeO0
 * 
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO DEPLOY / RENEW ON VERCEL:
 * 1. Open Google Sheets (or script.google.com)
 * 2. Extensions > Apps Script
 * 3. Copy-paste this entire file into Code.gs
 * 4. Click "Deploy" > "New deployment"
 * 5. Click the gear icon (Select type) > Choose "Web app"
 * 6. Configuration:
 *    - Description: "Swati HTB Production Webhook v2"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"  <-- CRITICAL! Must be "Anyone" so Vercel can POST without Google login!
 * 7. Click "Deploy", Authorize permissions when prompted.
 * 8. Copy the Web App URL (starts with https://script.google.com/macros/s/.../exec)
 * 9. In Vercel Project Settings > Environment Variables:
 *    - Variable: GOOGLE_SHEET_WEBHOOK_URL
 *    - Value: [Paste your Web App URL]
 *    - Check: Production, Preview, Development
 *    - Click Save and Redeploy on Vercel!
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION & CANONICAL SCHEMA CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
var CONFIG = {
  SPREADSHEET_ID: "1xQytzs7Jz9et2dREZjjYWwvoB37m63GzFct-rMSjeO0",
  TEACHER_SHEET_NAME: "Teacher Master Record",
  STUDENT_SHEET_NAME: "Student Leads",
  HEADER_ROW: 8,
  FIRST_DATA_ROW: 9,
  START_COL: 2,       // Column B
  TOTAL_COLUMNS: 37,  // Columns B through AL (37 data columns)
  TIMEZONE: "Asia/Kolkata",
  SUPABASE_STORAGE_URL: "https://swatihometuition.in/api/docs/view?file=",
  FALLBACK_PENDING_URL: "https://swatihometuition.in/admin/kyc-pending",
  FALLBACK_PORTFOLIO_URL: "https://swatihometuition.in/verification"
};

// Exact Canonical 37-Column Headers (Columns B through AL)
var HEADERS_B_TO_AL = [
  "Submission Timestamp",         // Col B  (2) - YYYY-MM-DD HH:MM:SS
  "Application ID",              // Col C  (3) - TCH-YYYY-NNN (Drives KPI COUNTA)
  "Application Status",           // Col D  (4) - Pending / Approved / Rejected
  "First Name",                   // Col E  (5) - Proper Case
  "Last Name",                    // Col F  (6) - Proper Case
  "Gender",                       // Col G  (7) - Female / Male / Non-Binary / Prefer not to say
  "Date of Birth",                // Col H  (8) - YYYY-MM-DD
  "Email Address",                // Col I  (9) - Lowercase RFC email
  "Phone Number",                 // Col J (10) - +X-XXX-XXX-XXXX format
  "WhatsApp Number",              // Col K (11) - +X-XXX-XXX-XXXX format
  "Current Address",              // Col L (12) - Street address text
  "City",                         // Col M (13) - Default: "Patna"
  "State",                        // Col N (14) - Default: "Bihar"
  "Postal Code",                  // Col O (15) - Alphanumeric/Numeric, e.g. "800001"
  "Country",                      // Col P (16) - Default: "India"
  "Highest Qualification",        // Col Q (17) - Degree title
  "Specialization / Major",       // Col R (18) - Academic discipline
  "University / Institute",       // Col S (19) - Institution name
  "Graduation Year",              // Col T (20) - 4-digit YYYY (1950 - Current Year)
  "Primary Subjects Taught",      // Col U (21) - Comma-separated list
  "Secondary Subjects",           // Col V (22) - Secondary subjects / classes
  "Total Years of Experience",    // Col W (23) - Numeric >= 0
  "Preferred Teaching Mode",      // Col X (24) - In-Person Only / Online Only / Hybrid
  "Available Hours / Week",       // Col Y (25) - Integer 1 to 80
  "Expected Hourly Rate (USD)",   // Col Z (26) - Numeric > 0
  "LinkedIn Profile URL",         // Col AA(27) - https://... or blank
  "Portfolio / Resume URL",       // Col AB(28) - https://...
  "Government ID Type",           // Col AC(29) - Aadhaar Card / Passport / Driver's License
  "Government ID Number",         // Col AD(30) - Alphanumeric ID string
  "ID Proof Document Link",       // Col AE(31) - Accessible https:// URL
  "Address Proof Document Link",  // Col AF(32) - Accessible https:// URL
  "Degree Certificate Link",      // Col AG(33) - Accessible https:// URL
  "Background Check Status",      // Col AH(34) - In Progress / Verified / Failed
  "Reference Contact Name",       // Col AI(35) - Non-empty plain text
  "Reference Contact Info",       // Col AJ(36) - Contact phone/email
  "Admin Reviewer Notes",         // Col AK(37) - Free-form reviewer notes
  "Last Updated Timestamp"        // Col AL(38) - YYYY-MM-DD HH:MM:SS
];

// ─────────────────────────────────────────────────────────────────────────────
// SPREADSHEET RESOLUTION HELPER (Container-Bound & Standalone Compatible)
// ─────────────────────────────────────────────────────────────────────────────
function getSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    // Container-bound resolution not available
  }
  if (!ss && CONFIG.SPREADSHEET_ID) {
    try {
      ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    } catch (openErr) {
      Logger.log("Failed to open spreadsheet by ID: " + openErr.message);
    }
  }
  return ss;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. WEBHOOK RECEIVER (POST)
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  if (!lock.tryLock(15000)) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server is currently busy processing another submission. Please retry in a moment."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = getSpreadsheet();
    if (!ss) {
      throw new Error("Could not access Google Spreadsheet. Check SPREADSHEET_ID in CONFIG.");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        return ContentService.createTextOutput(JSON.stringify({ 
          status: "error", 
          message: "Malformed JSON payload received: " + parseErr.message 
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "No payload received" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var formType = String(data.formType || "").trim().toLowerCase();
    var isTeacher = (formType === "join-tutor-wizard" || formType === "join-tutor" || formType === "teacher" || formType === "tutor");
    var isStudentLead = (formType === "book-demo" || formType === "find-tutor" || formType === "callback" || formType === "demo" || formType === "student");

    // Smart fallback if formType is missing or custom
    if (!isTeacher && !isStudentLead) {
      if (data.qualification || data.college || data.aadhaar_number || data.experience) {
        isTeacher = true;
      } else {
        isStudentLead = true; // Safe default so no lead is ever dropped
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CASE A: STUDENT LEADS & DEMO REQUESTS
    // ─────────────────────────────────────────────────────────────────────────
    if (isStudentLead) {
      var studentSheet = ss.getSheetByName(CONFIG.STUDENT_SHEET_NAME) || ss.getSheetByName("Enquiries");
      if (!studentSheet) {
        studentSheet = ss.insertSheet(CONFIG.STUDENT_SHEET_NAME);
        var defaultStudentHeaders = [
          "Timestamp", "Lead ID", "Form Type", "Parent / Student Name", "Phone / WhatsApp",
          "Student Class", "Locality", "Full Address", "Subjects Required", "Specific Requirements & Notes", "Status"
        ];
        studentSheet.appendRow(defaultStudentHeaders);
        studentSheet.getRange(1, 1, 1, defaultStudentHeaders.length).setFontWeight("bold").setBackground("#E6F4EA");
      }

      var nextLeadId = generateNextStudentId(studentSheet);
      var leadTimestamp = formatTimestamp(data.timestamp);

      // Collect all rich parent notes
      var notesList = [
        data.requirements || "",
        data.notes || "",
        data.remarks || "",
        data.message || "",
        data.teacherPreference ? "Tutor Pref: " + data.teacherPreference : "",
        data.gender_preference ? "Gender Pref: " + data.gender_preference : "",
        data.preferred_timing ? "Timing: " + data.preferred_timing : ""
      ].filter(Boolean);

      var studentRow = [
        leadTimestamp,
        nextLeadId,
        formType || "Enquiry",
        data.name || data.fullName || data.parent_name || "Parent Lead",
        formatInternationalPhone(data.phone || data.whatsapp || ""),
        data.studentClass || data.class || "General",
        data.locality || "Patna",
        data.address || data.locality || "Patna",
        data.subjects || "All Subjects",
        notesList.length > 0 ? notesList.join(" | ") : "Website Lead Submission",
        "Enquiry"
      ];

      studentSheet.appendRow(studentRow);

      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        leadId: nextLeadId,
        message: "Student inquiry recorded successfully in Google Sheets"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CASE B: TEACHER ONBOARDING (WIZARD & DIRECT)
    // ─────────────────────────────────────────────────────────────────────────
    var teacherSheet = getTeacherMasterSheet(ss);
    if (!teacherSheet) {
      throw new Error("Could not find master teacher sheet ('" + CONFIG.TEACHER_SHEET_NAME + "') in active spreadsheet.");
    }

    var headerRowIndex = findHeaderRow(teacherSheet);
    var nextAppId = generateNextApplicationId(teacherSheet, headerRowIndex);
    var currentTimestamp = formatTimestamp(data.timestamp);

    // Build the 37-column array matching Columns B through AL
    var rowData = buildTeacherRowData(data, nextAppId, currentTimestamp);

    // Enforce Rule 1: Never write above Row 9
    var targetRow = getNextAvailableTeacherRow(teacherSheet);

    // Ensure sheet has enough columns (Col B to Col AL requires at least 38 columns)
    var requiredCols = CONFIG.START_COL + rowData.length; // 2 + 37 = 39
    if (teacherSheet.getMaxColumns() < requiredCols) {
      teacherSheet.insertColumnsAfter(teacherSheet.getMaxColumns(), requiredCols - teacherSheet.getMaxColumns());
    }

    // Write strictly starting at Column 2 (Column B) using 2D array [[...]]
    // Column A is left completely untouched as margin padding
    teacherSheet.getRange(targetRow, CONFIG.START_COL, 1, rowData.length).setValues([rowData]);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      applicationId: nextAppId,
      assignedRow: targetRow,
      columnsWritten: rowData.length,
      startColumn: "B (Col 2)",
      message: "Tutor application recorded successfully in Google Sheets"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HEALTH CHECK & DIAGNOSTICS (GET)
// ─────────────────────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss ? getTeacherMasterSheet(ss) : null;
    var headerRow = sheet ? findHeaderRow(sheet) : null;
    var totalRows = sheet ? sheet.getLastRow() : 0;
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "online",
      service: "Swati Home Tuition Bureau - Apps Script Webhook",
      sheetName: sheet ? sheet.getName() : "Not Found",
      headerRow: headerRow,
      totalRows: totalRows,
      startColumn: "B (Col 2)",
      columnsCount: CONFIG.TOTAL_COLUMNS,
      timestamp: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss")
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MASTER 37-COLUMN ROW BUILDER (COLUMNS B THROUGH AL)
// ─────────────────────────────────────────────────────────────────────────────
function buildTeacherRowData(data, appId, timestamp) {
  // 1. Names
  var fullName = String(data.name || data.fullName || "").trim();
  var nameParts = fullName ? fullName.split(/\s+/) : [];
  var rawFirst = data.firstName || data.first_name || (nameParts.length > 0 ? nameParts[0] : "Applicant");
  var rawLast = data.lastName || data.last_name || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : ".");
  var firstName = toProperCase(rawFirst);
  var lastName = toProperCase(rawLast);

  // 2. Application Status (Strict dropdown: "Pending", "Approved", "Rejected")
  var status = "Pending";
  if (data.status === "Approved" || data.status === "Rejected") {
    status = data.status;
  }

  // 3. Gender (Strict dropdown: "Female", "Male", "Non-Binary", "Prefer not to say")
  var rawGender = String(data.gender || "").trim().toLowerCase();
  var gender = "";
  if (rawGender === "female") gender = "Female";
  else if (rawGender === "male") gender = "Male";
  else if (rawGender === "non-binary" || rawGender === "nonbinary") gender = "Non-Binary";
  else if (rawGender === "prefer not to say" || rawGender === "other") gender = "Prefer not to say";

  // 4. Date of Birth (YYYY-MM-DD)
  var dob = formatIsoDate(data.dob || data.date_of_birth || data.dateOfBirth);

  // 5. Email Address
  var email = String(data.email || data.email_address || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    email = "applicant@swatihometuition.in";
  }

  // 6. Phone Numbers (Standardized international format: +91-XXXXX-XXXXX)
  var rawPhone = data.phone || data.whatsapp || "";
  var rawWa = data.whatsapp || data.phone || "";
  var phone = formatInternationalPhone(rawPhone);
  var whatsapp = formatInternationalPhone(rawWa);

  // 7. Address & Location
  var address = String(data.current_address || data.address || data.location || "Patna, Bihar").trim();
  var city = String(data.city || "Patna").trim();
  var state = String(data.state || "Bihar").trim();

  // Postal Code
  var pinMatch = address.match(/\b(80\d{4})\b/) || address.match(/\b(\d{6})\b/);
  var postalCode = String(data.postal_code || data.pincode || (pinMatch ? pinMatch[1] : "800001")).trim();
  var country = String(data.country || "India").trim();

  // 8. Academic Qualifications
  var qualMap = {
    "ba/bsc/bcom": "Bachelor of Arts / Science / Commerce",
    "ma/msc/mcom": "Master of Arts / Science / Commerce",
    "btech/be": "Bachelor of Technology (B.Tech / B.E)",
    "bed/med": "Bachelor of Education (B.Ed / M.Ed)",
    "phd": "Doctor of Philosophy (Ph.D.)"
  };
  var rawQual = String(data.qualification || "").trim();
  var qualification = qualMap[rawQual.toLowerCase()] || rawQual || "Bachelor's Degree";

  // Specialization / Major
  var subjectsList = String(data.subjects || "").trim();
  var firstSubject = subjectsList ? subjectsList.split(/[,/]/)[0].trim() : "General Academics";
  var specialization = String(data.specialization || data.major || firstSubject).trim() || "General Academics";

  // University / Institute
  var institute = String(data.college || data.university || data.institution || "Patna University").trim();

  // Graduation Year (Integer between 1950 and current year)
  var currentYear = new Date().getFullYear();
  var gradYear = parseInt(data.graduation_year, 10);
  if (isNaN(gradYear) || gradYear < 1950 || gradYear > currentYear) {
    var dobYearMatch = dob.match(/^(\d{4})/);
    var dobYear = dobYearMatch ? parseInt(dobYearMatch[1], 10) : NaN;
    if (!isNaN(dobYear) && dobYear >= 1950 && (dobYear + 21) <= currentYear) {
      gradYear = dobYear + 21;
    } else {
      var expYears = parseInt(data.experience, 10) || 0;
      gradYear = Math.max(currentYear - Math.max(expYears, 1), 2000);
    }
  }

  // Subjects
  var primarySubjects = subjectsList || "All Primary Subjects";
  var secondarySubjects = String(data.secondary_subjects || (data.classes ? "Target Classes: " + data.classes : "")).trim();

  // Experience (Number >= 0)
  var expNum = parseFloat(data.experience);
  if (isNaN(expNum) || expNum < 0) expNum = 0;

  // 9. Preferred Teaching Mode (Strict dropdown: "Online Only", "In-Person Only", "Hybrid")
  var rawMode = String(data.mode || "").trim().toLowerCase();
  var teachingMode = "In-Person Only";
  if (rawMode.includes("online") && !rawMode.includes("home") && !rawMode.includes("both") && !rawMode.includes("hybrid")) {
    teachingMode = "Online Only";
  } else if (rawMode.includes("both") || rawMode.includes("hybrid")) {
    teachingMode = "Hybrid";
  } else if (rawMode.includes("home") || rawMode.includes("visit") || rawMode.includes("person") || rawMode.includes("offline")) {
    teachingMode = "In-Person Only";
  }

  // Available Hours / Week (Positive integer between 1 and 80)
  var hours = parseInt(data.available_hours || data.hours || "20", 10);
  if (isNaN(hours) || hours < 1) hours = 20;
  if (hours > 80) hours = 80;

  // Expected Hourly Rate (Numeric > 0)
  var rate = parseFloat(data.expected_rate || data.expected_fee || data.fee);
  if (isNaN(rate) || rate <= 0) {
    rate = 20.00;
  }

  // 10. URLs & Document Verification
  var rawLinkedin = String(data.linkedin || "").trim();
  var linkedin = "";
  if (rawLinkedin) {
    linkedin = /^https?:\/\//i.test(rawLinkedin) ? rawLinkedin : "https://" + rawLinkedin;
  }

  var rawPortfolio = String(data.video_url || data.portfolio || "").trim();
  var portfolioUrl = "";
  if (rawPortfolio) {
    portfolioUrl = /^https?:\/\//i.test(rawPortfolio) ? rawPortfolio : "https://" + rawPortfolio;
  } else {
    portfolioUrl = CONFIG.FALLBACK_PORTFOLIO_URL;
  }

  var govtIdType = String(data.govt_id_type || "Aadhaar Card").trim();
  var govtIdNum = String(data.aadhaar_number || data.govt_id_number || "PENDING-VERIF").trim();

  // Document links must be valid https:// URLs
  var idProofUrl = sanitizeDocumentUrl(data.aadhaar_front_url || data.id_proof_url);
  var addressProofUrl = sanitizeDocumentUrl(data.aadhaar_back_url || data.address_proof_url);
  var degreeCertUrl = sanitizeDocumentUrl(data.degree_cert_url);

  // Background Check Status (Strict dropdown: "In Progress", "Verified", "Failed")
  var bgStatus = "In Progress";
  if (data.bg_status === "Verified" || data.bg_status === "Failed") {
    bgStatus = data.bg_status;
  }

  // 11. References
  var ref1Name = String(data.ref1_name || data.ref1Name || "").trim();
  var ref2Name = String(data.ref2_name || data.ref2Name || "").trim();
  var refNames = [ref1Name, ref2Name].filter(Boolean).join(" | ");
  if (!refNames) refNames = "Local Reference Pending Verification";

  var ref1Phone = String(data.ref1_phone || data.ref1Phone || "").trim();
  var ref2Phone = String(data.ref2_phone || data.ref2Phone || "").trim();
  var refInfos = [ref1Phone, ref2Phone].filter(Boolean).join(" | ");
  if (!refInfos) refInfos = "Pending Reference Contact Info";

  // 12. Admin Reviewer Notes
  var notes = [];
  if (data.guardian_name) notes.push("Guardian: " + data.guardian_name);
  if (data.areas) notes.push("Areas: " + data.areas);
  if (data.classes) notes.push("Classes: " + data.classes);
  if (data.location) notes.push("Location: " + data.location);
  if (data.notes) notes.push("Notes: " + data.notes);
  if (data.agreement_1) notes.push("Anti-Bypass Policy Accepted");
  if (data.agreement_2) notes.push("Background Verification Consent Accepted");
  var adminReviewerNotes = notes.join(" | ");

  // EXACT 37-ELEMENT ARRAY FROM COLUMN B TO COLUMN AL
  return [
    timestamp,            // Col B  (2)  : Submission Timestamp
    appId,                // Col C  (3)  : Application ID
    status,               // Col D  (4)  : Application Status
    firstName,            // Col E  (5)  : First Name
    lastName,             // Col F  (6)  : Last Name
    gender,               // Col G  (7)  : Gender
    dob,                  // Col H  (8)  : Date of Birth
    email,                // Col I  (9)  : Email Address
    phone,                // Col J  (10) : Phone Number
    whatsapp,             // Col K  (11) : WhatsApp Number
    address,              // Col L  (12) : Current Address
    city,                 // Col M  (13) : City
    state,                // Col N  (14) : State
    postalCode,           // Col O  (15) : Postal Code
    country,              // Col P  (16) : Country
    qualification,        // Col Q  (17) : Highest Qualification
    specialization,       // Col R  (18) : Specialization / Major
    institute,            // Col S  (19) : University / Institute
    gradYear,             // Col T  (20) : Graduation Year
    primarySubjects,      // Col U  (21) : Primary Subjects Taught
    secondarySubjects,    // Col V  (22) : Secondary Subjects
    expNum,               // Col W  (23) : Total Years of Experience
    teachingMode,         // Col X  (24) : Preferred Teaching Mode
    hours,                // Col Y  (25) : Available Hours / Week
    rate,                 // Col Z  (26) : Expected Hourly Rate (USD)
    linkedin,             // Col AA (27) : LinkedIn Profile URL
    portfolioUrl,         // Col AB (28) : Portfolio / Resume URL
    govtIdType,           // Col AC (29) : Government ID Type
    govtIdNum,            // Col AD (30) : Government ID Number
    idProofUrl,           // Col AE (31) : ID Proof Document Link
    addressProofUrl,      // Col AF (32) : Address Proof Document Link
    degreeCertUrl,        // Col AG (33) : Degree Certificate Link
    bgStatus,             // Col AH (34) : Background Check Status
    refNames,             // Col AI (35) : Reference Contact Name
    refInfos,             // Col AJ (36) : Reference Contact Info
    adminReviewerNotes,   // Col AK (37) : Admin Reviewer Notes
    timestamp             // Col AL (38) : Last Updated Timestamp
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SHEET NAVIGATION & ROW ALLOCATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getTeacherMasterSheet(ss) {
  if (!ss) return null;
  return ss.getSheetByName(CONFIG.TEACHER_SHEET_NAME) ||
         ss.getSheetByName("Tutor Applications") ||
         ss.getSheetByName("Teachers") ||
         ss.getSheetByName("Tutors") ||
         ss.getSheets()[0];
}

function findHeaderRow(sheet) {
  if (!sheet) return CONFIG.HEADER_ROW;
  var maxScan = Math.min(sheet.getLastRow(), 15);
  for (var r = 1; r <= maxScan; r++) {
    var numCols = Math.max(sheet.getLastColumn(), 1);
    var rowValues = sheet.getRange(r, 1, 1, numCols).getValues()[0];
    for (var c = 0; c < rowValues.length; c++) {
      var val = String(rowValues[c] || "").toLowerCase();
      if (val.includes("submission timestamp") || val.includes("application id") || val.includes("first name")) {
        return r;
      }
    }
  }
  return CONFIG.HEADER_ROW;
}

function getNextAvailableTeacherRow(sheet) {
  var lastRow = sheet.getLastRow();
  
  if (lastRow < CONFIG.FIRST_DATA_ROW) {
    return CONFIG.FIRST_DATA_ROW;
  }

  var totalDataRows = lastRow - CONFIG.FIRST_DATA_ROW + 1;
  var idColumnValues = sheet.getRange(CONFIG.FIRST_DATA_ROW, 3, totalDataRows, 1).getValues();

  for (var i = 0; i < idColumnValues.length; i++) {
    var cellValue = String(idColumnValues[i][0] || "").trim();
    if (!cellValue) {
      return CONFIG.FIRST_DATA_ROW + i;
    }
  }

  return lastRow + 1;
}

function generateNextApplicationId(sheet, headerRowIndex) {
  var currentYear = new Date().getFullYear();
  var lastRow = sheet.getLastRow();
  
  if (lastRow < CONFIG.FIRST_DATA_ROW) {
    return "TCH-" + currentYear + "-001";
  }

  var rowCount = lastRow - CONFIG.FIRST_DATA_ROW + 1;
  var idValues = sheet.getRange(CONFIG.FIRST_DATA_ROW, 3, rowCount, 1).getValues();
  var maxNum = 0;

  for (var j = 0; j < idValues.length; j++) {
    var str = String(idValues[j][0] || "");
    var match = str.match(/TCH-\d+-(\d+)/i);
    if (match) {
      var num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  var nextNum = maxNum + 1;
  var formattedNum = nextNum < 1000 ? ("000" + nextNum).slice(-3) : String(nextNum);
  return "TCH-" + currentYear + "-" + formattedNum;
}

function generateNextStudentId(sheet) {
  var currentYear = new Date().getFullYear();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return "STD-" + currentYear + "-001";
  }

  var idValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  var maxNum = 0;

  for (var j = 0; j < idValues.length; j++) {
    var str = String(idValues[j][0] || "");
    var match = str.match(/STD-\d+-(\d+)/i);
    if (match) {
      var num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  var nextNum = maxNum + 1;
  var formattedNum = nextNum < 1000 ? ("000" + nextNum).slice(-3) : String(nextNum);
  return "STD-" + currentYear + "-" + formattedNum;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DATA SANITIZATION & FORMATTING HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function toProperCase(str) {
  if (!str) return "";
  return String(str)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatInternationalPhone(raw) {
  if (!raw) return "+91-92297-38307";
  var cleaned = String(raw).replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return "+" + cleaned.slice(0, 2) + "-" + cleaned.slice(2, 7) + "-" + cleaned.slice(7);
  }
  if (cleaned.length === 10) {
    return "+91-" + cleaned.slice(0, 5) + "-" + cleaned.slice(5);
  }
  return "+91-" + cleaned;
}

function formatIsoDate(raw) {
  if (!raw) return "2000-01-01";
  var str = String(raw).trim();
  var match = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (match) {
    var y = match[1];
    var m = ("0" + match[2]).slice(-2);
    var d = ("0" + match[3]).slice(-2);
    return y + "-" + m + "-" + d;
  }
  return "2000-01-01";
}

function formatTimestamp(raw) {
  if (raw) {
    var parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      return Utilities.formatDate(parsed, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    }
  }
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
}

function sanitizeDocumentUrl(rawUrl) {
  if (!rawUrl || rawUrl === "Not Uploaded" || rawUrl === "Not provided" || rawUrl === "null") {
    return CONFIG.FALLBACK_PENDING_URL;
  }
  var str = String(rawUrl).trim();
  if (/^https?:\/\//i.test(str)) {
    if (str.indexOf("/storage/v1/object/authenticated/kyc-documents/") !== -1 && str.indexOf("?token=") === -1) {
      var fileName = str.split("/storage/v1/object/authenticated/kyc-documents/")[1].split("?")[0];
      return CONFIG.SUPABASE_STORAGE_URL + encodeURIComponent(fileName);
    }
    return str;
  }
  return CONFIG.SUPABASE_STORAGE_URL + encodeURIComponent(str);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTING & RUNNABLE VERIFICATION UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * TEST RUNNER 1: Simulate Vercel Student Demo Lead POST
 * Click "Run" on this function in Apps Script to verify Student Leads ingestion!
 */
function testDoPostStudent() {
  var simulatedEvent = {
    postData: {
      contents: JSON.stringify({
        formType: "book-demo",
        name: "Vikram Malhotra",
        phone: "9835012345",
        studentClass: "Class 10",
        locality: "Boring Road, Patna",
        address: "Near Panch Shiv Mandir, Boring Road",
        subjects: "Mathematics, Science",
        teacherPreference: "Experienced Male Tutor",
        remarks: "Need immediate demo for board exam preparation.",
        timestamp: new Date().toISOString()
      })
    }
  };

  var res = doPost(simulatedEvent);
  Logger.log("Student Test Result: " + res.getContent());
}

/**
 * TEST RUNNER 2: Simulate Vercel Teacher Application POST
 * Click "Run" on this function in Apps Script to verify Teacher Master Record ingestion!
 */
function testDoPostTeacher() {
  var simulatedEvent = {
    postData: {
      contents: JSON.stringify({
        formType: "join-tutor-wizard",
        name: "Pooja Kumari",
        dob: "1997-04-12",
        gender: "Female",
        guardian_name: "Santosh Kumar",
        whatsapp: "9431098765",
        email: "pooja.kumari@example.com",
        current_address: "Kankarbagh, Near Tempo Stand, Patna",
        city: "Patna",
        state: "Bihar",
        postal_code: "800020",
        qualification: "MSc",
        college: "Patna Science College",
        subjects: "Biology, Chemistry",
        classes: "Class 9-10, NEET",
        experience: "4",
        mode: "Home Visit",
        areas: "Kankarbagh, Rajendra Nagar",
        aadhaar_number: "234567890123",
        ref1_name: "Dr. A. K. Verma",
        ref1_phone: "9876543210",
        timestamp: new Date().toISOString()
      })
    }
  };

  var res = doPost(simulatedEvent);
  Logger.log("Teacher Test Result: " + res.getContent());
}

/**
 * Diagnostic Schema Check
 */
function validateSpreadsheetSchema() {
  var ss = getSpreadsheet();
  var sheet = ss ? getTeacherMasterSheet(ss) : null;
  
  if (!sheet) {
    Logger.log("❌ ERROR: Sheet not found!");
    return;
  }
  
  Logger.log("✅ Sheet Found: " + sheet.getName());
  var headerRow = findHeaderRow(sheet);
  Logger.log("ℹ️ Detected Header Row: " + headerRow + " (Expected: " + CONFIG.HEADER_ROW + ")");
  
  var liveHeaders = sheet.getRange(headerRow, CONFIG.START_COL, 1, CONFIG.TOTAL_COLUMNS).getValues()[0];
  var mismatches = 0;
  
  for (var i = 0; i < HEADERS_B_TO_AL.length; i++) {
    var expected = HEADERS_B_TO_AL[i];
    var actual = String(liveHeaders[i] || "").trim();
    if (actual.toLowerCase() !== expected.toLowerCase()) {
      Logger.log("⚠️ Col " + (i + 2) + ": Expected '" + expected + "', Found '" + actual + "'");
      mismatches++;
    }
  }

  if (mismatches === 0) {
    Logger.log("🎉 ALL 37 HEADERS (B8:AL8) MATCH MASTER SPECIFICATION PERFECTLY!");
  } else {
    Logger.log("⚠️ Found " + mismatches + " column variations.");
  }
}
