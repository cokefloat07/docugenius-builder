
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Export as PDF
export const exportToPdf = (content: string, title: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add content
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(content, 170);
  doc.text(splitText, 20, 30);
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
};

// Export as Word Document
export const exportToWord = (content: string, title: string) => {
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            text: '',
          }),
          ...content.split('\n').map(
            (paragraph) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: paragraph,
                    size: 24,
                  }),
                ],
              })
          ),
        ],
      },
    ],
  });

  // Generate and save document
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${title.replace(/\s+/g, '_')}.docx`);
  });
};
