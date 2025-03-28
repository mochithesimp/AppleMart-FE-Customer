import axios from "axios";
import * as request from "../../utils/request";
import { getUserIdFromToken } from "../../utils/jwtHelper";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getOrderList = async (queryParams: URLSearchParams) => {
  try {
    const token = localStorage.getItem("token");

    const res = await request.get("/api/Shipper/orders", {
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
      `${API_BASE_URL}/api//Order/${orderId}/status?NewStatus=Delivered&ShipperId=${userId}`,
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
