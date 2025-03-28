import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import ProductDetails from "./pages/ProductDetails-page/ProductDetail";
import MyOrderPage from "./pages/MyOrder-page/MyOrderPage";
import { NotificationProvider } from "./context/NotificationContext";
import OrderDetailPage from "./pages/OrderDetails-page/OrderDetailPage";
import BlogsPage from "./pages/Blogs-page/BlogsPage";
import BlogsDetailPage from "./pages/Blogs-page/BlogsDetailPage";
import DeliveryOrdersPage from "./pages/DeliveryOrder-page/DeliveryOrdersPage";

import ProtectedRoute from "./utils/protectedRoute";
import ProfilePage from "./pages/Profile-page/ProfilePage";
import PaymentWrapper from "./utils/protectedRoutePayment";
import ProtecteDeliveryRoute from "./utils/protecteDeliveryRoute";
import useAutoRefreshToken from "./utils/useAutoRefreshToken";

// Lazy load các trang
const HomePage = lazy(() => import("./pages/Home-page/Home"));
const LoginPage = lazy(() => import("./pages/Authentication-page/UserAuth"));
const ProductPage = lazy(() => import("./pages/Product-page/Product"));
const ForPassPage = lazy(
  () => import("./pages/Authentication-page/ForgetPassword")
);
const ChangePassPage = lazy(
  () => import("./pages/Authentication-page/ChangePassword")
);
const CartPage = lazy(() => import("./pages/Cart-page/Cart"));
const CheckoutPage = lazy(() => import("./pages/Checkout-page/Checkout"));
const ProductMenu = lazy(() => import("./pages/ProductMenu-page/ProductMenu"));
const ChatPage = lazy(() => import("./pages/Chat-page/Chat"));

// Khai báo router
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/Product",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductPage />
      </Suspense>
    ),
  },
  {
    path: "/ForgetPass",
    element: <ForPassPage />,
  },
  {
    path: "/ChangePass",
    element: <ChangePassPage />,
  },
  {
    path: "/Cart",
    element: <CartPage />,
  },
  {
    path: "/Checkout",
    element: (
      <ProtectedRoute allowedRoles={["Customer"]}>
        <PaymentWrapper>
          <CheckoutPage />
        </PaymentWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: "/productDetails/:productItemId",
    element: <ProductDetails />,
  },
  {
    path: "/ProductMenu",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductMenu />
      </Suspense>
    ),
  },
  {
    path: "/Chat",
    element: (
      <ProtectedRoute allowedRoles={["Customer", "Shipper"]}>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/MyOrderPage",
    element: (
      <ProtectedRoute allowedRoles={["Customer"]}>
        <MyOrderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orderDetails/:orderId",
    element: (
      <ProtectedRoute allowedRoles={["Customer"]}>
        <OrderDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/DeliveryOrderPage",
    element: (
      <ProtecteDeliveryRoute>
        <DeliveryOrdersPage />
      </ProtecteDeliveryRoute>
    ),
  },
  {
    path: "/Blogs",
    element: <BlogsPage />,
  },
  {
    path: "/Blogs/detail",
    element: <BlogsDetailPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["Customer", "Shipper"]}>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  useAutoRefreshToken(); 
  return (
    <NotificationProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;
