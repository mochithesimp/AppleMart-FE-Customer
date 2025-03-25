import * as request from "../../utils/request";

export const getBlogs = async () => {
  try {
    const res = await request.get(`Blog`);
    //console.log("check data search: ", res);
    return res;
  } catch (error) {
    console.log(error);
  }
};