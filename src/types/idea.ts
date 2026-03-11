export type IdeaStatus = 'reviewing' | 'approved' | 'rejected';

export interface Idea {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: IdeaStatus;
  recommendCount: number;
  createdAt: string;
  updatedAt: string;
}
