import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/auth/AuthContext";
import heroImage from "@/assets/hero-car.jpg";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getErrorMessage = (e: unknown) => {
    if (e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string") {
      return (e as { message: string }).message;
    }
    return null;
  };

  const submitReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email.trim());
      setIsSuccess(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
      });
    } catch (e: unknown) {
      toast({
        title: "Request failed",
        description: getErrorMessage(e) ?? "Could not send reset link.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Background"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        
        {/* Branding / Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-3xl font-extrabold tracking-tight">Automate SA</span>
          </div>
        </div>

        {/* Reset Card */}
        <Card className="w-full max-w-[400px] border-zinc-800 bg-zinc-950/50 backdrop-blur shadow-2xl text-white">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center tracking-tight text-white">Reset Password</CardTitle>
            <CardDescription className="text-center font-medium text-zinc-400">
              {isSuccess 
                ? "Check your email for the reset link" 
                : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="grid gap-5">
                <div className="text-center text-sm text-zinc-300">
                  We've sent an email to <span className="font-bold text-white">{email}</span>. Please follow the instructions in the email to reset your password.
                </div>
                <Button
                  className="w-full h-11 font-bold text-base mt-2 bg-white text-black hover:bg-zinc-200"
                  onClick={() => navigate("/login")}
                >
                  Return to Sign In
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-zinc-400 hover:text-white"
                  onClick={() => setIsSuccess(false)}
                >
                  Try another email
                </Button>
              </div>
            ) : (
              <form onSubmit={submitReset} className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-bold text-zinc-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 h-11 focus-visible:ring-zinc-700"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 font-bold text-base mt-2 bg-white text-black hover:bg-zinc-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Link..." : "Send Reset Link"}
                </Button>
                
                <div className="text-center">
                  <a
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Sign In
                  </a>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        
        {/* Footer Text */}
        <div className="mt-8 text-center text-sm text-zinc-600 font-medium">
          &copy; {new Date().getFullYear()} Automate SA. All rights reserved.
        </div>
      </div>
    </div>
  );
}
