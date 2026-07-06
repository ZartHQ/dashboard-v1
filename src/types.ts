// --- SHARED TYPES ---

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface Role {
  id: number;
  name: string;
}

export interface BaseUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  roles: Role[];
  phone?: string | null;
  image?: string | null;
  homeAddress?: string | null;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface Media {
  id: number;
  mediaUrl: string;
  mediaType: MediaType;
  createdAt: string;
}


// --- AUTH TYPES ---

export interface AuthUser extends BaseUser { }

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export type LoginResponse = ApiResponse<LoginData>;


// --- USER / PROFILE TYPES ---

export interface AdminProfile extends BaseUser {
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export type AdminProfileResponse = ApiResponse<AdminProfile>;


// --- SERVICE REQUEST TYPES ---

export type ServiceRequestStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface ArtisanType {
  id: number;
  name: string;
  description?: string | null;
}

export interface Patron extends BaseUser { }

export interface ArtisanUser extends BaseUser {
  artisanType?: ArtisanType | null;
  rating?: number | null;
}

export interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  artisanType: ArtisanType;
  patron: Patron;
  artisan: ArtisanUser | null;
  media: Media[];
  createdAt: string;
  updatedAt: string;
  refrenceId: string;
  patronId: number;
  artisanTypeId: number;
  artisanId: number;
  address: string;
}

export interface ServiceRequestNote {
  id: number;
  admin: AdminProfile
  note: string;
  adminId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestDetail extends ServiceRequest {
  notes: ServiceRequestNote[];
}

export type ServiceRequestListResponse = PaginatedApiResponse<ServiceRequest>;

export type ServiceRequestDetailResponse = ApiResponse<ServiceRequestDetail>;

export interface UpdateArtisanVettingStatusRequest {
  vettingStatus: VettingStatus;
  note?: string;
}

// --- ADDITIONAL API & DB TYPES ---

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

export interface JobInfo {
  title: string;
  id: string;
  status?: string;
}

export interface DbPatron {
  id: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  initials?: string;
  phone?: string | null;
  createdAt?: string;
  totalSpent?: number;
  bookingsCount?: number;
  preview?: string;
  time?: string;
  unread?: boolean;
  activeJob?: JobInfo | null;
  pastJobs?: JobInfo[];
  avBg?: string;
  avColor?: string;
  loc?: string;
  bookings?: number;
  joined?: string;
  spent?: string;
}

export interface FlagPerson {
  initials: string;
  bg: string;
  color: string;
  name: string;
}

export interface Flag {
  id: number;
  title: string;
  sub: string;
  priority: "high" | "medium" | "low";
  status: string;
  time: string;
  desc: string;
  artisan: FlagPerson;
  patron: FlagPerson;
  actions: string[];
}

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

export interface Category {
  label: string;
  pct: number;
  jobs: number;
  color: string;
}

export interface TopArtisan {
  rank: number;
  initials: string;
  bg: string;
  color: string;
  name: string;
  type: string;
  jobs: number;
  rating: number;
}
