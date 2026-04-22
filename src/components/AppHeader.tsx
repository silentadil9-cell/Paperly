import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText, Wand2, BookOpen, BookMarked, Menu, LogOut, User as UserIcon, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/dashboard", label: "Papers", icon: FileText },
  { to: "/generate", label: "Generator", icon: Wand2 },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/question-bank", label: "Bank", icon: BookMarked },
];

export const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("paperly_auth");
    navigate("/");
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-8 bg-card sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to={localStorage.getItem("paperly_auth") ? "/dashboard" : "/"} className="flex items-center gap-2">
          <h1 className="font-serif italic text-xl text-primary tracking-tight">Paperly</h1>
        </Link>
        <nav className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "hover:text-foreground transition-colors cursor-pointer",
                  isActive && "text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {localStorage.getItem("paperly_role") === "admin" && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded border border-primary/50 bg-primary/5 text-[10px] text-primary uppercase tracking-widest font-bold">
            <ShieldCheck className="size-3" /> Admin Authority
          </div>
        )}
        <div className="hidden sm:block px-3 py-1 rounded border border-border text-[10px] text-muted-foreground uppercase tracking-tighter">
          System Synchronized
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             <Menu className="size-5" />
           </Button>
           
           <div 
             onClick={handleSignOut}
             title="Sign Out"
             className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center cursor-pointer hover:border-destructive/50 transition-colors group"
           >
            <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-destructive animate-pulse"></div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-card border-b border-border p-4 md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "py-2 hover:text-foreground transition-colors",
                  location.pathname === link.to && "text-primary font-bold"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <button onClick={handleSignOut} className="flex items-center gap-2 py-2 text-destructive">
                <LogOut className="size-4" /> Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
