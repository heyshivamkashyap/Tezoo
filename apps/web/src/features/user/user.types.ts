export type UserRole =
  | "customer"
  | "admin"
  | "store_manager"
  | "support"
  | "delevery_partner";

export type UserStatus = "pending" | "active" | "blocked" | "deleted";

export interface User {
  _id: string;

  fullName: string;
  email: string;
  phone?: string;

  roles: UserRole[];
  status: UserStatus;

  profileImage?: {
    url: string;
    publicId: string;
  } | null;

  defaultAddress?: string | null;

  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;

  createdAt: string;
}
