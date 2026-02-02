import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/auth/AuthContext";
import heroImage from "@/assets/hero-car.jpg";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signInWithEmail, user } = useAuth();

  const redirectTo = useMemo(() => {
    const from = (location.state as { from?: string } | null)?.from;
    return from ?? "/portal";
  }, [location.state]);

  const portalTitle = useMemo(() => {
    const from = (location.state as { from?: string } | null)?.from;
    if (from?.startsWith("/ops")) {
      return "Operations/Super Admin Portal";
    }
    return "Admin Portal";
  }, [location.state]);

  // Debug log to ensure portalTitle is defined and calculated
  useEffect(() => {
    console.log("LoginPage mounted. Portal Title:", portalTitle);
  }, [portalTitle]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo, user]);

  const getErrorMessage = (e: unknown) => {
    if (e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string") {
      return (e as { message: string }).message;
    }
    return null;
  };

  const submitEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmail(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (e: unknown) {
      toast({
        title: "Sign in failed",
        description: getErrorMessage(e) ?? "Could not sign in.",
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
          <div className="inline-block rounded-full bg-zinc-800/80 px-3 py-1 text-xs font-semibold text-zinc-400 border border-zinc-700/50">
            {portalTitle}
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-[400px] border-zinc-800 bg-zinc-950/50 backdrop-blur shadow-2xl text-white">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center tracking-tight text-white">Welcome Back</CardTitle>
            <CardDescription className="text-center font-medium text-zinc-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitEmail} className="grid gap-5">
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
              <div className="grid gap-2">
                <Label htmlFor="password" className="font-bold text-zinc-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 text-white h-11 focus-visible:ring-zinc-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 font-bold text-base mt-2 bg-white text-black hover:bg-zinc-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center">
                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
            </form>
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
