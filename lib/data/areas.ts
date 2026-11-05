// A comprehensive list of unique localities in Patna for Programmatic SEO

const rawPatnaAreas = [
  "Boring Road", "Kankarbagh", "Patliputra", "Rajendra Nagar", "Bailey Road",
  "Frazer Road", "Dak Bungalow", "Ashiana Nagar", "Phulwari Sharif", "Danapur",
  "Gandhi Maidan", "Anisabad", "Kurji", "SK Puri", "Gola Road", "Rukanpura",
  "Khajpura", "Rajbansi Nagar", "Digha", "Kumhrar", "Agam Kuan", "Makhdumpur",
  "Bihta", "Maner", "Saguna More", "Ramkrishna Nagar", "Bhootnath Road",
  "Mithapur", "Jakkanpur", "Gardanibagh", "Yarpur", "Chitkohra",
  "Khagaul", "Danapur Cantt", "Shastri Nagar", "Kidwaipuri", "Buddha Colony",
  "Lodipur", "Mandar", "Kurthal", "Sipara", "Bhogipur", "Bazaar Samiti", "Mahendru",
  "Sultanganj", "Gulzarbagh", "Patna City", "Chowk", "Malsalami", "Begumpur",
  "Pahari", "Fatuha", "Bakhtiyarpur", "Barh", "Mokama", "Neora", "Hajipur",
  "Sonepur", "Dighwara", "Naubatpur", "Bikram", "Paliganj",
  "Dulhin Bazar", "Masaurhi", "Dhanarua", "Punpun", "Sampatchak",
  "Khusrupur", "Daniiyawan", "Athmalgola", "Belchhi", "Pandarak", "Ghoswari",
  "Ashok Rajpath", "Exhibition Road", "Rajeev Nagar", "Indrapuri", "Patel Nagar",
  "Sheikhpura", "Samanpura", "Raja Bazar", "Jagdeo Path", "Anandpuri", "Bypass Road",
  "Chhajjubagh", "Hanuman Nagar", "Kadamkuan", "Lohanipur", "Machhua Toli",
  "Srikrishna Nagar"
];

// Deduplicated list of 80+ key localities in Patna
export const patnaAreas = Array.from(new Set(rawPatnaAreas));

// Helper to format the area name for URLs (e.g. "Boring Road" -> "boring-road")
export function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Helper to get area from slug
export function unslugify(slug: string) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface AreaDetail {
  name: string;
  zone: string;
  landmarks: string[];
  topSchools: string[];
  popularSubjects: string[];
  searchQueries: string[];
  feeRange: string;
  tutorCount: string;
}

// Specific detailed enrichment for key Patna hubs
const areaSpecifics: Record<string, Partial<AreaDetail>> = {
  "Boring Road": {
    zone: "West Central Zone",
    landmarks: ["Boring Road Chauraha", "AN College", "Alankar Place", "SK Puri Park", "Pani Tanki"],
    topSchools: ["St. Michael's High School", "Loyola High School", "Notre Dame Academy", "Mount Carmel"],
    popularSubjects: ["Class 10 CBSE Maths", "Class 11-12 Physics", "IIT-JEE Advanced", "Class 1-8 All Subjects"],
    searchQueries: [
      "Best home tutor in Boring Road Patna",
      "Female home tutor near AN College",
      "CBSE class 10 tuition teacher Boring Road",
      "IIT JEE physics tutor Boring Canal Road"
    ],
    feeRange: "₹3,500 – ₹8,500/month",
    tutorCount: "35+ Verified Tutors"
  },
  "Kankarbagh": {
    zone: "South Patna Zone",
    landmarks: ["Tiwaribechar More", "Shivaji Park", "Doctors Colony", "Malahi Pakri", "Tempo Stand"],
    topSchools: ["DPS Patna", "St. Severin's", "DAV Public School", "Kendriya Vidyalaya Kankarbagh"],
    popularSubjects: ["NEET Biology & Chemistry", "Class 9-10 Science & Maths", "Class 11-12 Board Exam", "Class 1-8"],
    searchQueries: [
      "Home tuition in Kankarbagh Patna",
      "Female tutor near Shivaji Park Kankarbagh",
      "NEET biology tutor in Doctors Colony",
      "Class 10 CBSE maths tutor Kankarbagh"
    ],
    feeRange: "₹3,000 – ₹7,500/month",
    tutorCount: "40+ Verified Tutors"
  },
  "Patliputra": {
    zone: "North West Zone",
    landmarks: ["Patliputra Golamber", "Alpana Market", "P&M Mall", "Kurji Holy Family Hospital", "Polytechnic More"],
    topSchools: ["Notre Dame Academy", "St. Michael's High School", "Don Bosco Academy", "Hartmann Girls High School"],
    popularSubjects: ["ICSE English & Science", "Class 11-12 Physics & Maths", "Class 9-10 CBSE", "Junior Foundation"],
    searchQueries: [
      "Home tutors in Patliputra Colony Patna",
      "Lady tutor near Notre Dame Academy",
      "ICSE class 10 private tutor Patliputra",
      "Physics teacher near P&M Mall"
    ],
    feeRange: "₹4,000 – ₹9,000/month",
    tutorCount: "30+ Verified Tutors"
  },
  "Bailey Road": {
    zone: "West Patna Growth Corridor",
    landmarks: ["Raja Bazar", "Jagdeo Path", "Saguna More", "Paras HMRI Hospital", "Rukanpura Flyover"],
    topSchools: ["DPS Patna", "G.D. Goenka Public School", "St. Karen's High School", "Open Minds A Birla School"],
    popularSubjects: ["Class 9-10 Maths & Science", "NEET Medical", "JEE Main", "Class 1-8 All Subjects"],
    searchQueries: [
      "Home tuition in Bailey Road Patna",
      "Verified home tutor near Jagdeo Path",
      "Class 10 CBSE science tutor Saguna More",
      "Lady teacher for girls Raja Bazar"
    ],
    feeRange: "₹3,500 – ₹8,000/month",
    tutorCount: "45+ Verified Tutors"
  },
  "Rajendra Nagar": {
    zone: "Central East Zone",
    landmarks: ["Moin-ul-Haq Stadium", "Rajendra Nagar Terminal", "Premchand Rangshala", "Machhua Toli Road"],
    topSchools: ["St. Paul's High School", "BD Public School", "Patna Collegiate", "DAV Public School"],
    popularSubjects: ["Commerce 11-12 (Accounts/Eco)", "Class 10 Board Maths", "Class 1-8 Foundation", "Chemistry"],
    searchQueries: [
      "Home tutor in Rajendra Nagar Patna",
      "Commerce accounts home tutor Rajendra Nagar",
      "Class 10 board exam tuition near Stadium",
      "Female home tutor Rajendra Nagar"
    ],
    feeRange: "₹3,000 – ₹7,000/month",
    tutorCount: "25+ Verified Tutors"
  },
  "Ashiana Nagar": {
    zone: "West Residential Zone",
    landmarks: ["Ashiana More", "Ram Nagari", "Passport Seva Kendra", "MP Birla Colony", "Digha-AIIMS Canal Road"],
    topSchools: ["St. Karen's Secondary School", "DAV BSEB Colony", "DPS World School", "Loyola High School"],
    popularSubjects: ["Class 10 CBSE Maths", "Class 11-12 Science", "NEET Biology", "Junior Foundation"],
    searchQueries: [
      "Best home tutor in Ashiana Nagar Patna",
      "Female home tutor Ram Nagari Ashiana",
      "CBSE class 10 tutor Ashiana More",
      "Science maths home tuition Ashiana"
    ],
    feeRange: "₹3,500 – ₹7,500/month",
    tutorCount: "30+ Verified Tutors"
  }
};

// Generates rich, contextual metadata for any area in Patna
export function getAreaDetails(areaName: string): AreaDetail {
  const custom = areaSpecifics[areaName];
  if (custom) {
    return {
      name: areaName,
      zone: custom.zone || "Patna Capital Region",
      landmarks: custom.landmarks || [`${areaName} Main Market`, `${areaName} Chauraha`],
      topSchools: custom.topSchools || ["St. Michael's High School", "DPS Patna", "Loyola High School", "Notre Dame Academy"],
      popularSubjects: custom.popularSubjects || ["Class 10 CBSE Maths", "Class 9-10 Science", "Class 11-12 Physics", "Class 1-8 All Subjects"],
      searchQueries: custom.searchQueries || [
        `Home tutor in ${areaName} Patna`,
        `Female home tuition teacher ${areaName}`,
        `Class 10 CBSE maths tutor ${areaName}`,
        `Best home tuition bureau near ${areaName}`
      ],
      feeRange: custom.feeRange || "₹3,000 – ₹7,500/month",
      tutorCount: custom.tutorCount || "20+ Verified Tutors"
    };
  }

  // Fallback programmatic generation for other localities
  return {
    name: areaName,
    zone: "Patna Metropolitan Area",
    landmarks: [`${areaName} Chowk`, `${areaName} Main Road`, `${areaName} Colony`],
    topSchools: ["St. Michael's High School", "DPS Patna", "Loyola High School", "Notre Dame Academy"],
    popularSubjects: ["Class 10 CBSE Maths", "Class 9-10 Science", "Class 11-12 Physics/Chemistry", "Class 1-8 All Subjects"],
    searchQueries: [
      `Home tutor in ${areaName} Patna`,
      `Female home tuition in ${areaName}`,
      `Class 10 CBSE maths tutor ${areaName}`,
      `Science tutor for school students in ${areaName}`
    ],
    feeRange: "₹2,500 – ₹7,000/month",
    tutorCount: "15+ Verified Tutors"
  };
}
