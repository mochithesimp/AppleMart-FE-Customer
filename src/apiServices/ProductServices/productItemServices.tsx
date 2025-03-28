import * as request from "../../utils/request";

export const getProductItems = async () => {
  try {
    const res = await request.get(`ProductItem`);
    console.log("Dữ liệu từ API:", res);
    return res; // Trả về dữ liệu đúng

  } catch (error) {
    console.error("Error fetching product items:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
};

export const search = async (queryParams: URLSearchParams) => {
  try {
    const res = await request.get("ProductItem", { params: queryParams });
    // console.log("check data search: ", res);
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
    return res;
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    return [];
  }
};