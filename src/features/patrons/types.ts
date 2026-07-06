import { JobInfo } from "@/types";
export type { JobInfo };


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

export interface Message {
  from: "patron" | "admin";
  text: string;
  time: string;
}
