import { api } from "@/lib/api";
import { Category, TopArtisan } from "@/types";

export interface ReportSummary {
  jobsCompleted: number;
  newPatrons: number;
  revenueInvoiced: number;
  completionRate: number; // percentage, e.g. 90
}

export interface PlatformHealth {
  avgResponseTime: string;
  avgJobDuration: string;
  patronRepeatRate: string;
  disputeRate: string;
}

export interface ReportsData {
  summary: ReportSummary;
  categories: Category[];
  topArtisans: TopArtisan[];
  platformHealth: PlatformHealth;
}

export const reportsApi = {
  getReports: async (): Promise<ReportsData> => {
    // Confirm the route with the backend if it differs.
    const response = await api.get("/admin/reports");
    return response.data.data;
  },
};
