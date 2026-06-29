export interface Request {
  id: string;
  title: string;
  cat: string;
  catKey: string;
  patron: string;
  loc: string;
  time: string;
  status: string;
}

export const REQUESTS: Request[] = [
  { id: "ZRT-0042", title: "Fix leaking sink in kitchen", cat: "Plumbing", catKey: "plumb", patron: "John Doe", loc: "Lekki Phase 1", time: "9:30 AM · Today", status: "pending" },
  { id: "ZRT-0041", title: "Install ceiling fan — 2 rooms", cat: "Electrical", catKey: "elec", patron: "Amaka Obi", loc: "Ikeja GRA", time: "8:15 AM · Today", status: "assigned" },
  { id: "ZRT-0040", title: "Fix wardrobe door hinge", cat: "Carpentry", catKey: "carp", patron: "Tunde Bello", loc: "Victoria Island", time: "Yesterday", status: "progress" },
  { id: "ZRT-0039", title: "Repaint living room walls", cat: "Painting", catKey: "paint", patron: "Funke Yemi", loc: "Surulere", time: "Yesterday", status: "pending" },
  { id: "ZRT-0038", title: "AC not cooling — servicing needed", cat: "AC repair", catKey: "ac", patron: "Kunle Adeyemi", loc: "Ajah", time: "2 days ago", status: "progress" },
  { id: "ZRT-0037", title: "Deep clean 3 bedroom flat", cat: "Cleaning", catKey: "clean", patron: "Grace Okonkwo", loc: "Lekki Phase 2", time: "2 days ago", status: "done" },
];

export const STATUS_LABELS: Record<string, string> = { pending: "Pending", assigned: "Assigned", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" };

export interface Note {
  text: string;
  by: string;
  time: string;
}
