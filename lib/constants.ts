export const CANONICAL_LINKS = {
  gbp: "https://share.google/tarSWReEvLi7cim5V",
  googleReviews: "https://share.google/tarSWReEvLi7cim5V",
  instagram: "https://www.instagram.com/swati.htb",
  facebook: "https://www.facebook.com/profile.php?id=61593236635791",
  whatsapp: "https://wa.me/919229738307",
  whatsappWithText: (text: string) => `https://wa.me/919229738307?text=${encodeURIComponent(text)}`,
  phone: "+919229738307",
  displayPhone: "+91 92297 38307",
  email: "swatihometuitionbureau@gmail.com",
} as const;

export const BUREAU_INFO = {
  name: "Swati Home Tuition Bureau",
  shortName: "Swati HTB",
  location: "Patna, Bihar",
  rating: "4.9",
  ratingStars: 5,
  reviewCountDisplay: "500+ Verified Parents",
  instagramHandle: "@swati.htb",
  facebookName: "Swati Home Tuition Bureau",
  address: "Block A, Area B, 3rd Floor, Banke Bihari Kunj, Mithapur, Patna, Bihar 800001",
} as const;
