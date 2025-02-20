// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home-page/Home";
import LoginPage from "./pages/Authentication-page/UserAuth";
import ProductPage from "./pages/Product-page/Product";
import ForPassPage from "./pages/Authentication-page/ForgetPassword";
import ChangePassPage from "./pages/Authentication-page/ChangePassword";
import CartPage from "./pages/Cart-page/Cart";
import ChatPage from "./pages/Chat-page/Chat";
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
    element: <ProductPage />,
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
    path: "/Chat",
    element: <ChatPage />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
