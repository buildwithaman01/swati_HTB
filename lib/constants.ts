export const CANONICAL_LINKS = {
  gbp: "https://www.google.com/search?q=Swati+Home+Tuition+Bureau+&sca_esv=575abdecf4205f8a&sxsrf=AKL5yDhNaEEM8s9y_SmlRJtwopxL1FEWnA%3A1793971956648&ei=9NbtapqDJ52rhvcPxOmq4QI&biw=1536&bih=730&uact=5&oq=Swati+Home+Tuition+Bureau+&gs_lp=Egxnd3Mtd2l6LXNlcnAiGlN3YXRpIEhvbWUgVHVpdGlvbiBCdXJlYXUgMgQQIxgnMgIQJjIFEAAY7wUyCBAAGIAEGKIEMgUQABjvBTIFEAAY7wUyBRAAGO8FSIMKUIIFWIIFcAF4AJABAJgBiQKgAYkCqgEDMi0xuAEDyAEA-AEBmAIBoAKbApgDAIgGAZIHAzItMaAH5gWyBwMyLTG4B5sCwgcDMy0xyAcNgAgB&sclient=gws-wiz-serp#lrd=0x39ed59e07382387b:0x109f6cbb49d42d58,3,,,,",
  googleReviews: "https://www.google.com/search?q=Swati+Home+Tuition+Bureau+&sca_esv=575abdecf4205f8a&sxsrf=AKL5yDhNaEEM8s9y_SmlRJtwopxL1FEWnA%3A1793971956648&ei=9NbtapqDJ52rhvcPxOmq4QI&biw=1536&bih=730&uact=5&oq=Swati+Home+Tuition+Bureau+&gs_lp=Egxnd3Mtd2l6LXNlcnAiGlN3YXRpIEhvbWUgVHVpdGlvbiBCdXJlYXUgMgQQIxgnMgIQJjIFEAAY7wUyCBAAGIAEGKIEMgUQABjvBTIFEAAY7wUyBRAAGO8FSIMKUIIFWIIFcAF4AJABAJgBiQKgAYkCqgEDMi0xuAEDyAEA-AEBmAIBoAKbApgDAIgGAZIHAzItMaAH5gWyBwMyLTG4B5sCwgcDMy0xyAcNgAgB&sclient=gws-wiz-serp#lrd=0x39ed59e07382387b:0x109f6cbb49d42d58,3,,,,",
  instagram: "https://www.instagram.com/swati.htb/",
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
  instagramHandle: "@swati.htb",
  facebookName: "Swati Home Tuition Bureau",
  address: "Block A, Area B, 3rd Floor, Banke Bihari Kunj, Mithapur, Patna, Bihar 800001",
} as const;
