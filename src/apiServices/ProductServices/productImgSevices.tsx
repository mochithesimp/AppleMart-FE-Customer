import request from "../../utils/request";

export const getProductImgs = async () => {
  try {
    const res = await request.get(`/api/ProductImgs`);
    return res.data;
  } catch (error) {
    console.error("Error fetching productImgs:", error);
    return [];
  }
};
