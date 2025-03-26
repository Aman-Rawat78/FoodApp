import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailValidationState, userEmailValidationSchema } from "@/shcema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const {loading,forgotPassword }=  useUserStore();
    const [errors, setErrors] = useState<Partial<emailValidationState>>({});
    const [message, setMessage] = useState<string | null>(null);

    const handleForgotPassword = async (e: FormEvent) => {
      e.preventDefault();

      const result = userEmailValidationSchema.safeParse({ email });

      if(!result.success){
          const fieldErrors = result.error.formErrors.fieldErrors;
          setErrors(fieldErrors as Partial<emailValidationState>);
          return;
      }
      // Implement the logic to send a password reset email
      try{
          await forgotPassword(email);
          setMessage("Password reset link has been sent to your email");
      }catch(error){
          console.error(error);

      }
      
  };
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
           <form  onSubmit={handleForgotPassword}className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-600">Enter your email address to reset your password</p>
        </div>
        <div className="relative w-full">
            <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10"
            />
            <Mail className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none"/>
            {errors && (
              <span className="text-xs text-red-500 text-left block ml-4">{errors.email}</span>
            )}
        </div>
        {
            loading ? (
                <Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait</Button>
            ) : (
                <Button type="submit" className="bg-orange hover:bg-hoverOrange">Send Reset Link</Button>
            )
        }
        <span className="text-center">
            Back to{" "}
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </span>

        {message && (
          <div className="text-center text-green-500">{message}</div>
        )}
      </form>
      </div>
  )
}

export default ForgotPassword;