export interface Artisan {
  id: number;
  name: string;
  initials: string;
  type: string;
  loc: string;
  phone: string;
  status: 'online' | 'busy' | 'offline' | 'suspended';
  vetted: boolean;
  jobs: number;
  rating: number | null;
  completion: number | null;
  skills: string[];
  avBg: string;
  avColor: string;
  warning?: string;
}

export const ARTISANS: Artisan[] = [
  { id: 1, name: "John Mensah", initials: "JM", type: "Plumber", loc: "Lekki", phone: "0801 XXX XXXX", status: "online", vetted: true, jobs: 57, rating: 4.9, completion: 98, skills: ["Pipe fitting", "Sink repair", "Drainage", "Water heater"], avBg: "#e8f5f0", avColor: "#115746" },
  { id: 2, name: "Akin Kolade", initials: "AK", type: "Electrician", loc: "Victoria Island", phone: "0802 XXX XXXX", status: "online", vetted: true, jobs: 44, rating: 4.8, completion: 95, skills: ["Wiring", "Fan install", "Fuse board", "Inverter"], avBg: "#fff3e0", avColor: "#c2410c" },
  { id: 3, name: "Chidi Bosah", initials: "CB", type: "Carpenter", loc: "Ikeja", phone: "0809 XXX XXXX", status: "busy", vetted: true, jobs: 39, rating: 4.7, completion: 92, skills: ["Furniture", "Door fitting", "Wardrobes"], avBg: "#FDF4D7", avColor: "#8a6f00" },
  { id: 4, name: "Emeka Eze", initials: "EE", type: "Electrician", loc: "Surulere", phone: "0805 XXX XXXX", status: "suspended", vetted: true, jobs: 11, rating: 3.1, completion: 70, skills: ["Wiring"], avBg: "#ffe8e8", avColor: "#c41c1c" },
  { id: 5, name: "Fatima Yusuf", initials: "FY", type: "Plumber", loc: "Ajah", phone: "0807 XXX XXXX", status: "offline", vetted: false, jobs: 0, rating: null, completion: null, skills: [], warning: "Pending vetting — skills test outstanding", avBg: "#f5f5f5", avColor: "#888" },
];

export const STATUS_PILL: Record<string, { label: string; cls: string }> = {
  online: { label: "Online", cls: "sp-online" },
  busy: { label: "On a job", cls: "sp-busy" },
  offline: { label: "Offline", cls: "sp-offline" },
  suspended: { label: "Suspended", cls: "sp-suspended" },
};
