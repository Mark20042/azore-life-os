import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Layout() {
    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}
