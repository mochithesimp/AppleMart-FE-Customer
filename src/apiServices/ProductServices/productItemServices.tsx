import request from "../../utils/request";

export const getProductItems = async () => {
  try {
      const res = await request.get(`ProductItem`);
      return res.data; // Trả về dữ liệu đúng
  } catch (error) {
      console.error("Error fetching product items:", error);
      return []; // Trả về mảng rỗng nếu lỗi
  }
};