export const CANONICAL_LINKS = {
  gbp: "https://share.google/tarSWReEvLi7cim5V",
  googleReviews: "https://share.google/tarSWReEvLi7cim5V",
  instagram: "https://www.instagram.com/swati_home_tuition/",
  facebook: "https://www.facebook.com/profile.php?id=61593236635791",
  whatsapp: "https://wa.me/917549097748",
  whatsappWithText: (text: string) => `https://wa.me/917549097748?text=${encodeURIComponent(text)}`,
  phone: "+917549097748",
  displayPhone: "+91 75490 97748",
  backupPhone: "+91 92297 38307",
  email: "swatihometuitionbureau@gmail.com",
} as const;

export const BUREAU_INFO = {
  name: "Swati Home Tuition Bureau",
  shortName: "Swati HTB",
  location: "Patna, Bihar",
  rating: "4.9",
  ratingStars: 5,
  reviewCountDisplay: "500+ Verified Parents",
  instagramHandle: "@swati_home_tuition",
  facebookName: "Swati Home Tuition Bureau",
  address: "Block A, Area B, 3rd Floor, Banke Bihari Kunj, Mithapur, Patna, Bihar 800001",
} as const;
