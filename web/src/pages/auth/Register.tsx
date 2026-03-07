import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/useAuth";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      },
    );
  };

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-background">
      {/* Left Form Section */}
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md flex flex-col gap-6">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-default-500 hover:text-primary transition-colors no-underline w-fit mb-2"
          >
            <ArrowLeft size={16} /> Back to Home
          </a>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Create Account
            </h1>
          </div>

          <p className="text-default-500 mb-2">
            Sign up to start organizing your life today.
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-foreground">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <UserIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  placeholder="Create a password"
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

            <Button
              className="h-12 text-base font-semibold shadow-lg shadow-primary/30 mt-4"
              type="submit"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <span className="flex items-center gap-2">
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign Up <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-default-500 mt-6 pt-6 border-t border-divider">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in instead
            </a>
          </p>
        </div>
      </div>

      {/* Right Background Section */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-secondary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/5 z-0" />

        {/* Decorative blurred blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-secondary/15 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-16 text-center">
          <div className="w-[460px] h-[300px] bg-background/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-divider/30 p-8 flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
            <div className="flex flex-col gap-4 w-full h-full">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <UserIcon className="text-primary" size={24} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-4 bg-default-300 rounded-md" />
                  <div className="w-20 h-3 bg-default-200 rounded-md" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2 items-center p-3 bg-background/50 rounded-lg border border-divider/30">
                  <div className="w-4 h-4 rounded-full border-2 border-primary" />
                  <div className="w-48 h-3 bg-default-300 rounded-md" />
                </div>
                <div className="flex gap-2 items-center p-3 bg-background/50 rounded-lg border border-divider/30">
                  <div className="w-4 h-4 rounded-full border-2 border-default-300" />
                  <div className="w-36 h-3 bg-default-200 rounded-md" />
                </div>
                <div className="flex gap-2 items-center p-3 bg-background/50 rounded-lg border border-divider/30">
                  <div className="w-4 h-4 rounded-full border-2 border-default-300" />
                  <div className="w-56 h-3 bg-default-200 rounded-md" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-4 text-foreground tracking-tight">
            Take control of your day.
          </h2>
          <p className="text-default-500 text-lg max-w-md leading-relaxed">
            Join thousands of users organizing their tasks and crushing their
            goals with Azore Life OS.
          </p>
        </div>
      </div>
    </div>
  );
}
