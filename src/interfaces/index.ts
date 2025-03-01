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
  productItems?: ProductItem[]
}

export interface ProductItem {
  productItemID: number;
  productID: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  isDeleted: boolean;
  displayIndex: boolean;
}

export interface iCategory {
  categoryID: number;
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
  product: aProduct[];
  filterProduct: aProduct[];
  selectedProduct: boolean | null;
  selectedFilter: boolean | null;
  setProduct: React.Dispatch<React.SetStateAction<aProduct[]>>;
  setAllProduct: React.Dispatch<React.SetStateAction<aProduct[]>>;
  setFilterProduct: React.Dispatch<React.SetStateAction<aProduct[]>>;
  setSelectedFilter: React.Dispatch<React.SetStateAction<boolean | null>>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<boolean | null>>;
}
