export interface e {
  $id: string;
  $values: aProduct[];
}

export interface aProduct {
  productID: number;
  categoryID: number;
  name: string;
  description: string;
  isDeleted: boolean;
  displayIndex: boolean;
}

export interface ProductItem {
  productItemId: number;
  productId: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  isDeleted: boolean;
  displayIndex: boolean;
}

export interface iCategory {
  CategoryID: number;
  name: string;
  description: string;
  isDeleted: boolean;
  displayIndex: boolean;
  
}

export interface ImageProduct {
  imageId: number;
  productId: number;
  imageUrl: string;
}

export interface ShopContextType {
  allProduct: aProduct[];
}