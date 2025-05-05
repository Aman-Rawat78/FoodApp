import { CartState } from "@/types/cartType";
import { MenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useCartStore = create<CartState>()(persist((set) => ({
    cart: [],
    restaurantId: null,

    // In fuction addToCart, we are checking if the item is already in the cart or not.
    //  If it is already in the cart then we are increasing the quantity of that item by 1. 
    // If it is not in the cart then we are adding that item to the cart with quantity 1.
    addToCart: (item: MenuItem, restaurantId: string) => {
        set((state) => {
             // Check if the cart is empty
            if (state.cart.length === 0) {
                // Add the first item and set the restaurantId
                return {
                    cart: [{ ...item, quantity: 1 }],
                    restaurantId, // Set the restaurantId for the cart
                };
            }

            // Check if the restaurantId matches the existing one in the cart
            if (state.restaurantId !== restaurantId) {
                // Clear the cart and add the new item with the new restaurantId
                return {
                    cart: [{ ...item, quantity: 1 }],
                    restaurantId, // Update the restaurantId
                };
            }

            // If the restaurantId matches, check if the item already exists in the cart
            const existingItem = state.cart.find((cartItem) => cartItem._id === item._id);
            if (existingItem) {
                // Increment the quantity of the existing item
                return {
                    cart: state.cart.map((cartItem) =>
                        cartItem._id === item._id
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem
                    ),
                    restaurantId, // Keep the same restaurantId
                };
            }

            // Add the new item to the cart
            return {
                cart: [...state.cart, { ...item, quantity: 1 }],
                restaurantId, // Keep the same restaurantId
            };
        })
    },

    //  we are setting the cart to an empty array.
    clearCart: () => {
        set({ cart: [] , restaurantId: null});
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