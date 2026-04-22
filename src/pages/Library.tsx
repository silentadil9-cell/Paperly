import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { PCTB_BOOKS } from "@/lib/pctbData";
import { BookOpen, Search, Download, Trash2, Filter, Grid, List as ListIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Library() {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredBooks = PCTB_BOOKS.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                         b.subject.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "all" || b.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleSync = (bookId: string) => {
    toast.success(`Synchronizing book metadata: ${bookId}`, {
      description: "Book assets added to local archive."
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
             <h2 className="text-4xl font-serif italic text-white mb-2">PCTB Repository</h2>
             <p className="text-muted-foreground font-light italic">Access official curriculum artifacts and synchronized textbook data.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search repository..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors w-full md:w-64"
              />
            </div>
            
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground"
            >
              <option value="all">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {filteredBooks.map(book => (
             <div key={book.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all duration-500 hover:shadow-soft">
                <div className="aspect-[3/4] bg-secondary relative overflow-hidden flex items-center justify-center p-8">
                   <div className="absolute inset-0 bg-[#000] opacity-20 group-hover:opacity-10 transition-opacity"></div>
                   <div className="relative z-10 text-center space-y-4">
                      <div className="size-16 rounded-2xl bg-background border border-border flex items-center justify-center text-primary mx-auto group-hover:rotate-6 transition-transform shadow-xl">
                        <BookOpen className="size-8" />
                      </div>
                      <div className="bg-primary/20 text-primary text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full inline-block">
                         Official PCTB Artifact
                      </div>
                   </div>
                </div>
                
                <div className="p-6 space-y-4">
                   <div className="space-y-1">
                      <h3 className="text-lg font-serif italic text-white line-clamp-2">{book.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <span>Class {book.class}</span>
                        <span className="size-1 bg-border rounded-full"></span>
                        <span>{book.subject}</span>
                      </div>
                   </div>
                   
                   <div className="pt-4 flex items-center justify-between border-t border-border">
                      <Button variant="ghost" size="icon" className="group-hover:text-primary" onClick={() => handleSync(book.id)}>
                        <Download className="size-4" />
                      </Button>
                      <div className="flex items-center gap-2 text-emerald-500/80 group-hover:text-emerald-400 transition-colors">
                        <ShieldCheck className="size-3" />
                        <span className="text-[10px] uppercase tracking-tighter">Verified</span>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}
