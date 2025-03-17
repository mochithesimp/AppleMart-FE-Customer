/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";

interface OrderDetail {
  productItemID: number;
  quantity: number;
  price: number;
}

interface OrderRequest {
  userID: string;
  shipperID: string | null;
  orderDate: string;
  address: string;
  paymentMethod: string;
  shippingMethodID: number;
  total: number;
  voucherID: number;
  orderDetails: OrderDetail[];
}

interface OrderResponse {
  orderID: number;
  userID: string;
  shipperID: string | null;
  orderDate: string;
  address: string;
  paymentMethod: string;
  shippingMethodID: number;
  total: number;
  voucherID: number | null;
  orderStatus: string;
  orderDetails: {
    $id: string;
    $values: Array<any>;
  };
}

export const ordersByCash = async (order: any) => {
  try {
    const res = await axios.post(
      `https://localhost:7140/api/Order`,order,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      
    );
    //console.log("check data search: ", res);
    return res;
  } catch (error) {
    console.log(error);
  }
};


export const orders = async (order: OrderRequest) => {
  try {
    console.log("Sending order data to API:", JSON.stringify(order, null, 2));
    const res = await axios.post(
      `https://localhost:7140/api/Order`,
      order,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Order API Response:", {
      status: res.status,
      data: res.data
    });
    return {
      status: res.status,
      data: res.data as OrderResponse
    };
  } catch (error) {
    console.error("Order API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: (error as AxiosError)?.response?.data,
      status: (error as AxiosError)?.response?.status
    });
    throw error;
  }
};


