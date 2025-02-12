// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home-page/Home";
import LoginPage from "./pages/Login&Register-page/Login";
import AdminPage from "./pages/Admin";
import ProductPage from "./pages/Product-page/Product";
import ForPassPage from "./pages/ForgetPassword-page/ForgetPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/Product',
    element: <ProductPage />,
  },
  {
    path: '/ForgetPass',
    element: <ForPassPage />,
  },
  {
    path: '/Admin',
    element: <AdminPage />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
