export type ProductStatus = 'recruiting' | 'in_progress' | 'completed';

export interface Product {
  id: string;
  title: string;
  description: string;
  status: ProductStatus;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
