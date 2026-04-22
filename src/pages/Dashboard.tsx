import { useState, useMemo, ReactNode, useEffect, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Search, MoreVertical, Clock, Filter, Trash2, Sparkles, ShieldCheck, UserPlus, Mail, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Static templates for all users
const boardTemplates = [
  { id: "board-1", title: "Official Lahore Board Model Paper", subject: "Math", class: "9", totalMarks: 75, date: "2025-12-01", type: "template" },
  { id: "board-2", title: "Federal Board Science Specimen", subject: "Science", class: "8", totalMarks: 50, date: "2025-11-15", type: "template" },
  { id: "board-3", title: "Official Multan Board Pattern", subject: "Chemistry", class: "10", totalMarks: 85, date: "2026-01-20", type: "template" },
];

export default function Dashboard() {
  const [userPapers, setUserPapers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "recent" | "templates" | "admin">("all");
  const [role, setRole] = useState<string | null>(null);

  // Admin states
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  useEffect(() => {
    // Load state
    const saved = localStorage.getItem("paperly_artifacts");
    if (saved) setUserPapers(JSON.parse(saved));
    
    setRole(localStorage.getItem("paperly_role"));

    const users = JSON.parse(localStorage.getItem("paperly_users") || "[]");
    setRegisteredUsers(users);
  }, []);

  const registerUser = (e: FormEvent) => {
    e.preventDefault();
    const users = [...registeredUsers];
    if (users.find((u: any) => u.email === regEmail)) {
      toast.error("User already exists");
      return;
    }
    users.push({ email: regEmail, password: regPass });
    localStorage.setItem("paperly_users", JSON.stringify(users));
    setRegisteredUsers(users);
    toast.success("New user synced to system");
    setRegEmail("");
    setRegPass("");
  };

  const deleteUser = (email: string) => {
    const updated = registeredUsers.filter(u => u.email !== email);
    localStorage.setItem("paperly_users", JSON.stringify(updated));
    setRegisteredUsers(updated);
    toast.success("User removed from system");
  };

  const allPapers = useMemo(() => [
    ...userPapers.map(p => ({ ...p, type: "user" })),
    ...boardTemplates
  ], [userPapers]);

  const filteredPapers = useMemo(() => {
    let result = allPapers.filter(p => 
      (p.title?.toLowerCase() || "").includes(search.toLowerCase()) || 
      (p.subject?.toLowerCase() || "").includes(search.toLowerCase())
    );
    
    if (activeCategory === "recent") {
      // Recent shows both templates and user papers sorted by date
      result = [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
    } else if (activeCategory === "templates") {
      result = boardTemplates.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.subject.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      // "All Documents" shows ONLY user-created artifacts
      result = userPapers.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return result;
  }, [userPapers, search, activeCategory, allPapers]);

  const deletePaper = (id: string) => {
    const updated = userPapers.filter(p => p.id !== id);
    setUserPapers(updated);
    localStorage.setItem("paperly_artifacts", JSON.stringify(updated));
    toast.success("Artifact removed from repository.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 border-r border-border bg-card hidden md:flex flex-col py-8 px-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6 font-medium">Collections</p>
          <nav className="space-y-1">
            <SidebarItem 
              label="My Artifacts" 
              icon={<FileText className="size-4" />} 
              active={activeCategory === "all"} 
              onClick={() => setActiveCategory("all")}
            />
            <SidebarItem 
              label="Recent Activity" 
              icon={<Clock className="size-4" />} 
              active={activeCategory === "recent"} 
              onClick={() => setActiveCategory("recent")}
            />
            <SidebarItem 
              label="Board Templates" 
              icon={<Filter className="size-4" />} 
              active={activeCategory === "templates"} 
              onClick={() => setActiveCategory("templates")}
            />

            {role === "admin" && (
              <div className="pt-4 mt-4 border-t border-border">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2 font-bold">Administration</p>
                <SidebarItem 
                  label="Manage Users" 
                  icon={<ShieldCheck className="size-4" />} 
                  active={activeCategory === "admin"} 
                  onClick={() => setActiveCategory("admin")}
                />
              </div>
            )}
          </nav>

          <div className="mt-auto pt-8 border-t border-border">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <Sparkles className="size-5 text-primary mx-auto mb-2" />
              <p className="text-[9px] uppercase tracking-widest text-primary font-bold">Priority Support</p>
              <p className="text-[10px] text-muted-foreground mt-1 underline decoration-primary/30">Connect to Server</p>
            </div>
          </div>
        </aside>

        {/* content */}
        <section className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-6 md:p-12 space-y-8 max-w-5xl mx-auto w-full">
            {activeCategory === "admin" ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h2 className="text-3xl font-serif italic text-white mb-2">Admin Command Center</h2>
                  <p className="text-sm text-muted-foreground italic font-light">Manage paid licenses and access credentials for Paperly.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                      <div className="flex items-center gap-3 text-primary">
                        <UserPlus className="size-5" />
                        <h3 className="font-serif italic text-xl">Register Participant</h3>
                      </div>
                      
                      <form onSubmit={registerUser} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">User Access Email</label>
                          <div className="relative">
                            <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                            <input className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="teacher@school.com" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Assigned Password</label>
                          <div className="relative">
                            <Key className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                            <input className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50" value={regPass} onChange={(e) => setRegPass(e.target.value)} required placeholder="••••••••" />
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-12 bg-primary text-black font-bold uppercase tracking-widest text-[10px] rounded-none">
                           Establish Identity
                        </Button>
                      </form>
                   </div>

                   <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                      <div className="flex items-center gap-3 text-primary">
                        <ShieldCheck className="size-5" />
                        <h3 className="font-serif italic text-xl">Authorized Users</h3>
                      </div>

                      <div className="space-y-3">
                         {registeredUsers.length === 0 ? (
                           <p className="text-sm text-muted-foreground italic text-center py-8">No paid users currently in archive.</p>
                         ) : (
                           registeredUsers.map(user => (
                             <div key={user.email} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border group">
                                <div>
                                  <p className="text-xs text-white font-medium">{user.email}</p>
                                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Pass: {user.password}</p>
                                </div>
                                <button onClick={() => deleteUser(user.email)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                                  <Trash2 className="size-4" />
                                </button>
                             </div>
                           ))
                         )}
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-serif italic text-white mb-2">
                       {activeCategory === 'templates' ? 'Board Templates' : activeCategory === 'recent' ? 'Recent Activity' : 'My Artifacts'}
                    </h2>
                    <p className="text-sm text-muted-foreground italic font-light">Manage and organize your examination repositories.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative group">
                      <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search archives..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors w-full md:w-64"
                      />
                    </div>
                    {role === "admin" && (
                      <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5" onClick={() => setActiveCategory("admin")}>
                        <ShieldCheck className="size-4 mr-2" /> Admin Panel
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <Link to="/generate"><Plus className="size-4 mr-2" /> Create Artifact</Link>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {filteredPapers.map((paper) => (
                    <div key={paper.id} className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-soft flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          {paper.type === 'template' ? <Filter className="size-5" /> : <FileText className="size-5" />}
                        </div>
                        {paper.type !== 'template' && (
                          <button className="text-muted-foreground hover:text-destructive" onClick={() => deletePaper(paper.id)}>
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                      
                      <Link to={`/paper/${paper.id}`} className="block space-y-2 flex-grow">
                        <h3 className="text-lg font-serif italic text-white group-hover:text-primary transition-colors line-clamp-2">
                          {paper.title || paper.examTitle}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                          <span>Class {paper.class || paper.className}</span>
                          <span className="text-primary/30">|</span>
                          <span>{paper.subject}</span>
                        </div>
                      </Link>

                      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                        <div className="text-[10px] text-muted-foreground font-mono uppercase">
                          {paper.totalMarks} Marks
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {paper.date}
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeCategory === "all" && filteredPapers.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <div className="size-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                        <FileText className="size-10 text-muted-foreground opacity-20" />
                       </div>
                       <h3 className="text-xl font-serif italic text-white">No user artifacts found</h3>
                       <p className="text-sm text-muted-foreground max-w-xs mx-auto italic">
                         You haven't generated any papers yet. Use the Artifact Engine to create your first exam.
                       </p>
                       <Button asChild>
                         <Link to="/generate"><Plus className="size-4 mr-2" /> Start Generating</Link>
                       </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarItem({ label, icon, active = false, onClick }: { label: string, icon: ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer group",
        active ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <span className={cn(
        "transition-transform group-hover:scale-110",
        active ? "text-primary" : "text-muted-foreground"
      )}>
        {icon}
      </span>
      <span className={cn(active ? "font-medium" : "font-light")}>{label}</span>
      {active && <div className="ml-auto w-1 h-1 bg-primary rounded-full"></div>}
    </div>
  );
}
