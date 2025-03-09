import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, User, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";

// These would typically be environment variables or from a secure store
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const AdminLoginForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginAdmin } = useAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.username === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
      // Create a fake token - in a real app this would come from your backend
      const fakeToken = btoa(data.username + ":" + Date.now());
      loginAdmin(fakeToken);

      toast({
        title: "Login successful",
        description: "Welcome back, admin!",
      });

      navigate("/admin-messages");
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 w-full max-w-md glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-3">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <Lock className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h2 className="font-bold text-gradient text-2xl text-center">
          Admin Login
        </h2>
        <p className="text-muted-foreground text-sm text-center">
          Enter your credentials to access the admin dashboard
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <div className="relative">
            <User className="top-3 left-3 absolute w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Username"
              {...register("username")}
              className="pl-10"
            />
          </div>
          {errors.username && (
            <p className="text-destructive text-xs">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Key className="top-3 left-3 absolute w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="pl-10"
            />
          </div>
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="relative w-full overflow-hidden"
      >
        <span className={isSubmitting ? "invisible" : "visible"}>Login</span>
        {isSubmitting && (
          <span className="absolute inset-0 flex justify-center items-center">
            <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
          </span>
        )}
      </Button>
    </motion.form>
  );
};

export default AdminLoginForm;
