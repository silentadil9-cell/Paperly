// Client-side PDF text extraction using pdfjs-dist.
// Uses the bundled worker via Vite's `?url` import so it works in the browser.
import * as pdfjsLib from "pdfjs-dist";
// Note: In some environments workerSrc might need to be resolved differently.
// Using a standard CDN fallback for the worker if the URL import isn't handled by the bundler.
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromPdf(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise;
  const parts: string[] = [];
  const maxPages = Math.min(pdf.numPages, 80); // safety cap
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it: any) => ("str" in it ? it.str : "")).filter(Boolean);
    parts.push(strings.join(" "));
  }
  return parts.join("\n\n").replace(/\s+\n/g, "\n").trim();
}
