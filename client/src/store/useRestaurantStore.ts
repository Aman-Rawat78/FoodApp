import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8000/api/v1/restaurant";
axios.defaults.withCredentials = true;



export const useRestaurantStore = create<RestaurantState>()(persist((set, get) => ({
    loading: false,
    restaurant: null,
    searchedRestaurant: null,
    appliedFilter: [],
    singleRestaurant: null,
    restaurantOrder: [],
   

    // api implementation for creating restaurant
    createRestaurant: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },


    // api implementation for getting restaurant
    getRestaurant: async () => {
        try {
            set({ loading: true });
            
            const response = await axios.get(`${API_END_POINT}/`);
            if (response.data.success) {
             
                set({ loading: false, restaurant: response.data.restaurant });
            }else{
                set({restaurant:null});
            }
        } catch (error: any) {
            if (error.response.status === 404) {
                set({ restaurant: null });
            }
            set({ loading: false });
        }finally{
            set({ loading: false });
        }
    },



    // api implementation for updating restaurant
    updateRestaurant: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.put(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },



    // api implementation for searching 
    searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: any) => {
        try {
            set({ loading: true });

            const params = new URLSearchParams();
            params.set("searchQuery", searchQuery);
            params.set("selectedCuisines", selectedCuisines.join(","));

            // await new Promise((resolve) => setTimeout(resolve, 4000));
            const response = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
            if (response.data.success) {

                set({ loading: false, searchedRestaurant: response.data });
            }
        } catch (error) {
            set({ loading: false });
        }
    },


    // Adding menu to restaurant
    addMenuToRestaurant: (menu: MenuItem) => {
        set((state: any) => ({
            restaurant: state.restaurant ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] } : null,
        }))
    },



    updateMenuToRestaurant: (updatedMenu: any) => {
        set((state: any) => {
            
            if (state.restaurant) {
                const updatedMenuList = state.restaurant.menus.map((menu: any) => menu._id === updatedMenu._id ? updatedMenu : menu);
                return {
                    restaurant: {
                        ...state.restaurant,
                        menus: updatedMenuList
                    }
                }
            }
            // if state.restaruant is undefined then return state
            return state;
        })
    },


    deleteMenuFromRestaurant: (menuId: string) => {
        set((state: any) => {
            if (state.restaurant) {
                const updatedMenuList = state.restaurant.menus.filter((menu: any) => menu._id !== menuId);
                return {
                    restaurant: {
                        ...state.restaurant,
                        menus: updatedMenuList
                    }
                }
            }
            return state;
        })
    },

    setAppliedFilter: (value: string) => {
        set((state:any) => {
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item : any) => item !== value) : [...state.appliedFilter, value];
            return { appliedFilter: updatedFilter }
        })
    },

    // to reset the applied filter
    resetAppliedFilter: () => {
        set({ appliedFilter: [] })
    },


    getSingleRestaurant: async (restaurantId: string) => {
        try {
            const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
            if (response.data.success) {
                set({ singleRestaurant: response.data.restaurant })
            }
        } catch (error) { }
    },

   // api implementation for getting restaurant orders
    getRestaurantOrders: async () => {
        try {
            const response = await axios.get(`${API_END_POINT}/order`);
            // console.log("call for orders")
            if (response.data.success) {
                // console.log(response.data.orders )
                set({ restaurantOrder: response.data.orders });
            }
        } catch (error) {
          
        }
    },

    // api implementation for updating restaurant order status like confirm, preparing, delivered
    updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
            const response = await axios.put(`${API_END_POINT}/order/${orderId}/status`, { status }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                const updatedOrder = get().restaurantOrder.map((order: Orders) => {
                    return order._id === orderId ? { ...order, status: response.data.status } : order;
                })
                set({ restaurantOrder: updatedOrder });
                toast.success(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

}), {
    name: 'restaurant-name',
    storage: createJSONStorage(() => localStorage)
}))