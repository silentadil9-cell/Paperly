import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Sparkles, Wand2, ArrowRight, MessageCircle, UserPlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const ADMIN_EMAIL = "adilrehmanadil67@gmail.com";

export default function Auth() {
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      // Admin check
      if (email === ADMIN_EMAIL) {
        localStorage.setItem("paperly_auth", "true");
        localStorage.setItem("paperly_user_email", email);
        localStorage.setItem("paperly_role", "admin");
        toast.success("Admin Authority Granted");
        navigate("/dashboard");
        return;
      }

      // Check registered users in local storage
      const users = JSON.parse(localStorage.getItem("paperly_users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("paperly_auth", "true");
        localStorage.setItem("paperly_user_email", email);
        localStorage.setItem("paperly_role", "user");
        toast.success("Identity Authenticated");
        navigate("/dashboard");
      } else {
        toast.error("Access Denied. Invalid Credentials or Unpaid Account.");
      }
    }, 1000);
  };

  const registerUser = (e: FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("paperly_users") || "[]");
    if (users.find((u: any) => u.email === regEmail)) {
      toast.error("User already exists in repository");
      return;
    }
    users.push({ email: regEmail, password: regPass });
    localStorage.setItem("paperly_users", JSON.stringify(users));
    toast.success("User successfully registered in system");
    setRegEmail("");
    setRegPass("");
    setIsAdminMode(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background selection:bg-primary/30">
      {/* Left: Form */}
      <div className="flex items-center justify-center p-8 md:p-24 overflow-y-auto">
        <div className="w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="size-5" />
              </div>
              <span className="font-serif italic text-xl text-white">Paperly</span>
            </Link>
            {/* Hidden Admin Trigger: Double click logo to toggle reg form if already admin email entered? No, let's just use a state for Admin Reg */}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-serif italic text-white leading-tight">
              {isAdminMode ? "Register New Artifact User" : "Welcome Back to the Paperly"}
            </h1>
            <p className="text-sm text-muted-foreground font-light italic">
              {isAdminMode ? "Authorized Administrator" : "Sign in to access your professional board examination engine."}
            </p>
          </div>

          {isAdminMode ? (
            <form onSubmit={registerUser} className="space-y-6">
               <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">New User Email</label>
                  <input className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Generated Password</label>
                  <input className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors" value={regPass} onChange={(e) => setRegPass(e.target.value)} required />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 h-12 bg-emerald-600 text-white hover:bg-emerald-700 rounded-none">
                  <UserPlus className="size-4 mr-2" /> Register User
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdminMode(false)} className="h-12 rounded-none">Cancel</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Access Email</label>
                  <input className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors" type="email" placeholder="user@paperly.ai" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
                  <input className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-3">
                <Button type="submit" className="w-full h-12 bg-primary text-black rounded-none flex items-center justify-center gap-3" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  Sign In
                </Button>
              </div>
            </form>
          )}

          <div className="pt-8 border-t border-border space-y-4 font-light text-center">
            <h3 className="text-xl font-serif italic text-white leading-tight">Gain access to Paperly</h3>
            <p className="text-xs text-muted-foreground italic">
              Paperly is a premium board examination tool. Contact the administrator to activate your license and receive your secure credentials.
            </p>
            <div className="flex flex-col gap-2">
              <a 
                href="https://wa.me/923043416129" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 h-12 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle className="size-4" /> 
                WhatsApp: 923043416129
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Immersive Visual */}
      <div className="hidden lg:flex flex-col bg-card border-l border-border relative overflow-hidden p-24 items-center justify-center">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>

         <div className="relative z-10 w-full max-w-md space-y-12 text-center animate-in fade-in zoom-in duration-1000">
            <div className="bg-[#141414] border border-border p-12 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
               <div className="size-20 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mx-auto mb-8 animate-pulse">
                  <FileText className="size-10" />
               </div>
               <h3 className="text-2xl font-serif italic text-white mb-4 italic">Paperly Premium Engine</h3>
               <p className="text-sm text-muted-foreground leading-relaxed italic">
                 "Professional examination papers, engineered for Pakistani Boards. High-speed generation with human-grade formatting accuracy."
               </p>
            </div>

            <div className="flex items-center justify-center gap-12 text-muted-foreground">
               <div className="text-center">
                  <div className="text-2xl font-serif italic text-primary">100%</div>
                  <div className="text-[8px] uppercase tracking-widest">Board Standard</div>
               </div>
               <div className="h-8 w-px bg-border"></div>
               <div className="text-center">
                  <div className="text-2xl font-serif italic text-primary">24/7</div>
                  <div className="text-[8px] uppercase tracking-widest">Admin Support</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
