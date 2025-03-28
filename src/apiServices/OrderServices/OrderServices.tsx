/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import * as request from "../../utils/request";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_BASE_URL}/Order`, order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log("check data search: ", res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const orders = async (order: OrderRequest) => {
  try {
    console.log("Sending order data to API:", JSON.stringify(order, null, 2));
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await axios.post(`${API_BASE_URL}/Order`, order, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    console.log("Order API Response:", {
      status: res.status,
      data: res.data,
    });
    return {
      status: res.status,
      data: res.data as OrderResponse,
    };
  } catch (error) {
    console.error("Order API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: (error as AxiosError)?.response?.data,
      status: (error as AxiosError)?.response?.status,
    });
    throw error;
  }
};

export const getOrderList = async (queryParams: URLSearchParams) => {
  try {
    const token = localStorage.getItem("token");

    const res = await request.get("Order/orders", {
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

export const getOrder = async (orderId: any) => {
  try {
    const token = localStorage.getItem("token");
    const res = await request.get(`Order/${parseInt(orderId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const search = async (queryParams: URLSearchParams) => {
  try {
    const res = await request.get("Order/orders", { params: queryParams });
    // console.log("check data search: ", res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

interface ProductRatingRequest {
  userID: string;
  orderDetailID: number;
  productItemID: number;
  rating: number;
  comment?: string;
}

interface ShipperRatingRequest {
  userID: string;
  orderDetailID: number;
  productItemID: number;
  shipperID: string;
  rating: number;
  comment?: string;
}

export const rateProduct = async (ratingData: ProductRatingRequest) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await axios.post(`${API_BASE_URL}/Review/product`, ratingData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    return {
      status: res.status,
      data: res.data
    };
  } catch (error) {
    console.error("Product Rating API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: (error as AxiosError)?.response?.data,
      status: (error as AxiosError)?.response?.status,
    });
    throw error;
  }
};

export const rateShipper = async (ratingData: ShipperRatingRequest) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await axios.post(`${API_BASE_URL}/Review/shipper`, ratingData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    return {
      status: res.status,
      data: res.data
    };
  } catch (error) {
    console.error("Shipper Rating API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: (error as AxiosError)?.response?.data,
      status: (error as AxiosError)?.response?.status,
    });
    throw error;
  }
};

export const orderRating = async (orderDetailId: number, ratingData: any) => {
  try {
    if (ratingData.productRating && !ratingData.shipperRating) {
      return await rateProduct({
        userID: ratingData.userID || localStorage.getItem("userId") || "",
        orderDetailID: orderDetailId,
        productItemID: ratingData.productItemID,
        rating: ratingData.productRating,
        comment: ratingData.productComment
      });
    } else if (!ratingData.productRating && ratingData.shipperRating) {
      return await rateShipper({
        userID: ratingData.userID || localStorage.getItem("userId") || "",
        orderDetailID: orderDetailId,
        productItemID: ratingData.productItemID,
        shipperID: ratingData.shipperID || "",
        rating: ratingData.shipperRating,
        comment: ratingData.shipperComment
      });
    } else {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.post(`${API_BASE_URL}/Review`, {
        userID: ratingData.userID || localStorage.getItem("userId") || "",
        orderDetailID: orderDetailId,
        productItemID: ratingData.productItemID,
        shipperID: ratingData.shipperID,
        productRating: ratingData.productRating,
        productComment: ratingData.productComment,
        shipperRating: ratingData.shipperRating,
        shipperComment: ratingData.shipperComment
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      return {
        status: res.status,
        data: res.data
      };
    }
  } catch (error) {
    console.error("Rating API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: (error as AxiosError)?.response?.data,
      status: (error as AxiosError)?.response?.status,
    });
    throw error;
  }
};

export const getUserProductRatingStatus = async (userId: string, orderDetailIds: number[]) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const queryString = orderDetailIds.map(id => `orderDetailIds=${id}`).join('&');
    const url = `${API_BASE_URL}/Review/user/${userId}/product-rating-status?${queryString}`;

    const res = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    return {
      status: res.status,
      data: res.data as Record<string, boolean>
    };
  } catch (error) {
    console.error("Rating Status API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: (error as AxiosError)?.response?.data,
      status: (error as AxiosError)?.response?.status,
    });
    throw error;
  }
};

export const getShipperInfo = async (shipperId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await axios.get(`${API_BASE_URL}/User/${shipperId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    return {
      status: res.status,
      data: res.data
    };
  } catch (error) {
    console.error("Get Shipper API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: (error as AxiosError)?.response?.data,
      status: (error as AxiosError)?.response?.status,
    });
    throw error;
  }
};

export const hasUserRatedShipper = async (userId: string, shipperId: string, orderId: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const url = `${API_BASE_URL}/Review/user/${userId}/shipper/${shipperId}/order/${orderId}/has-rated`;

    const res = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    return {
      status: res.status,
      data: res.data as boolean
    };
  } catch (error) {
    console.error("Shipper Rating Check API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: (error as AxiosError)?.response?.data,
      status: (error as AxiosError)?.response?.status,
    });
    return {
      status: 200,
      data: false
    };
  }
};




