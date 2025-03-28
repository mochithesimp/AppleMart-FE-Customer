import * as request from "../../utils/request";

export const getCategory = async () => {
  try {
    const res = await request.get("/api//Category");
    return res;
  } catch (error) {
    console.log(error);
  }
};
