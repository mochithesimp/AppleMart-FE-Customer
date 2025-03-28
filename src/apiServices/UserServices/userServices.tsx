import axios from "axios";
import * as request from "../../utils/request";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await request.get("User/GetAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserId = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await request.get(`User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (userId: string, formData: unknown) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/User/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const orderCancel = async (orderId: number) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `${API_BASE_URL}/Order/${orderId}/status?NewStatus=Cancelled&isCancelledByCustomer=true`,
      {}, // Empty body is required
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in orderCancel:", error);
    return null;
  }
};

export const orderCompleted = async (orderId: number) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `${API_BASE_URL}/Order/${orderId}/status?NewStatus=Completed`,
      {}, // Empty body is required
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error in orderCompleted:", error);
    return null;
  }
};

export const requestRefund = async (orderId: number, reason: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await axios.put(
      `${API_BASE_URL}/Order/${orderId}/status?NewStatus=RefundRequested&RefundReason=${encodeURIComponent(reason)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error requesting refund:", error);
    throw error;
  }
};
