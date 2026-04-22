import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Generate from "./pages/Generate";
import PaperEditor from "./pages/PaperEditor";
import QuestionBank from "./pages/QuestionBank";

import Auth from "./pages/Auth";
import Index from "./pages/Index";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/library" element={<Library />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/paper/:id" element={<PaperEditor />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
