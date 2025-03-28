import * as request from "../../utils/request";

// Define types for product ratings and reviews
type Review = {
  reviewID: number;
  userID: string;
  userName: string;
  productItemID: number;
  productRating: number | null;
  productComment?: string;
  date: string;
};

type ProductRating = {
  productItemID: number;
  productName: string;
  averageRating: number;
  totalReviewers: number;
  reviews: Review[] | { $values: Review[] };
};

export const getProductItems = async () => {
  try {
    const res = await request.get(`ProductItem`);
    return res;
  } catch {
    return []; // Trả về mảng rỗng nếu lỗi
  }
};

export const search = async (queryParams: URLSearchParams) => {
  try {
    const res = await request.get("ProductItem", { params: queryParams });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getProductItemId = async (productItemId: number) => {
  try {
    const res = await request.get(`ProductItem/${productItemId}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getProductRatings = async () => {
  try {
    const res = await request.get("Review/products/summary");

    // Process the response to handle the nested structure and filter reviews
    if (res && res.$values) {
      // First handle the top-level $values array
      const products = res.$values as ProductRating[];

      // Then for each product, process its reviews
      products.forEach((product: ProductRating) => {
        if (product.reviews && '$values' in product.reviews) {
          // Filter out reviews where productRating is null
          product.reviews = (product.reviews.$values as Review[]).filter((review: Review) => review.productRating !== null);
        }
      });

      return { $values: products };
    }

    return res;
  } catch {
    return [];
  }
};

export const getProductReviews = async (productItemId: number) => {
  try {
    const res = await request.get(`Review/product/${productItemId}/details`);

    // Process the reviews
    if (res && res.reviews) {
      let reviewsArray: Review[] = [];

      // Handle the case where reviews is an object with $values
      if (res.reviews.$values && Array.isArray(res.reviews.$values)) {
        reviewsArray = res.reviews.$values;
      } else if (Array.isArray(res.reviews)) {
        reviewsArray = res.reviews;
      }

      // Filter out reviews where productRating is null
      res.reviews = reviewsArray.filter((review: Review) => review.productRating !== null);
    }

    return res;
  } catch {
    return null;
  }
};