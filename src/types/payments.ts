export interface Payment {
  id: string;
  job: string;
  patron: string;
  artisan: string;
  amount: number;
  fee: number | null;
  status: "paid" | "pending" | "disputed" | "invoiced" | "refunded";
  date: string;
}
