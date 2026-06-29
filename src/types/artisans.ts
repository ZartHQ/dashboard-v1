import { ArtisanType, BaseUser } from "./api";

export interface Artisan {
  id: number;
  artisanType: ArtisanType;
  jobsDone: number;
  artisanTypeId: number;
  createdAt: string;
  operatingArea: string[];
  rating?: number;
  skills: string[];
  user: BaseUser;
  vettingStatus: "pending" | "suspended" | "verified";
  userId: number;
}
