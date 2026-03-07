import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/reducers/authSlice";
import type { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Zap,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
  User,
} from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const resultAction = await dispatch(logout());
    if (logout.fulfilled.match(resultAction)) {
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg ">
      <div className="max-w-8xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Brand Section */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <Zap size={24} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground hidden sm:block">
            Azore Zap
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            // Loading Skeleton
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-4 w-20 bg-muted rounded hidden sm:block" />
              <div className="w-9 h-9 rounded-full bg-muted" />
            </div>
          ) : user ? (
            // Logged In State
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-2 outline-none cursor-pointer rounded-full border border-transparent hover:bg-muted/50 hover:border-border transition-all focus-visible:ring-2 focus-visible:ring-primary">
                  <Avatar className="h-9 w-9 border border-border shadow-sm">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name,
                      )}&background=random&color=fff&bold=true`}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Shows user's first name on desktop */}
                  <span className="hidden md:block text-sm font-semibold text-foreground max-w-25 truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className="hidden md:block text-muted-foreground"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60 p-2 rounded-xl">
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-semibold leading-none text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer py-2.5 rounded-lg text-muted-foreground hover:text-foreground focus:bg-primary/5 focus:text-primary transition-colors"
                >
                  <LayoutDashboard className="mr-2.5 h-4 w-4" />
                  <span className="font-medium">Dashboard</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer py-2.5 rounded-lg text-muted-foreground hover:text-foreground focus:bg-primary/5 focus:text-primary transition-colors">
                  <User className="mr-2.5 h-4 w-4" />
                  <span className="font-medium">My Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer py-2.5 rounded-lg text-muted-foreground hover:text-foreground focus:bg-primary/5 focus:text-primary transition-colors">
                  <Settings className="mr-2.5 h-4 w-4" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer py-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
                >
                  <LogOut className="mr-2.5 h-4 w-4" />
                  <span className="font-medium">Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Guest State
            <div className="flex items-center gap-1 sm:gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="hidden sm:flex text-muted-foreground hover:text-foreground font-medium rounded-full px-5"
              >
                Log in
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="rounded-full px-6 font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
