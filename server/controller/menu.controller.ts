import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import {Menu} from "../models/menuModel";
import { Restaurant } from "../models/restaurantModel";
import mongoose, { ObjectId } from "mongoose";
import { deleteImageFromCloudinary } from "../utils/deleteImage";

export const addMenu = async (req:Request, res:Response) => {
    try {
        const {name, description, price} = req.body;
        const file = req.file;
        if(!file){
             res.status(400).json({
                success:false,
                message:"Image is required"
            })
            return;
        };
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu: any = await Menu.create({
            name , 
            description,
            price,
            image:imageUrl
        });
        const restaurant = await Restaurant.findOne({user:req.id});
        if(restaurant){
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
            await restaurant.save();
        }

         res.status(201).json({
            success:true,
            message:"Menu added successfully",
            menu
        });
    } catch (error) {
        // console.log(error);
         res.status(500).json({message:"Internal server error"}); 
    }
}



export const editMenu = async (req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const {name, description, price} = req.body;

        const file = req.file;
        const menu = await Menu.findById(id);
        if(!menu){
             res.status(404).json({
                success:false,
                message:"Menu not found!"
            })
            return;
        }
        if(name) menu.name = name;
        if(description) menu.description = description;
        if(price) menu.price = price;

        if(file){
            // Delete the old image from Cloudinary
            const publicId = menu.image.split("/").pop()?.split(".")[0]; // Extract public ID from URL
            if (publicId) {
                await deleteImageFromCloudinary(publicId);
            }
            // Upload the new image to Cloudinary
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();
          
         res.status(200).json({
            success:true,
            message:"Menu updated",
            menu,
        })
    } catch (error) {
        
         res.status(500).json({message:"Internal server error"}); 
    }
}


export const deleteMenu = async(req:Request,res:Response)=>{
    try {
        const {id} = req.params;
        const menu = await Menu.findById(id);
        if(!menu){
          res.status(404).json({
            success: false,
            message: "Menu not found"
          });
          return;
        } 
       if(menu.image){
        // Delete the old image from Cloudinary
        const publicId = menu.image.split("/").pop()?.split(".")[0]; // Extract public ID from URL
        if (publicId) {
            await deleteImageFromCloudinary(publicId);
        }
       }
       
        await Menu.deleteOne({_id:id});

      res.status(200).json({
        success:true,
        message:"Menu deleted successfully"
      });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"An error occurred while deleting the menu"
        })
    }
}