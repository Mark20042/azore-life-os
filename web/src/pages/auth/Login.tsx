import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      },
    );
  };

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-background">
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md flex flex-col gap-6">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-default-500 hover:text-primary transition-colors no-underline w-fit mb-2"
          >
            <ArrowLeft size={16} /> Back to Home
          </a>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          </div>

          <p className="text-default-500 mb-2">
            Sign in to your account and get back to your tasks.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-foreground">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-foreground">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  id="password"
                  type={isVisible ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none text-muted-foreground hover:text-foreground transition-colors"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end px-1">
              <a
                href="#"
                className="text-sm text-primary font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button
              className="h-12 text-base font-semibold shadow-lg shadow-primary/30 mt-2"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">Signing in...</span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-default-500 mt-6 pt-6 border-t border-divider">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>

      {/* Right Background Section */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 z-0" />

        {/* Decorative blurred blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/15 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-16 text-center">
          <div className="w-[460px] h-[300px] bg-background/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-divider/30 p-8 flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 rounded-full bg-primary" />
              </div>
              <div className="h-4 w-32 bg-default-200 rounded-md" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="h-3 w-full bg-default-200 rounded-md" />
              <div className="h-3 w-5/6 bg-default-200 rounded-md" />
              <div className="h-3 w-4/6 bg-default-200 rounded-md" />
            </div>
            <div className="flex justify-between items-center mt-auto pt-6 border-t border-divider/50">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-default-200" />
                <div className="w-8 h-8 rounded-full bg-default-200" />
              </div>
              <div className="h-8 w-24 bg-primary/20 rounded-lg" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-4 text-foreground tracking-tight">
            Manage your life, beautifully.
          </h2>
          <p className="text-default-500 text-lg max-w-md leading-relaxed">
            Azore Life OS combines tasks, goals, and habits in one stunning
            interface designed to keep you focused.
          </p>
        </div>
      </div>
    </div>
  );
}
