import { v2 as cloudinary } from "cloudinary";


export const deleteImageFromCloudinary = async (publicId: string) => {
    try {
      await cloudinary.uploader.destroy(publicId);
      // console.log(`Image with public_id ${publicId} deleted successfully.`);
    } catch (error) {
      // console.error("Error deleting image from Cloudinary:", error);
      throw new Error("Error deleting image from Cloudinary");
    }
  };