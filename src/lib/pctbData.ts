export interface PCTBBook {
  id: string;
  class: string;
  subject: string;
  title: string;
  url?: string;
}

export const PCTB_BOOKS: PCTBBook[] = [
  // Class 1
  { id: "p1-math", class: "1", subject: "Math", title: "Mathematics Class 1" },
  { id: "p1-eng", class: "1", subject: "English", title: "English Class 1" },
  { id: "p1-urdu", class: "1", subject: "Urdu", title: "Urdu Class 1" },
  { id: "p1-gk", class: "1", subject: "General Knowledge", title: "General Knowledge Class 1" },
  
  // Class 2
  { id: "p2-math", class: "2", subject: "Math", title: "Mathematics Class 2" },
  { id: "p2-eng", class: "2", subject: "English", title: "English Class 2" },
  { id: "p2-urdu", class: "2", subject: "Urdu", title: "Urdu Class 2" },
  { id: "p2-gk", class: "2", subject: "General Knowledge", title: "General Knowledge Class 2" },

  // Class 3
  { id: "p3-math", class: "3", subject: "Math", title: "Mathematics Class 3" },
  { id: "p3-eng", class: "3", subject: "English", title: "English Class 3" },
  { id: "p3-urdu", class: "3", subject: "Urdu", title: "Urdu Class 3" },
  { id: "p3-gk", class: "3", subject: "General Knowledge", title: "General Knowledge Class 3" },
  { id: "p3-sci", class: "3", subject: "Science", title: "General Science Class 3" },

  // Class 4
  { id: "p4-math", class: "4", subject: "Math", title: "Mathematics Class 4" },
  { id: "p4-eng", class: "4", subject: "English", title: "English Class 4" },
  { id: "p4-urdu", class: "4", subject: "Urdu", title: "Urdu Class 4" },
  { id: "p4-sci", class: "4", subject: "Science", title: "General Science Class 4" },
  { id: "p4-ss", class: "4", subject: "Social Studies", title: "Social Studies Class 4" },

  // Class 5
  { id: "p5-math", class: "5", subject: "Math", title: "Mathematics Class 5" },
  { id: "p5-eng", class: "5", subject: "English", title: "English Class 5" },
  { id: "p5-urdu", class: "5", subject: "Urdu", title: "Urdu Class 5" },
  { id: "p5-sci", class: "5", subject: "Science", title: "General Science Class 5" },
  { id: "p5-ss", class: "5", subject: "Social Studies", title: "Social Studies Class 5" },

  // Class 6
  { id: "p6-math", class: "6", subject: "Math", title: "Mathematics Class 6" },
  { id: "p6-eng", class: "6", subject: "English", title: "English Class 6" },
  { id: "p6-urdu", class: "6", subject: "Urdu", title: "Urdu Class 6" },
  { id: "p6-sci", class: "6", subject: "Science", title: "General Science Class 6" },
  { id: "p6-hist", class: "6", subject: "History", title: "History Class 6" },
  { id: "p6-geo", class: "6", subject: "Geography", title: "Geography Class 6" },
  { id: "p6-it", class: "6", subject: "Computer Science", title: "Computer Education Class 6" },

  // Class 7
  { id: "p7-math", class: "7", subject: "Math", title: "Mathematics Class 7" },
  { id: "p7-eng", class: "7", subject: "English", title: "English Class 7" },
  { id: "p7-urdu", class: "7", subject: "Urdu", title: "Urdu Class 7" },
  { id: "p7-sci", class: "7", subject: "Science", title: "General Science Class 7" },
  { id: "p7-hist", class: "7", subject: "History", title: "History Class 7" },
  { id: "p7-geo", class: "7", subject: "Geography", title: "Geography Class 7" },
  { id: "p7-it", class: "7", subject: "Computer Science", title: "Computer Education Class 7" },

  // Class 8
  { id: "p8-math", class: "8", subject: "Math", title: "Mathematics Class 8" },
  { id: "p8-eng", class: "8", subject: "English", title: "English Class 8" },
  { id: "p8-urdu", class: "8", subject: "Urdu", title: "Urdu Class 8" },
  { id: "p8-sci", class: "8", subject: "Science", title: "General Science Class 8" },
  { id: "p8-hist", class: "8", subject: "History", title: "History Class 8" },
  { id: "p8-geo", class: "8", subject: "Geography", title: "Geography Class 8" },
  { id: "p8-it", class: "8", subject: "Computer Science", title: "Computer Education Class 8" },

  // Class 9
  { id: "p9-math-en", class: "9", subject: "Math", title: "Mathematics Class 9 (English)" },
  { id: "p9-math-ur", class: "9", subject: "Math", title: "ریاضی نہم (Urdu)" },
  { id: "p9-phy-en", class: "9", subject: "Physics", title: "Physics Class 9 (English)" },
  { id: "p9-phy-ur", class: "9", subject: "Physics", title: "فزکس نہم (Urdu)" },
  { id: "p9-chem-en", class: "9", subject: "Chemistry", title: "Chemistry Class 9 (English)" },
  { id: "p9-bio-en", class: "9", subject: "Biology", title: "Biology Class 9 (English)" },
  { id: "p9-cs-en", class: "9", subject: "Computer Science", title: "Computer Science Class 9" },
  { id: "p9-urdu", class: "9", subject: "Urdu", title: "Urdu Class 9" },
  { id: "p9-eng", class: "9", subject: "English", title: "English Class 9" },
  { id: "p9-is", class: "9", subject: "Islamiat", title: "Islamiat Class 9" },
  
  // Class 10
  { id: "p10-math-en", class: "10", subject: "Math", title: "Mathematics Class 10 (English)" },
  { id: "p10-math-ur", class: "10", subject: "Math", title: "ریاضی دہہم (Urdu)" },
  { id: "p10-phy-en", class: "10", subject: "Physics", title: "Physics Class 10 (English)" },
  { id: "p10-chem-en", class: "10", subject: "Chemistry", title: "Chemistry Class 10 (English)" },
  { id: "p10-bio-en", class: "10", subject: "Biology", title: "Biology Class 10 (English)" },
  { id: "p10-cs-en", class: "10", subject: "Computer Science", title: "Computer Science Class 10" },
  { id: "p10-ps", class: "10", subject: "Pak Studies", title: "Pak Studies Class 10" },
  
  // Class 11 (FSc Part 1)
  { id: "p11-math-en", class: "11", subject: "Math", title: "Mathematics Part 1" },
  { id: "p11-phy-en", class: "11", subject: "Physics", title: "Physics Part 1" },
  { id: "p11-chem-en", class: "11", subject: "Chemistry", title: "Chemistry Part 1" },
  { id: "p11-bio-en", class: "11", subject: "Biology", title: "Biology Part 1" },
  { id: "p11-cs-en", class: "11", subject: "Computer Science", title: "Computer Science Part 1" },
  { id: "p11-is", class: "11", subject: "Islamiat", title: "Islamiat Compulsory Part 1" },
  { id: "p11-eng", class: "11", subject: "English", title: "English Book 1 & 3" },
  
  // Class 12 (FSc Part 2)
  { id: "p12-math-en", class: "12", subject: "Math", title: "Mathematics Part 2" },
  { id: "p12-phy-en", class: "12", subject: "Physics", title: "Physics Part 2" },
  { id: "p12-chem-en", class: "12", subject: "Chemistry", title: "Chemistry Part 2" },
  { id: "p12-bio-en", class: "12", subject: "Biology", title: "Biology Part 2" },
  { id: "p12-cs-en", class: "12", subject: "Computer Science", title: "Computer Science Part 2" },
  { id: "p12-ps", class: "12", subject: "Pak Studies", title: "Pak Studies Compulsory Part 2" },
  { id: "p12-urdu", class: "12", subject: "Urdu", title: "Sarmaya-e-Urdu Part 2" },
];
