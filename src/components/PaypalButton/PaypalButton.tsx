import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { FC } from "react";

interface PaypalButtonProps {
    amount: number;
    currency: string;
    onSuccess: (paypalPaymentId: string) => void;
    onError: (error: Error | unknown) => void;
}

const PaypalButton: FC<PaypalButtonProps> = ({ amount, currency, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider options={{
            clientId: "AbYoH5JdRKNeJ_x46blNYUZnSaxLGAS4mqYfhIx65TlQVu2xEiUCFVHyuaEYFOTfFE4ND7At-F_WcLQc",
            currency: currency
        }}>
            <PayPalButtons
                style={{ layout: "horizontal" }}
                createOrder={(_, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                amount: {
                                    value: amount.toString(),
                                    currency_code: currency
                                },
                            },
                        ],
                    });
                }}
                onApprove={async (_, actions) => {
                    try {
                        const order = await actions.order?.capture();
                        if (order?.id) {
                            const captureId = order.purchase_units?.[0]?.payments?.captures?.[0]?.id;

                            console.log("PayPal Order ID:", order.id);
                            console.log("PayPal Capture ID:", captureId);

                            if (captureId) {
                                onSuccess(captureId);
                            } else {
                                console.warn("PayPal Capture ID not found, using Order ID instead");
                                onSuccess(order.id);
                            }
                        } else {
                            throw new Error("Failed to capture PayPal order");
                        }
                    } catch (error) {
                        onError(error);
                    }
                }}
                onError={(error: Error | unknown) => {
                    onError(error);
                    console.error("PayPal Checkout onError", error);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PaypalButton; 