import { UserRole } from "@/features/user/user.types";

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
  };
}
