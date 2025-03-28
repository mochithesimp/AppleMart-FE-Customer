import { AxiosError } from "axios";
import request from "../../utils/request";

export const login = async (email: string, password: string) => {
  try {
    const res = await request.post("/api/Account/Login", { email, password });
    //console.log("check data search: ", res);
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}

export const forgetPassword = async (email: string) => {
  try {
    // Sử dụng GET và truyền email qua query parameter
    const res = await request.get(`Account/forget-password?email=${encodeURIComponent(email)}`);
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
};

export const changePass = async (email: string, resetPasswordToken: string, password: string, confirmPassword: string) => {
  try {
    const res = await request.post("Account/reset-password", { 
      email, 
      resetPasswordToken, 
      password, 
      confirmPassword 
    });
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}