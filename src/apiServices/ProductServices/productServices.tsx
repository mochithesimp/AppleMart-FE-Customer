/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "axios";
import * as request from "../../utils/request";

export const getProductId = async (productId: number) => {
  try {
    const res = await request.get(`Product/${productId}`);
    //console.log("check data search: ", res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async () => {
  try {
    const res = await request.get("Product");
    return res;
  } catch (error) {
    console.log(error);
  }
};
