import { Request, Response } from "express";
import { Restaurant } from "../models/restaurantModel";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/orderModel";
import {deleteImageFromCloudinary} from "../utils/deleteImage";

export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
 

        const restaurant = await Restaurant.findOne({ user: req.id });
        if (restaurant) {
             res.status(400).json({
                success: false,
                message: "Restaurant already exist for this user"
            })
            return
        }
        if (!file) {
             res.status(400).json({
                success: false,
                message: "Image is required"
            })
            return
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: JSON.parse(cuisines),
            imageUrl
        });
         res.status(201).json({
            success: true,
            message: "Restaurant Added"
        });
    } catch (error) {
       
         res.status(500).json({ message: "Internal server error" })
    }
}

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id }).populate('menus');
        if (!restaurant) {
             res.status(404).json({
                success: false,
                restaurant:[],
                message: "Restaurant not found"
            })
            return
        };
         res.status(200).json({ success: true, restaurant });
    } catch (error) {
       
         res.status(500).json({ message: "Internal server error" })
    }
}

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
             res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
            return
        };
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines); 

        if (file) {
            // Delete the old image from Cloudinary
             const publicId = restaurant.imageUrl.split("/").pop()?.split(".")[0]; // Extract public ID from URL
             if (publicId) {  
                await deleteImageFromCloudinary(publicId);
                }
            // Upload the new image to Cloudinary
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
         res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant
        })
    } catch (error) {
     
         res.status(500).json({ message: "Internal server error" })
    }
}


export const getRestaurantOrder = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id });
        // console.log("finding restaurant")
        if (!restaurant) {
             res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
            return;
        };
        const orders = await Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
        // console.log(orders)
         res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        //  console.log(error);
         res.status(500).json({ message: "Internal server error" })
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
             res.status(404).json({
                success: false,
                message: "Order not found"
            })
            return;
        }
        order.status = status;
        await order.save();
         res.status(200).json({
            success: true,
            status:order.status,
            message: "Status updated"
        });

    } catch (error) {
        
         res.status(500).json({ message: "Internal server error" })
    }
}


export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
        const query: any = {};
        // basic search based on searchText (name ,city, country)
     
        
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            ]
        }
        // filter on the basis of searchQuery
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } }
            ]
        }
        
        // ["momos", "burger"]
        if(selectedCuisines.length > 0){
            query.cuisines = {$in:selectedCuisines}
        }
        
        const restaurants = await Restaurant.find(query);
        
        res.status(200).json({
            success:true,
            data:restaurants
        });
    } catch (error) {
      
         res.status(500).json({ message: "Internal server error" })
    }
}


export const getSingleRestaurant = async (req:Request, res:Response) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path:'menus',
            options:{createdAt:-1}
        });
        if(!restaurant){
             res.status(404).json({
                success:false,
                message:"Restaurant not found"
            })
            return
        };
         res.status(200).json({success:true, restaurant});
    } catch (error) {
         res.status(500).json({ message: "Internal server error" })
    }
}