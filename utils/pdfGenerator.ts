import jsPDF from "jspdf";

export function downloadPDF(text: string) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Rewritten Output", 20, 20);
  const splitText = doc.splitTextToSize(text, 170);
  doc.text(splitText, 20, 30);
  doc.save("rewritten-output.pdf");
}
