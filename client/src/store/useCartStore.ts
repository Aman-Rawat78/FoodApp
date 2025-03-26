import { CartState } from "@/types/cartType";
import { MenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useCartStore = create<CartState>()(persist((set) => ({
    cart: [],

    // In fuction addToCart, we are checking if the item is already in the cart or not.
    //  If it is already in the cart then we are increasing the quantity of that item by 1. 
    // If it is not in the cart then we are adding that item to the cart with quantity 1.
    addToCart: (item: MenuItem) => {
        set((state) => {
            const exisitingItem = state.cart.find((cartItem) => cartItem._id === item._id);
            if (exisitingItem) {
                // already added in cart then inc qty
                return {
                    cart: state?.cart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                    )
                };
            } else {
                // add cart
                return {
                    cart: [...state.cart, { ...item, quantity: 1 }]
                }
            }
        })
    },

    //  we are setting the cart to an empty array.
    clearCart: () => {
        set({ cart: [] });
    },

    // In this function we are filtering out the item from the cart whose id is equal to the id passed in the argument.
    removeFromTheCart: (id: string) => {
        set((state) => ({
            cart: state.cart.filter((item) => item._id !== id)
        }))
    },

    // In this function, we are incrementing the quantity of the item whose id is equal to the id passed in the argument.
    incrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item)
        }))
    },

    // In this function, we are decrementing the quantity of the item whose id is equal to the id passed in the argument.
    decrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id === id && item
            .quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
        }))
    }
}),
    {
        name: 'cart-name',
        storage: createJSONStorage(() => localStorage)
    }
))