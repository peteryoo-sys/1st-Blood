export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: string;
  productId: string;
  userId: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}
