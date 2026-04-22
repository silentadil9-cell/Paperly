import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Editable } from "@/components/Editable";
import { 
  ArrowLeft, Save, Printer, Undo2, 
  Redo2, Plus, Trash2, Type as TypeIcon, 
  ChevronRight, Wand2, Download, Layers,
  Pencil
} from "lucide-react";
import { 
  PaperContent, PaperSection, PaperQuestion, PaperExtra, 
  calcTotalMarks, createEmptyPaper 
} from "@/lib/paperSchema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PaperEditor() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Try to recover state from location (after generation) or load from local storage
  const [paper, setPaper] = useState<PaperContent>(() => {
    if (location.state?.paper) return location.state.paper;
    
    // Check local storage if we have an ID but no state
    if (id) {
      const saved = localStorage.getItem(`paper_detail_${id}`);
      if (saved) return JSON.parse(saved);
    }

    return createEmptyPaper();
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const totalMarks = useMemo(() => calcTotalMarks(paper), [paper]);

  const addSection = () => {
    setPaper(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: crypto.randomUUID(),
          title: "New Section",
          instructions: "Attempt all questions.",
          questions: [{ id: crypto.randomUUID(), number: String(prev.sections.length + 1), text: "New Question", marks: 5 }]
        }
      ]
    }));
  };

  const removeSection = (sectionId: string) => {
    setPaper(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const addQuestion = (sectionId: string) => {
    setPaper(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { 
              ...s, 
              questions: [...s.questions, { id: crypto.randomUUID(), number: String(s.questions.length + 1), text: "", marks: 1 }] 
            } 
          : s
      )
    }));
  };

  const addOptions = (sectionId: string, questionId: string) => {
    setPaper(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { 
              ...s, 
              questions: s.questions.map(q => q.id === questionId ? { ...q, options: ["Option A", "Option B", "Option C", "Option D"] } : q) 
            } 
          : s
      )
    }));
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    setPaper(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { ...s, questions: s.questions.filter(q => q.id !== questionId) } 
          : s
      )
    }));
  };

  const addExtra = (type: "blank" | "note") => {
    setPaper(prev => ({
      ...prev,
      extras: [
        ...(prev.extras || []),
        { id: crypto.randomUUID(), type, height: 40, text: type === "note" ? "Add a note here..." : undefined }
      ]
    }));
  };

  const removeExtra = (extraId: string) => {
    setPaper(prev => ({
      ...prev,
      extras: (prev.extras || []).filter(e => e.id !== extraId)
    }));
  };

  const formatMathSymbols = () => {
    const format = (text: string) => {
      return text
        .replace(/\^2/g, "²")
        .replace(/\^3/g, "³")
        .replace(/\^1/g, "¹")
        .replace(/\^0/g, "⁰")
        .replace(/\^4/g, "⁴")
        .replace(/\^5/g, "⁵")
        .replace(/\^6/g, "⁶")
        .replace(/\^7/g, "⁷")
        .replace(/\^8/g, "⁸")
        .replace(/\^9/g, "⁹")
        .replace(/\*/g, "×")
        .replace(/\//g, "÷");
    };

    setPaper(prev => ({
      ...prev,
      sections: prev.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({
          ...q,
          text: format(q.text),
          options: q.options?.map(format)
        }))
      }))
    }));
    toast.success("Math symbols standardized (², ×, ÷)");
  };

  const onSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API lag
      await new Promise(r => setTimeout(r, 800));
      
      const savedArtifacts = JSON.parse(localStorage.getItem("paperly_artifacts") || "[]");
      const artifactSummary = {
        id: paper.id,
        title: paper.examTitle,
        subject: paper.subject,
        className: paper.className,
        totalMarks: totalMarks,
        date: new Date().toISOString().split('T')[0],
        type: 'user'
      };

      const existingIndex = savedArtifacts.findIndex((a: any) => a.id === paper.id);
      if (existingIndex > -1) {
        savedArtifacts[existingIndex] = artifactSummary;
      } else {
        savedArtifacts.unshift(artifactSummary);
      }
      
      localStorage.setItem("paperly_artifacts", JSON.stringify(savedArtifacts));
      localStorage.setItem(`paper_detail_${paper.id}`, JSON.stringify(paper));

      toast.success("Artifact Committed to Repository", {
        description: "Your document has been synchronized and archived."
      });
    } catch (error) {
      toast.error("Synchronization failed. Check local storage.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col overflow-hidden">
      {/* Editor Toolbar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-50 no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="size-4" /></Link>
          </Button>
          <div className="h-4 w-px bg-border mx-1"></div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" title="Undo"><Undo2 className="size-4" /></Button>
            <Button variant="ghost" size="icon" title="Redo"><Redo2 className="size-4" /></Button>
            <Button variant="ghost" size="icon" title="Format Math Symbols" onClick={formatMathSymbols}>
              <span className="text-xs font-bold font-mono">x²</span>
            </Button>
          </div>
          <div className="h-4 w-px bg-border mx-1"></div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate max-w-[150px]">
             {paper.examTitle || "Untitled Artifact"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => addExtra("blank")}>
            <Plus className="size-4 mr-2" /> Blank Space
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addExtra("note")}>
            <TypeIcon className="size-4 mr-2" /> Note
          </Button>
          <div className="h-4 w-px bg-border mx-2"></div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-4 mr-2" /> Print
          </Button>
          <Button size="sm" onClick={onSave} disabled={isSaving}>
            <Save className="size-4 mr-2" /> {isSaving ? "Saving..." : "Commit"}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar */}
        <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col py-8 px-6 no-print overflow-y-auto">
          <h3 className="font-serif italic text-lg text-primary mb-6">Attributes</h3>
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <p className="text-[10px] text-muted-foreground uppercase mb-1">Total Marks</p>
              <p className="text-lg font-serif italic text-primary">{totalMarks}</p>
            </div>
            
            <div className="pt-4 space-y-4">
              <p className="text-[10px] text-muted-foreground uppercase">Styling Pattern</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Base Font Size</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPaper(p => ({ ...p, style: { ...p.style, baseFontSize: Math.max(8, p.style.baseFontSize - 1) } }))}>-</Button>
                    <span className="text-xs font-mono w-8 text-center">{paper.style.baseFontSize}px</span>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPaper(p => ({ ...p, style: { ...p.style, baseFontSize: p.style.baseFontSize + 1 } }))}>+</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Text Color</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {["#000000", "#1a1a1a", "#4b5563", "#1e3a8a", "#166534", "#991b1b"].map(c => (
                      <button 
                        key={c}
                        onClick={() => setPaper(p => ({ ...p, style: { ...p.style, textColor: c } }))}
                        className={cn("size-6 rounded-full border border-border transition-transform hover:scale-110", paper.style.textColor === c && "ring-2 ring-primary ring-offset-1 ring-offset-background")}
                        style={{ backgroundColor: c }}
                      />
                    ) )}
                    <input 
                      type="color" 
                      value={paper.style.textColor} 
                      onChange={(e) => setPaper(p => ({ ...p, style: { ...p.style, textColor: e.target.value } }))}
                      className="size-6 rounded-full border-none p-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-background border border-border text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Font Family</span>
                    <button className="text-primary italic" onClick={() => setPaper(p => ({ ...p, style: { ...p.style, font: p.style.font === "sans" ? "serif" : "sans" } }))}>
                      {paper.style.font}
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Header Alignment</span>
                    <button className="text-primary italic" onClick={() => setPaper(p => ({ ...p, style: { ...p.style, headerAlign: p.style.headerAlign === "center" ? "left" : p.style.headerAlign === "left" ? "right" : "center" } }))}>
                      {paper.style.headerAlign}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-2 bg-neutral-200/50 flex justify-center selection:bg-primary/30">
          <div 
            className={cn(
              "a4-page relative shadow-paper animate-in fade-in zoom-in duration-500 origin-top bg-white p-[12mm] w-[210mm] min-h-[297mm]",
              paper.language === "ur" && "paper-urdu"
            )}
            dir={paper.language === "ur" ? "rtl" : "ltr"}
            style={{ 
              color: paper.style.textColor,
              fontSize: `${paper.style.baseFontSize}px`
            }}
          >
            {/* Header section */}
            <header className={cn(
              "pb-4 mb-4 border-b-2 border-black text-center",
              paper.style.headerAlign === "left" && (paper.language === "ur" ? "text-right" : "text-left"),
              paper.style.headerAlign === "right" && (paper.language === "ur" ? "text-left" : "text-right")
            )} style={{ borderColor: paper.style.textColor }}>
              <Editable 
                value={paper.schoolName} 
                onChange={(v) => setPaper(p => ({ ...p, schoolName: v }))} 
                className={cn("font-bold tracking-tight mb-0.5", paper.language === "ur" ? "text-2xl" : "text-xl")}
                placeholder="School Name"
                dir={paper.language === "ur" ? "rtl" : "ltr"}
              />
              <Editable 
                value={paper.examTitle} 
                onChange={(v) => setPaper(p => ({ ...p, examTitle: v }))} 
                className="text-sm font-medium mb-2 opacity-80"
                placeholder="Examination Title"
                dir={paper.language === "ur" ? "rtl" : "ltr"}
              />
              <div className="grid grid-cols-2 text-[11px]">
                <div className={cn("flex gap-4", paper.language === "ur" && "flex-row-reverse")}>
                  <div className="flex gap-1">
                    <span className="font-bold">{paper.language === "ur" ? "مضمون" : "Subject"}:</span>
                    <Editable value={paper.subject} onChange={(v) => setPaper(p => ({ ...p, subject: v }))} placeholder="Subject" />
                  </div>
                  <div className="flex gap-1">
                    <span className="font-bold">{paper.language === "ur" ? "جماعت" : "Class"}:</span>
                    <Editable value={paper.className} onChange={(v) => setPaper(p => ({ ...p, className: v }))} placeholder="Class" />
                  </div>
                </div>
                <div className={cn("flex justify-end gap-4 text-right", paper.language === "ur" && "flex-row-reverse")}>
                  <div className="flex gap-1">
                    <span className="font-bold">{paper.language === "ur" ? "نمبر" : "Marks"}:</span>
                    <span>{totalMarks}</span>
                    <span className="text-[8px] text-muted-foreground no-print">(auto)</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-bold">{paper.language === "ur" ? "وقت" : "Time"}:</span>
                    <Editable value={paper.timeAllowed} onChange={(v) => setPaper(p => ({ ...p, timeAllowed: v }))} placeholder="Time" />
                  </div>
                </div>
              </div>
            </header>

            {/* Questions section */}
            <div className="space-y-4">
              {paper.sections.map((section, sIdx) => (
                <div key={section.id} className="relative group/section">
                  <div className="flex items-center justify-between mb-1 border-b border-current opacity-20">
                    <Editable 
                      value={section.title} 
                      onChange={(v) => setPaper(p => ({
                        ...p,
                        sections: p.sections.map(s => s.id === section.id ? { ...s, title: v } : s)
                      }))}
                      className="font-bold uppercase tracking-wider text-sm"
                      dir={paper.language === "ur" ? "rtl" : "ltr"}
                    />
                    <button 
                      className="no-print opacity-0 group-hover/section:opacity-100 text-zinc-400 hover:text-red-500"
                      onClick={() => removeSection(section.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <Editable 
                    value={section.instructions} 
                    onChange={(v) => setPaper(p => ({
                      ...p,
                      sections: p.sections.map(s => s.id === section.id ? { ...s, instructions: v } : s)
                    }))}
                    className="text-[10px] italic opacity-60 mb-2"
                    dir={paper.language === "ur" ? "rtl" : "ltr"}
                  />

                  <div className="space-y-2">
                    {section.questions.map((q, qIdx) => (
                      <div key={q.id} className="relative group/question">
                        <div className="flex gap-2 items-start">
                          <Editable 
                            value={q.number} 
                            onChange={(v) => setPaper(p => ({
                              ...p,
                              sections: p.sections.map(s => s.id === section.id ? {
                                ...s,
                                questions: s.questions.map(qu => qu.id === q.id ? { ...qu, number: v } : qu)
                              } : s)
                            }))}
                            className="font-bold min-w-[18px] text-[0.9em]"
                            dir={paper.language === "ur" ? "rtl" : "ltr"}
                          />
                          <div className="flex-1">
                            <Editable 
                              value={q.text} 
                              multiline
                              onChange={(v) => setPaper(p => ({
                                ...p,
                                sections: p.sections.map(s => s.id === section.id ? {
                                  ...s,
                                  questions: s.questions.map(qu => qu.id === q.id ? { ...qu, text: v } : qu)
                                } : s)
                              }))}
                              className={cn("leading-tight", paper.language === "ur" ? "text-[1.1em]" : "text-[1em]")}
                              dir={paper.language === "ur" ? "rtl" : "ltr"}
                            />
                            
                            {/* MCQ Options Rendering */}
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 opacity-90">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className={cn("flex gap-2 items-center", paper.language === "ur" && "flex-row-reverse")}>
                                    <span className="text-[0.8em] font-bold opacity-50">({String.fromCharCode(97 + oIdx)})</span>
                                    <Editable 
                                      value={opt}
                                      onChange={(v) => setPaper(p => ({
                                        ...p,
                                        sections: p.sections.map(s => s.id === section.id ? {
                                          ...s,
                                          questions: s.questions.map(qu => qu.id === q.id ? {
                                            ...qu,
                                            options: qu.options?.map((o, idx) => idx === oIdx ? v : o)
                                          } : qu)
                                        } : s)
                                      }))}
                                      className="text-[0.9em]"
                                      dir={paper.language === "ur" ? "rtl" : "ltr"}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-[0.8em] font-bold tabular-nums text-right min-w-[24px]">
                            [{q.marks}]
                          </div>
                        </div>

                        <div className={cn(
                          "absolute top-0 flex gap-1 no-print opacity-0 group-hover/question:opacity-100 transition-opacity",
                          paper.language === "ur" ? "left-[-60px]" : "right-[-60px]"
                        )}>
                           <Button variant="ghost" size="icon" className="size-6 text-zinc-400 hover:text-black" onClick={() => addOptions(section.id, q.id)} title="Add MCQ Options">
                             <Layers className="size-3" />
                           </Button>
                           <button className="p-1 text-zinc-400 hover:text-red-500" onClick={() => removeQuestion(section.id, q.id)}><Trash2 className="size-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="no-print mt-2 border-t border-dashed border-zinc-100 group-hover/section:border-zinc-200 transition-colors pt-2">
                    <button className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black font-bold flex items-center gap-1"
                      onClick={() => addQuestion(section.id)}>
                      <Plus className="size-3" /> Insert Question
                    </button>
                  </div>
                </div>
              ))}

              {/* Extras (Blank Spaces and Notes) */}
              {paper.extras?.map((extra) => (
                <div key={extra.id} className="relative group/extra border border-dashed border-transparent hover:border-zinc-200 transition-colors">
                  {extra.type === "blank" ? (
                    <div style={{ height: `${extra.height}mm` }} className="w-full flex items-center justify-center text-[10px] text-zinc-300 uppercase tracking-widest bg-zinc-50/50">
                       <span className="no-print">Empty Work Area</span>
                    </div>
                  ) : (
                    <div className="py-2 border-y border-zinc-100">
                      <Editable 
                        value={extra.text || ""} 
                        onChange={(v) => setPaper(p => ({
                          ...p,
                          extras: p.extras?.map(e => e.id === extra.id ? { ...e, text: v } : e)
                        }))}
                        className="text-sm italic text-black text-center"
                        multiline
                      />
                    </div>
                  )}
                  <button 
                    className="absolute right-0 top-0 no-print opacity-0 group-hover/extra:opacity-100 text-stone-400 hover:text-red-500 p-1"
                    onClick={() => removeExtra(extra.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <footer className="mt-8 text-center text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-light">
              End of Examination Artifact
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
