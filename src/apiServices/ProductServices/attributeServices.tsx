import request from "../../utils/request";

export const getAttributes = async () => {
  try {
      const res = await request.get(`Attribute`);
      return res.data; // Trả về dữ liệu đúng
  } catch (error) {
      console.error("Error fetching product item attributes:", error);
      return []; // Trả về mảng rỗng nếu lỗi
  }
};