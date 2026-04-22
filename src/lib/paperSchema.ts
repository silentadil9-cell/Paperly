export type Language = "en" | "ur";

export interface PaperQuestion {
  id: string;
  number: string; // e.g. "1", "1(a)"
  text: string;
  marks: number;
  options?: string[]; // Added for MCQs
}

export interface PaperSection {
  id: string;
  title: string;
  instructions: string;
  questions: PaperQuestion[];
}

export interface PaperExtra {
  id: string;
  type: "blank" | "note";
  height: number; // For blank space in mm
  text?: string; // For notes
}

export interface PaperStyle {
  font: "serif" | "sans";
  headerAlign: "left" | "center" | "right";
  showLogo: boolean;
  borderStyle: "none" | "single" | "double";
  instructionsLabel: string;
  lineSpacing: number;
  textColor: string;
  baseFontSize: number;
}

export interface PaperContent {
  schoolName: string;
  examTitle: string;
  className: string;
  subject: string;
  totalMarks: number; // computed
  timeAllowed: string;
  date: string;
  generalInstructions: string;
  sections: PaperSection[];
  extras?: PaperExtra[]; // Added to allow blank spaces/notes anywhere
  style: PaperStyle;
  language: Language;
}

export const defaultStyle: PaperStyle = {
  font: "sans",
  headerAlign: "center",
  showLogo: false,
  borderStyle: "single",
  instructionsLabel: "General Instructions",
  lineSpacing: 1.5,
  textColor: "#000000",
  baseFontSize: 12,
};

export const createEmptyPaper = (language: Language = "en"): PaperContent => ({
  schoolName: language === "ur" ? "اسکول کا نام" : "School Name",
  examTitle: language === "ur" ? "سالانہ امتحان 2025" : "Annual Examination 2025",
  className: language === "ur" ? "جماعت X" : "Class X",
  subject: language === "ur" ? "مضمون" : "Subject",
  totalMarks: 0,
  timeAllowed: language === "ur" ? "3 گھنٹے" : "3 Hours",
  date: new Date().toLocaleDateString(),
  generalInstructions:
    language === "ur"
      ? "تمام سوالات کے جوابات دیں۔ صاف اور واضح لکھیں۔"
      : "Attempt all questions. Write clearly and legibly.",
  sections: [
    {
      id: crypto.randomUUID(),
      title: language === "ur" ? "حصہ اول" : "Section A",
      instructions: language === "ur" ? "تمام سوالات کے جوابات دیں۔" : "Answer all questions.",
      questions: [
        { id: crypto.randomUUID(), number: "1", text: "", marks: 5 },
      ],
    },
  ],
  extras: [],
  style: defaultStyle,
  language,
});

export const calcTotalMarks = (paper: PaperContent): number =>
  paper.sections.reduce(
    (sum, s) => sum + s.questions.reduce((q, x) => q + (Number(x.marks) || 0), 0),
    0
  );
