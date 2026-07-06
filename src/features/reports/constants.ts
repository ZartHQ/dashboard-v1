import { Category, TopArtisan } from "@/types";

export const CATEGORIES: Category[] = [
  { label: "Plumbing",   pct: 72, jobs: 42, color: "#115746" },
  { label: "Electrical", pct: 55, jobs: 32, color: "#FA4812" },
  { label: "Carpentry",  pct: 36, jobs: 21, color: "#FFC92A" },
  { label: "Painting",   pct: 22, jobs: 13, color: "#7D76B2" },
  { label: "AC repair",  pct: 17, jobs: 10, color: "#BCDEF3" },
  { label: "Cleaning",   pct: 17, jobs: 10, color: "#EDB4CA" },
];



export const TOP_ARTISANS: TopArtisan[] = [
  { rank: 1, initials: "JM", bg: "#e8f5f0", color: "#115746", name: "John Mensah", type: "Plumber · Lekki", jobs: 12, rating: 4.9 },
  { rank: 2, initials: "AK", bg: "#fff3e0", color: "#c2410c", name: "Akin Kolade", type: "Electrician · VI", jobs: 9, rating: 4.8 },
  { rank: 3, initials: "CB", bg: "#FDF4D7", color: "#8a6f00", name: "Chidi Bosah", type: "Carpenter · Ikeja", jobs: 7, rating: 4.7 },
  { rank: 4, initials: "NK", bg: "#f0eaff", color: "#5a3d8a", name: "Nkechi Kalu", type: "Electrician · Ajah", jobs: 6, rating: 4.6 },
];
