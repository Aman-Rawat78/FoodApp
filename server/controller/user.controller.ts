import { Request, Response } from 'express';
import { User } from '../models/userModel';
import bcrypt from  "bcryptjs";
import crypto from "crypto";
import cloudinary from '../utils/cloudinary';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import { generateToken } from '../utils/generateToken';
import { deleteImageFromCloudinary } from '../utils/deleteImage';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email';

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contact} = req.body;
        
        let user = await User.findOne({email});
        if(user){
             res.status(400).json({success:false ,message:"User already exists with this email"});   
           return;
            }

       const hashedPassword = await bcrypt.hash(password, 10);

       const verificationToken = generateVerificationCode()
        
       user = await User.create({
        fullname,
        email,
        password:hashedPassword,
        contact:Number(contact),
        verificationToken,
        verificationTokenExpiresAt: Date.now()+24*60*60*1000 // this will expire after 24 hours
         })

         generateToken(res,user); // this will generate token and set it in cookie 

         await sendVerificationEmail(email,verificationToken);

        const userWithoutPassword = await User.findOne({email}).select("-password");
        res.status(201).json({ success: true, message: "Account created successfully", user : userWithoutPassword});
    } catch (error) {
      
        res.status(500).json({message:"Internal Server Error"});
    }
};


export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { verificationCode } = req.body;
       
        const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password");

        if (!user) {
             res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
            return;
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined
        await user.save();

        // send welcome email
        await sendWelcomeEmail(user.email, user.fullname);

         res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user,
        })
    } catch (error) {
         res.status(500).json({ message: "Internal server error" })
    }
};

export const login = async (req: Request, res: Response)=>{
    try {
       
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
             res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
            return;
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
             res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
            return;
        }
        generateToken(res, user); // this will generate token and set it in cookie 

        user.lastLogin = new Date();
        await user.save();

        // send user without password
        const userWithoutPassword = await User.findOne({ email }).select("-password");
       
         res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword
        });
    } catch (error) {
       
         res.status(500).json({ message: "Internal server error" })
    }
};

export const logout = async (_: Request, res: Response) => {
    try {
         res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
      
         res.status(500).json({ message: "Internal server error" })
    }
};


export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
       
        if (!user) {
             res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
            return;
        }
      
        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send email
       
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

         res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        console.error(error);
         res.status(500).json({ message: "Internal server error" });
    }
};


export const resetPassword = async (req: Request, res: Response) => {
    try {
      

        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
             res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
            return;
        }
        //update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        // send success reset email
        await sendResetSuccessEmail(user.email);

         res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    } catch (error) {
        console.error(error);
         res.status(500).json({ message: "Internal server error" });
    }
};


export const checkAuth = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
             res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        };
         res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
         res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
     
      const userId = req.id;
      const { fullname, email, address, city, country, profilePicture } =
        req.body;
  
      // Validate input
      if (!fullname || !email || !address || !city || !country) {
         res.status(400).json({ message: "All fields are required" });
      }

        // Find the user
    const update = await User.findById(userId);
    if (!update) {
     res.status(404).json({ message: "User not found" });
    return;
    }

    // Delete the previous profile picture from Cloudinary if it exists
    if (update.profilePicture) {
      try {
      // Extract public_id from the profilePicture URL
       const publicId = update.profilePicture.split("/").pop()?.split(".")[0];
       if (publicId) {
         await deleteImageFromCloudinary(publicId); // Call the deleteImage utility
          }      
        } catch (error) {
        console.error("Error deleting previous image from Cloudinary:", error);
         res.status(500).json({ message: "Error deleting previous image" });
         return
      }
    }

  
      // Upload image to Cloudinary
      let cloudResponse: any;
      if (profilePicture) {
        try {
          cloudResponse = await cloudinary.uploader.upload(profilePicture);
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
           res.status(500).json({ message: "Error uploading image" });
        }
      }
  
      // Prepare updated data
      const updatedData: any = { fullname, email, address, city, country };
      if (cloudResponse) {
        updatedData.profilePicture = cloudResponse.secure_url;
      }
  
      // Update user profile
      const user = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      }).select("-password");
  
      if (!user) {
         res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        success: true,
        user,
        message: "Profile updated successfully",
      });
    } catch (error) {
   
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// export const setAdmin = async (req: Request, res: Response) => {
//     try {
       
//       const user = await User.findById(req.id);
  
//       if (!user) {
//         res.status(404).json({ success: false, message: 'User not found' });
//         return
//       }
  
//       user.admin = true; // Set the user as admin
//       await user.save();
   
//       res.status(200).json({ success: true, message: 'You are now an admin!' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   };