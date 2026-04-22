import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { BookMarked, Search, Plus, Trash2, MoreVertical, Copy, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockQuestions = [
  { id: "1", text: "Explain the process of photosynthesis in detail.", subject: "Biology", level: "9", marks: 10 },
  { id: "2", text: "Solve for x: 2x + 5 = 15.", subject: "Math", level: "10", marks: 5 },
  { id: "3", text: "What are the primary laws of motion according to Newton?", subject: "Physics", level: "9", marks: 8 },
];

export default function QuestionBank() {
  const [search, setSearch] = useState("");

  const handleDelete = (id: string) => {
    toast.success("Question removed from repository.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
             <h2 className="text-4xl font-serif italic text-white mb-2">Question Bank</h2>
             <p className="text-muted-foreground font-light italic">Your centralized repository of curious artifacts and examination items.</p>
          </div>
          
          <div className="flex gap-3">
             <Button size="sm"><Plus className="size-4 mr-2" /> Add Item</Button>
          </div>
        </div>

        <div className="space-y-6">
           <div className="relative group">
              <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Query bank artifacts..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors w-full"
              />
           </div>

           <div className="grid gap-4">
              {mockQuestions.map((q) => (
                <div key={q.id} className="group bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all">
                   <div className="flex items-start gap-6">
                      <div className="size-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-mono text-xs shrink-0">
                         {q.marks}
                      </div>
                      <div className="flex-1 space-y-4">
                         <p className="text-foreground leading-relaxed italic">"{q.text}"</p>
                         <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Tag className="size-3 text-primary" /> {q.subject}</span>
                            <span className="flex items-center gap-1.5"><BookMarked className="size-3 text-primary" /> Class {q.level}</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-2">
                         <Button variant="ghost" size="icon" className="size-8 hover:text-primary" title="Copy to clipboard">
                            <Copy className="size-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="size-8 hover:text-destructive" onClick={() => handleDelete(q.id)}>
                            <Trash2 className="size-4" />
                         </Button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
