import { JobInfo, Patron, Message } from "@/features/patrons/types";

export const PATRONS: Patron[] = [
  { id: 1, name: "John Doe", initials: "JD", avBg: "#e8f5f0", avColor: "#115746", preview: "Thanks for the update!", time: "9:41 AM", unread: true, loc: "Lekki Phase 1", bookings: 8, joined: "March 2025", spent: "₦94,000", activeJob: { title: "Fix leaking sink", id: "ZRT-0042", status: "Pending" }, pastJobs: [{ title: "Toilet flush repair", id: "ZRT-0031" }, { title: "Bathroom tile grouting", id: "ZRT-0024" }] },
  { id: 2, name: "Amaka Obi", initials: "AO", avBg: "#fff3e0", avColor: "#c2410c", preview: "What time will he arrive?", time: "8:50 AM", unread: false, loc: "Ikeja GRA", bookings: 14, joined: "January 2025", spent: "₦142,000", activeJob: { title: "Install ceiling fan", id: "ZRT-0041", status: "Assigned" }, pastJobs: [] },
  { id: 3, name: "Tunde Bello", initials: "TB", avBg: "#FDF4D7", avColor: "#8a6f00", preview: "Job is done, very happy!", time: "Yesterday", unread: false, loc: "Victoria Island", bookings: 5, joined: "February 2025", spent: "₦58,000", activeJob: null, pastJobs: [{ title: "Fix wardrobe door", id: "ZRT-0040" }] },
  { id: 4, name: "Funke Yemi", initials: "FY", avBg: "#f0eaff", avColor: "#5a3d8a", preview: "Okay, I'll wait to hear from you", time: "Yesterday", unread: false, loc: "Surulere", bookings: 2, joined: "March 2025", spent: "₦20,000", activeJob: null, pastJobs: [] },
  { id: 5, name: "Grace Okonkwo", initials: "GO", avBg: "#e8f5e8", avColor: "#166534", preview: "Excellent service, thank you!", time: "2 days ago", unread: false, loc: "Lekki Phase 2", bookings: 6, joined: "January 2025", spent: "₦72,000", activeJob: null, pastJobs: [] },
];



export const MOCK_PATRON_CHATS: Record<number, Message[]> = {
  1: [
    { from: "patron", text: "Hi, I submitted a plumbing request this morning. Just checking if anyone has been assigned yet?", time: "9:30 AM" },
    { from: "admin", text: "Hi John! Yes, we've reviewed your request. We're assigning John Mensah, one of our top-rated plumbers in Lekki. He'll reach out shortly to confirm timing.", time: "9:38 AM" },
    { from: "patron", text: "Thanks for the update!", time: "9:41 AM" },
  ],
  2: [
    { from: "patron", text: "Hello, my ceiling fan is making a strange noise and needs to be replaced. I requested an electrician.", time: "8:30 AM" },
    { from: "admin", text: "Hello Amaka. We have assigned Nkechi Kalu to your request. She is highly rated for electrical work.", time: "8:45 AM" },
    { from: "patron", text: "What time will he arrive?", time: "8:50 AM" },
  ],
  3: [
    { from: "patron", text: "Hi, the wardrobe door in my room won't close properly. Do you have a carpenter?", time: "Yesterday 2:00 PM" },
    { from: "admin", text: "Hello Tunde, yes we do! Chidi Bosah will be with you shortly.", time: "Yesterday 2:15 PM" },
    { from: "patron", text: "Job is done, very happy!", time: "Yesterday 3:30 PM" },
  ],
  4: [
    { from: "patron", text: "Hi, I need painting services for my new office space in Surulere.", time: "Yesterday 4:00 PM" },
    { from: "admin", text: "Hi Funke, we're currently sourcing the best painters in your area. We'll update you soon.", time: "Yesterday 4:30 PM" },
    { from: "patron", text: "Okay, I'll wait to hear from you", time: "Yesterday 4:35 PM" },
  ],
  5: [
    { from: "patron", text: "Hello, I need deep cleaning for my 3-bedroom apartment.", time: "2 days ago" },
    { from: "admin", text: "Hi Grace, a cleaner has been assigned and is on their way.", time: "2 days ago" },
    { from: "patron", text: "Excellent service, thank you!", time: "2 days ago" },
  ],
};
