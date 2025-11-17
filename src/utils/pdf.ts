import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadInvoicePDF = async (
  element: HTMLElement,
  filename: string,
) => {
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const imgWidth = canvas.width * ratio;
  const imgHeight = canvas.height * ratio;
  const marginX = (pageWidth - imgWidth) / 2;

  pdf.addImage(imgData, 'PNG', marginX, 40, imgWidth, imgHeight);
  pdf.save(`${filename}.pdf`);
};

