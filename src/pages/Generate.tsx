import React, { useState, useMemo, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Loader2, Plus, Wand2, BookOpen, FileText, 
  Image as ImageIcon, ChevronDown, ChevronUp, ArrowRight,
  Layout, History, Layers, Settings
} from "lucide-react";
import { toast } from "sonner";
import { GoogleGenAI, Type } from "@google/genai";
import { PCTB_BOOKS } from "@/lib/pctbData";
import { createEmptyPaper, calcTotalMarks, PaperContent } from "@/lib/paperSchema";
import { cn } from "@/lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SUBJECTS = [
  "Math", "Physics", "Chemistry", "Biology", "English", "Urdu", 
  "Computer Science", "Islamiat", "Pak Studies", "Science", 
  "General Knowledge", "History", "Geography", "Social Studies"
];
const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export default function Generate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"syllabus" | "handwritten">("syllabus");
  const [loading, setLoading] = useState(false);
  
  // Selection state
  const [selectedClass, setSelectedClass] = useState("9");
  const [selectedSubject, setSelectedSubject] = useState("Math");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ur">("en");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [chapterInfo, setChapterInfo] = useState("");
  
  // Style Clone
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [contentImage, setContentImage] = useState<string | null>(null);

  const filteredBooks = useMemo(() => 
    PCTB_BOOKS.filter(b => b.class === selectedClass && b.subject === selectedSubject),
    [selectedClass, selectedSubject]
  );

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: "style" | "content") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "style") setStyleImage(reader.result as string);
        else setContentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `
        You are a curriculum expert for Punjab Board (PCTB). 
        Generate a professional exam paper for Class ${selectedClass} ${selectedSubject} in ${selectedLanguage === "ur" ? "Urdu" : "English"}.
        ${chapterInfo ? `Focus on chapters: ${chapterInfo}` : "Cover the whole book."}
        
        ${contentImage ? "Use the specific questions found in the provided 'content' image." : "Generate fresh, challenging questions based on standard PCTB curriculum levels."}
        ${styleImage ? "Analyze the 'style' image and adopt its font choices, header alignment, and layout density." : ""}

        IMPORTANT MATH SYMBOLS & FORMATTING:
        - NEVER use "^2" or "2^2". Use actual Unicode superscripts like "²" (e.g. 2²). Use these for all powers: ⁰¹²³⁴⁵⁶⁷⁸⁹.
        - NEVER use "*" for multiplication. ALWAYS use "×".
        - NEVER use "/" for division. ALWAYS use "÷".
        - If the language is URDU, ensure all text (School Name, Title, Directions, Questions) is in URDU.

        Return a valid JSON object matching this schema:
        {
          "schoolName": "Government High School",
          "examTitle": "Term Examination 2026",
          "className": "Class ${selectedClass}",
          "subject": "${selectedSubject}",
          "timeAllowed": "3 Hours",
          "language": "${selectedLanguage}",
          "generalInstructions": "Attempt all questions. Write clearly.",
          "sections": [
            {
              "title": "Section A",
              "instructions": "Multiple Choice Questions",
              "questions": [
                { 
                  "number": "1", 
                  "text": "Question text...", 
                  "marks": 1,
                  "options": ["Option A", "Option B", "Option C", "Option D"] 
                }
              ]
            }
          ],
          "style": {
            "font": "serif",
            "headerAlign": "center",
            "borderStyle": "double",
            "instructionsLabel": "General Instructions"
          }
        }
      `;

      const contents: any[] = [{ text: prompt }];
      if (styleImage) {
        contents.push({
          inlineData: {
            mimeType: "image/png",
            data: styleImage.split(",")[1],
          },
        });
      }
      if (contentImage) {
        contents.push({
          inlineData: {
            mimeType: "image/png",
            data: contentImage.split(",")[1],
          },
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: contents },
        config: {
          responseMimeType: "application/json"
        }
      });

      const paperData = JSON.parse(response.text);
      const newPaper = {
        ...createEmptyPaper(),
        ...paperData,
        id: crypto.randomUUID(),
        totalMarks: 0, // will recalc
      };
      newPaper.totalMarks = calcTotalMarks(newPaper);

      // In real app, save to DB. For now, navigate.
      toast.success("Artifact Synchronized Successfully");
      // Simulate ID
      navigate(`/paper/new`, { state: { paper: newPaper } });
    } catch (error) {
      console.error(error);
      toast.error("Generation sequence interrupted. Check integrity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <AppHeader />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Control Rail */}
        <aside className="w-80 border-r border-border bg-card flex flex-col py-8 overflow-y-auto">
          <div className="px-6 space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 font-medium">Source Modality</p>
              <div className="flex gap-2 p-1 bg-secondary rounded-lg border border-border">
                <button 
                  onClick={() => setActiveTab("syllabus")}
                  className={cn(
                    "flex-1 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all",
                    activeTab === "syllabus" ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Syllabus
                </button>
                <button 
                  onClick={() => setActiveTab("handwritten")}
                  className={cn(
                    "flex-1 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all",
                    activeTab === "handwritten" ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Paper Ocr
                </button>
              </div>
            </div>

            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
               <div>
                 <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Level / Class</label>
                 <div className="grid grid-cols-6 gap-1.5">
                   {CLASSES.map(c => (
                     <button 
                       key={c}
                       onClick={() => setSelectedClass(c)}
                       className={cn(
                         "h-8 rounded border transition-all text-[10px] font-mono",
                         selectedClass === c ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-muted-foreground"
                       )}
                     >
                       {c}
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Language</label>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => setSelectedLanguage("en")}
                     className={cn(
                       "flex-1 py-2 rounded border text-[10px] font-bold uppercase tracking-widest transition-all",
                       selectedLanguage === "en" ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground"
                     )}
                   >
                     English
                   </button>
                   <button 
                     onClick={() => setSelectedLanguage("ur")}
                     className={cn(
                       "flex-1 py-2 rounded border text-[10px] font-bold uppercase tracking-widest transition-all",
                       selectedLanguage === "ur" ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground"
                     )}
                   >
                     اردو
                   </button>
                 </div>
               </div>

               <div>
                 <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Subject Domain</label>
                 <select 
                   value={selectedSubject} 
                   onChange={(e) => setSelectedSubject(e.target.value)}
                   className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
                 >
                   {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>

               {activeTab === "syllabus" && (
                 <div className="space-y-4 pt-2 border-t border-border">
                   <div>
                     <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Target Book</label>
                     <select 
                       value={selectedBookId} 
                       onChange={(e) => setSelectedBookId(e.target.value)}
                       className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
                     >
                       <option value="">Whole Curriculum</option>
                       {filteredBooks.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Chapter / Unit Spec</label>
                     <input 
                       type="text" 
                       placeholder="e.g. Unit 1-3, Algebra..."
                       value={chapterInfo}
                       onChange={(e) => setChapterInfo(e.target.value)}
                       className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
                     />
                   </div>
                 </div>
               )}
            </div>

            <div className="pt-8 border-t border-border space-y-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Layout Synchronization</p>
              
              <div className="space-y-4">
                <div className="group relative border border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer text-center">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, "style")} />
                  <Layout className={cn("size-6 mx-auto mb-2", styleImage ? "text-primary" : "text-muted-foreground")} />
                  <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">
                    {styleImage ? "Pattern Loaded" : "Drop Layout Sample"}
                  </p>
                </div>

                <div className="group relative border border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer text-center">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, "content")} />
                  <FileText className={cn("size-6 mx-auto mb-2", contentImage ? "text-primary" : "text-muted-foreground")} />
                  <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">
                    {contentImage ? "Content Artifact Loaded" : "Drop Content Sample"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
               <Button 
                onClick={onGenerate}
                disabled={loading}
                className="w-full h-12 bg-primary text-black rounded-none flex items-center justify-center gap-3 animate-in fade-in duration-700"
               >
                 {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                 Synchronize Artifact
               </Button>
            </div>
          </div>
        </aside>

        {/* Main Interface */}
        <section className="flex-1 flex flex-col bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.05),transparent_40%)] pointer-events-none"></div>
          
          <div className="flex-1 p-12 overflow-y-auto flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-12 animate-in fade-in zoom-in duration-1000">
               <div className="text-center space-y-4">
                 <h2 className="text-4xl font-serif italic text-white underline decoration-primary/30 underline-offset-8">The Generator</h2>
                 <p className="text-muted-foreground font-light max-w-md mx-auto">
                   Select your curriculum parameters on the left rail. Upload artifacts to refine the layout or extract specific questions.
                 </p>
               </div>

               <div className="grid grid-cols-2 gap-8">
                 <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
                   <div className="text-[10px] text-primary uppercase tracking-widest font-bold">Modality A</div>
                   <p className="text-sm text-foreground italic leading-relaxed">
                     Perfect for creating standard board papers from textbooks. Just pick your class and subject.
                   </p>
                 </div>
                 <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
                   <div className="text-[10px] text-primary uppercase tracking-widest font-bold">Modality B</div>
                   <p className="text-sm text-foreground italic leading-relaxed">
                     Ideal for digitizing old question sets. Upload a photo and let the engine extract the logic.
                   </p>
                 </div>
               </div>

               <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-4">
                 <div className="p-2 bg-primary/10 rounded flex items-center justify-center">
                    <History className="size-4 text-primary" />
                 </div>
                 <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                   Ready to generate <span className="text-primary font-bold">Artifact_V2.4</span>
                 </div>
               </div>
            </div>
          </div>

          <footer className="h-12 border-t border-border bg-card flex items-center px-8 text-[10px] uppercase tracking-widest text-[#52525b]">
             <div className="flex gap-8">
               <span>Gemini 3 Flash</span>
               <span className="text-primary italic">Latent Space: Connected</span>
             </div>
             <div className="ml-auto text-primary font-bold">
                Operational
             </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
