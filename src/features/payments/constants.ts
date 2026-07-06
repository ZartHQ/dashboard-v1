import { Payment } from "@/types";

export const PAYMENTS: Payment[] = [
  { id: "ZRT-0042", job: "Fix leaking sink", patron: "John Doe", artisan: "John Mensah", amount: 15000, fee: 1200, status: "invoiced", date: "Today" },
  { id: "ZRT-0041", job: "Install ceiling fan", patron: "Amaka Obi", artisan: "Akin Kolade", amount: 35000, fee: 2800, status: "disputed", date: "Yesterday" },
  { id: "ZRT-0040", job: "Fix wardrobe door", patron: "Tunde Bello", artisan: "Chidi Bosah", amount: 22000, fee: 1760, status: "paid", date: "2 days ago" },
  { id: "ZRT-0039", job: "Toilet flush repair", patron: "Fatima Yusuf", artisan: "John Mensah", amount: 8000, fee: 640, status: "pending", date: "3 days ago" },
  { id: "ZRT-0038", job: "Wiring issue", patron: "Grace Okonkwo", artisan: "Emeka Eze", amount: 25000, fee: null, status: "refunded", date: "4 days ago" },
];

export const BADGE: Record<string, { label: string; cls: string }> = {
  paid:     { label: "Paid",         cls: "badge-paid" },
  pending:  { label: "Pending",      cls: "badge-pending" },
  disputed: { label: "Disputed",     cls: "badge-disputed" },
  invoiced: { label: "Invoice sent", cls: "badge-invoiced" },
  refunded: { label: "Refunded",     cls: "badge-refunded" },
};
