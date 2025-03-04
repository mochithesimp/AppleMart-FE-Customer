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
  stock: number;
  isDeleted: boolean;
  displayIndex: boolean;
  productItemAttributes: ProductItemAttribute[];
}

export interface ProductItemAttribute {
  productItemAttributeID: number;
  productItemID: number;
  attributeID: string;
  description: string;
  value: string;
  isDeleted: boolean;
}

export interface Attribute {
  attributeID: number;
  attributeName: string;
  dataType:string;
  categoryID: number;
  isDeleted: boolean;
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
  productItems: ProductItem[];
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

export interface CartContextType {
  cart: CartProductItem[];
  totals: { [productId: number]: number };
  addToCart: (product: ProductItem) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  removeItems: (productId: number) => void;
}

export interface CartProductItem {
  productItemID: number;
  name: string;
  quantity: number;
  price: number;
  stock: number;
  isDeleted: boolean;
}