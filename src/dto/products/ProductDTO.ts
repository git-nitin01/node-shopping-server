export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  categoryId?: string;
  category: string;
  isPopular: boolean;
  sizes: Array<{
    size: string;
    price: number;
    images: string[];
    inStock: boolean;
    isPopular: boolean;
    subTitle?: string;
    discountPercentage?: number;
  }>;
  averageRating?: number;
  ratingCount?: number;
}
export interface ProductInputDTO {
  name: string;
  description: string;
  categoryId: string;
  category: string;
  isPopular?: boolean;
  sizes: Array<{
    size: string;
    price: number;
    images: string[];
    inStock: boolean;
    isPopular?: boolean;
    subTitle?: string;
    discountPercentage?: number;
  }>;
  averageRating?: number;
  ratingCount?: number;
}
