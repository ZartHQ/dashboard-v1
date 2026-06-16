export interface JobInfo {
  title: string;
  id: string;
  status?: string;
}

export interface Patron {
  id: number;
  name: string;
  initials: string;
  avBg: string;
  avColor: string;
  preview: string;
  time: string;
  unread: boolean;
  loc: string;
  bookings: number;
  joined: string;
  spent: string;
  activeJob: JobInfo | null;
  pastJobs: JobInfo[];
}

export const PATRONS: Patron[] = [
  { id: 1, name: "John Doe", initials: "JD", avBg: "#e8f5f0", avColor: "#115746", preview: "Thanks for the update!", time: "9:41 AM", unread: true, loc: "Lekki Phase 1", bookings: 8, joined: "March 2025", spent: "₦94,000", activeJob: { title: "Fix leaking sink", id: "ZRT-0042", status: "Pending" }, pastJobs: [{ title: "Toilet flush repair", id: "ZRT-0031" }, { title: "Bathroom tile grouting", id: "ZRT-0024" }] },
  { id: 2, name: "Amaka Obi", initials: "AO", avBg: "#fff3e0", avColor: "#c2410c", preview: "What time will he arrive?", time: "8:50 AM", unread: false, loc: "Ikeja GRA", bookings: 14, joined: "January 2025", spent: "₦142,000", activeJob: { title: "Install ceiling fan", id: "ZRT-0041", status: "Assigned" }, pastJobs: [] },
  { id: 3, name: "Tunde Bello", initials: "TB", avBg: "#FDF4D7", avColor: "#8a6f00", preview: "Job is done, very happy!", time: "Yesterday", unread: false, loc: "Victoria Island", bookings: 5, joined: "February 2025", spent: "₦58,000", activeJob: null, pastJobs: [{ title: "Fix wardrobe door", id: "ZRT-0040" }] },
  { id: 4, name: "Funke Yemi", initials: "FY", avBg: "#f0eaff", avColor: "#5a3d8a", preview: "Okay, I'll wait to hear from you", time: "Yesterday", unread: false, loc: "Surulere", bookings: 2, joined: "March 2025", spent: "₦20,000", activeJob: null, pastJobs: [] },
  { id: 5, name: "Grace Okonkwo", initials: "GO", avBg: "#e8f5e8", avColor: "#166534", preview: "Excellent service, thank you!", time: "2 days ago", unread: false, loc: "Lekki Phase 2", bookings: 6, joined: "January 2025", spent: "₦72,000", activeJob: null, pastJobs: [] },
];

export interface Message {
  from: 'patron' | 'admin';
  text: string;
  time: string;
}

export const INIT_MESSAGES: Message[] = [
  { from: "patron", text: "Hi, I submitted a plumbing request this morning. Just checking if anyone has been assigned yet?", time: "9:30 AM" },
  { from: "admin", text: "Hi John! Yes, we've reviewed your request. We're assigning John Mensah, one of our top-rated plumbers in Lekki. He'll reach out shortly to confirm timing.", time: "9:38 AM" },
  { from: "patron", text: "Thanks for the update! What time should I expect him?", time: "9:41 AM" },
];
