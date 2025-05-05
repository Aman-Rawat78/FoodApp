import { Separator } from "@radix-ui/react-separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { IndianRupee } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";

const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (orders.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found!
        </h1>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      {orders.map((order: any, index: number) => (
        <div
          key={index}
          className={`shadow-lg rounded-lg p-6 max-w-lg w-full mb-6 ${
            order.status.toUpperCase() === "DELIVERED"
              ? "bg-green-100 dark:bg-green-800 border-2 border-green-500"
              : "bg-white dark:bg-gray-800"
          }`}
        >
          {/* Order Status */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Status:{" "}
              <span
                className={`${
                  order.status.toUpperCase() === "DELIVERED"
                    ? "text-green-600"
                    : "text-[#28b246]"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </h1>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Order ID:{" "}
              <span className="text-sm-[#28b246]">{order._id}</span>
            </h2>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Order Summary
            </h2>
            {order.cartItems.map((item: any, idx: number) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt=""
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-800 dark:text-gray-200 flex items-center">
                      <IndianRupee />
                      <span className="text-lg font-medium">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Continue Shopping Button */}
      <Link to="/cart">
        <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default Success;