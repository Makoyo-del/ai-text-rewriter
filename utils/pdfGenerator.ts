import html2pdf from "html2pdf.js";

export function downloadPDF(content: string) {
  const element = document.createElement("div");
  element.innerHTML = 
    <h1 style="text-align: center; font-size: 24px;">Rewritten Text</h1>
    <p style="white-space: pre-line; font-size: 16px;"></p>
  ;

  const opt = {
    margin:       0.5,
    filename:     'rewritten-text.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  html2pdf().set(opt).from(element).save();
}
