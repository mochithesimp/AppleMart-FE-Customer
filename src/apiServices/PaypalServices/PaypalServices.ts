import axios, { AxiosError } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface CreatePaypalTransactionRequest {
    orderId: number;
    paypalPaymentId: string;
    status: string;
    amount: number;
    currency: string;
    createdDate?: Date;
    isDeleted?: boolean;
}

export const createPaypalTransaction = async (transaction: CreatePaypalTransactionRequest) => {
    try {
        console.log("Creating PayPal transaction with data:", JSON.stringify(transaction, null, 2));
        const response = await axios.post(
            `${API_BASE_URL}/api/Paypal/create-transaction`,
            transaction,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("PayPal transaction response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating PayPal transaction:", {
            message: error instanceof Error ? error.message : "Unknown error",
            response: (error as AxiosError)?.response?.data,
            status: (error as AxiosError)?.response?.status,
            data: transaction
        });
        throw error;
    }
};

export const updatePaypalTransactionStatus = async (transactionId: number, status: string) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/Paypal/transaction/${transactionId}/status`,
            JSON.stringify(status),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating PayPal transaction status:", error);
        throw error;
    }
}; 