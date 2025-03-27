import axios from "axios";
import * as request from "../../utils/request";
import { getUserIdFromToken } from "../../utils/jwtHelper";

export const getOrderList = async (queryParams: URLSearchParams) => {
  try {
    const token = localStorage.getItem("token");

    const res = await request.get("Shipper/orders", {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const orderConfirm = async (orderId: number, token: string) => {
  try {
    const userIdIdentifier = getUserIdFromToken(token);
    const userId = userIdIdentifier;
    const res = await axios.put(
      `https://localhost:7140/api/Order/${orderId}/status?NewStatus=Completed&ShipperId=${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in orderConfirm:", error);
    return null;
  }
};
