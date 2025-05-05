import {z} from "zod";

export const userSignupSchema = z.object({
    fullname:z.string().min(1,"Fullname is required"),
    email:z.string().email("Invalid email address"),
    password:z.string().min(8, "Password must be at least 8 characters."),
    contact:z.string().min(10,{message:"Contact number at least 10 digit"}).max(10,"Contact number at most 10 digit"),
});
export type SignupInputState = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({ 
    email:z.string().email("Invalid email address"),
    password:z.string().min(8, "Password must be at least 8 characters.") 
});

export type LoginInputState = z.infer<typeof userLoginSchema>;

export const userEmailValidationSchema = z.object({
    email:z.string().email("Invalid email address"), 
});

export type emailValidationState = z.infer<typeof userEmailValidationSchema>;

export const userPasswordResetSchema = z.object({ 
    password:z.string().min(8, "Password must be at least 8 characters.") 
}); 

export type PasswordResetState = z.infer<typeof userPasswordResetSchema>;