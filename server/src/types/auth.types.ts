export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  roleId: string; // ID from either Admin or Judge collection
  entityId?: string;
}
export enum UserRole {
  ADMIN = 'admin',
  JUDGE = 'judge'
}
export type UserRoles = 'admin' | 'judge';
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

