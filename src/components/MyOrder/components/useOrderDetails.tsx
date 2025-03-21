import { useCallback, useEffect, useState } from "react";
import { OrderDetail, ProductImg, ProductItem } from "../../../interfaces";
import useOrderData from "../components/useOrderData";
import { getOrder } from "../../../apiServices/OrderServices/OrderServices";
import { useParams } from "react-router-dom";
import { getProductItemId } from "../../../apiServices/ProductServices/productItemServices";
import { getProductImgs } from "../../../apiServices/ProductServices/productImgSevices";

export const useOrderDetails = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const { orderData } = useOrderData();

  useEffect(() => {
    const fetchOrderDetailData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          await swal({
            title: "Oops!",
            text: "You haven't logged in yet! Redirecting to Login Page...",
            icon: "warning",
            buttons: {
              ok: {
                text: "OK",
                value: true,
                className: "swal-ok-button",
              },
            },
          });
          window.location.href = "/login";
          return;
        }

        const response = await getOrder(orderId);

        if (response.orderDetails.$values) {
          setOrderDetails(response.orderDetails.$values);
        } else {
          console.error(
            "Failed to retrieve order data:",
            response.orderDetails.$values
          );
        }
      } catch (error) {
        console.error("Failed to retrieve order data:", error);
      }
    };

    fetchOrderDetailData();
  }, [orderId]);

  const fetchProducts = useCallback(async () => {
    if (orderDetails.length === 0) return; // Không fetch nếu chưa có orderDetails

    const productItemIds = orderDetails.map(
      (orderDetail) => orderDetail.productItemID
    );

    try {
      // Gọi API
      const responses = await Promise.all(
        productItemIds.map((id) => getProductItemId(id))
      );
      const productImgsResult = await getProductImgs();

      const productImgs = productImgsResult.$values;

      // Nhóm ảnh theo productItemID
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imagesByProductItemID = productImgs.reduce(
        (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          acc: { [x: string]: any[] },
          img: { productItemID: string | number }
        ) => {
          if (!acc[img.productItemID]) {
            acc[img.productItemID] = [];
          }
          acc[img.productItemID].push(img);
          return acc;
        },
        {} as Record<number, ProductImg[]>
      );
      // Gán danh sách ảnh vào productItem tương ứng
      const mergedData: ProductItem[] = responses.map((item) => ({
        ...item, // Giữ nguyên dữ liệu từ API
        productImgs: imagesByProductItemID[item.productItemID] || [], // Thêm danh sách ảnh
      }));

      setProductItems(mergedData);
    } catch (error) {
      console.error("Failed to fetch product items:", error);
    }
  }, [orderDetails]);

  useEffect(() => {
    if (orderDetails.length > 0) {
      fetchProducts();
    }
  }, [orderDetails, fetchProducts]);

  return { productItems, orderDetails, orderData, orderId };
};
