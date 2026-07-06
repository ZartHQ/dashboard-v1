import { ArtisanType, BaseUser } from "./api";

export type VettingStatus = "pending" |
  "under_review" |
  "requires_action" |
  "approved" |
  "rejected" |
  "suspended";

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
  vettingStatus: VettingStatus;
  userId: number;
}
