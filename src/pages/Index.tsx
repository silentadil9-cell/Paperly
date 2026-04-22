import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, BookOpen, Layers, Wand2 } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <nav className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="font-serif italic text-xl text-primary tracking-tight">Paperly</h1>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">Sign In</Link>
          <Button asChild size="sm" className="bg-primary text-black hover:bg-primary/90 text-[10px] font-bold uppercase tracking-widest px-4 h-8 rounded">
            <Link to="/generate">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] text-primary uppercase tracking-widest font-medium">
              <Sparkles className="size-3" /> AI-Powered Exam Engine
            </div>
            
            <h2 className="text-5xl md:text-7xl font-serif italic text-white leading-[1.1]">
              Crafting Excellence, <br />
              <span className="text-primary italic">One Paper at a Time.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-light">
              Transform PCTB curriculum books and handwritten notes into perfectly formatted examination papers. Cloak your questions in professional board-style layouts with a single click.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary text-black hover:bg-primary/90 text-xs font-bold uppercase tracking-widest px-8 h-12 rounded-none">
                <Link to="/generate">Generate Now <ArrowRight className="size-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/5 text-xs font-bold uppercase tracking-widest px-8 h-12 rounded-none">
                <Link to="/library">Explore Library</Link>
              </Button>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
            {/* Visual mockup of the editor */}
            <div className="aspect-[4/5] bg-card border border-border rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 group-hover:bg-primary/20 transition-colors duration-500"></div>
              
              <div className="text-center border-b border-border pb-6 mb-8">
                <div className="font-serif italic text-primary text-lg mb-2">Government High School</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Term Examination 2026</div>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="h-3 w-12 bg-muted rounded"></div>
                      <div className="h-3 w-8 bg-primary/20 rounded"></div>
                    </div>
                    <div className="h-4 w-full bg-secondary/50 rounded"></div>
                    <div className="h-4 w-2/3 bg-secondary/50 rounded"></div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-6 -right-6 bg-[#141414] border border-border p-4 rounded-xl shadow-xl animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded bg-primary/20 flex items-center justify-center">
                  <Layers className="size-4 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase">Storage</div>
                  <div className="text-sm font-serif italic text-primary">128 Artifacts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mt-40 grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<FileText className="size-5" />}
            title="Style Cloning"
            description="Extract layout patterns from any paper photo. Font weights, spacing, and header styles synchronized automatically."
          />
          <FeatureCard 
            icon={<Wand2 className="size-5" />}
            title="Intelligent Extraction"
            description="OCR handwritten questions and convert them into digital assets while preserving your custom formatting."
          />
          <FeatureCard 
            icon={<BookOpen className="size-5" />}
            title="PCTB Library"
            description="Direct access to Punjab Curriculum books. Select chapters and generate standardized questions instantly."
          />
        </section>
      </main>

      <footer className="h-32 border-t border-border bg-card flex flex-col items-center justify-center px-8 text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="flex gap-8 mb-4">
          <span className="hover:text-primary transition-colors cursor-pointer">Archive</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Contact</span>
        </div>
        <p className="opacity-50">© 2026 Paperly — Sophisticated Document Engineering</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <div className="group space-y-4 p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-serif italic text-white">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed italic">{description}</p>
    </div>
  );
}
