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
  productItems?: ProductItem[];
}

export interface ProductImg {
  productImgID: number;
  productItemID: number;
  imageUrl: string;
  isDeleted: boolean;
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
  productImgs: ProductImg[];
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
  dataType: string;
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

export interface User {
  id: number;
  chatRoomID: number;
  userID: string;
  userName: string;
  isAdmin: boolean;
  createdDate: string;
  isOnline: boolean;
}

export interface Iuser {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  avatar: string;
  role: string;
}

export interface Message {
  chatID: number;
  chatRoomID: number;
  senderID: string;
  senderName: string;
  content: string;
  isRead: boolean;
  createdDate: string;
}

export interface ChatRoom {
  chatRoomID: number;
  roomName: string;
  isGroup: boolean;
  createdDate: string;
  messages: Message[] | { $values: Message[] };
  participants?: User[] | { $values: User[] };
  lastMessage?: Message;
}

export interface StyledProps {
  isOnline?: boolean;
  active?: boolean;
  isMine?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export interface ApiResponse<T> {
  $values?: T[];
  [key: string]: unknown;
}

export function unwrapValues<T>(data: T[] | { $values: T[] } | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.$values || [];
}

export interface aOrder {
  orderID: number;
  userID: string;
  shipperID: number;
  orderDate: string;
  address: string;
  paymentMethod: string;
  shippingMethodId: number;
  total: number;
  orderStatus: string;
  voucherID: number;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  orderDetailID: number;
  orderID: number;
  productItemID: number;
  quantity: number;
  price: number;
}

export interface bBlogs{
  blogID: number;
  title: string;
  content: string;
  author: string;
  productId: string;
  uploadDate: string;
  updateDate: string;
  view: number;
  like: number;
  isDeleted: boolean;
  blogImages: BlogImages;
}

interface BlogImages {
  $values: BlogImage[];
}

interface BlogImage {
  blogImageID: number;
  imageUrl: string;
  blogId: number;
}
export interface BlogsCardProps {
  limit?: number;
}