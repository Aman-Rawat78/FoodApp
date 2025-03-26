import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT: string = "http://localhost:8000/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(persist((set => ({
    loading: false,
    orders: [],

    // In this function, we are creating a checkout session by sending a post request to the server.
    createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, checkoutSession, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            window.location.href = response.data.session.url;
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },


    // In this function, we are getting the order details by sending a get request to the server.
    getOrderDetails: async () => {
        try {
            set({loading:true});
            const response = await axios.get(`${API_END_POINT}/`);
          
            set({loading:false, orders:response.data.orders});
        } catch (error) {
            set({loading:false});
        }
    }
})), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))