// models/product.model.ts
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  weight: number;
  warrantyInformation: string;
  shippingInformation: string;
  dimensions: {
    height: number;
    width: number;
    depth: number;
  };
  tags: string[];
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
