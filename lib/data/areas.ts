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
