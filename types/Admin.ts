import { Profile } from './Profile';

export type UserRequestStatus = 'approved' | 'pending' | 'rejected';

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  reg_no: number;
  email: string;
  course: string;
  type: string;
  request_status: UserRequestStatus;
  phone: number;
  dob: string;
  details: string;
  category: string;
}

export interface UserStatistics {
  studentCount: number;
  expertCount: number;
  peerCount: number;
  totalCount: number;
}
