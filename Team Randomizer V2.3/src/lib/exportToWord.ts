import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export async function exportToWord(groups: string[][], customNames?: string[]): Promise<void> {
  const children: Paragraph[] = [
    new Paragraph({
      text: "Hasil Pembagian Kelompok",
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: `Tanggal: ${new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`,
      spacing: { after: 400 },
    }),
  ];

  groups.forEach((group, index) => {
    const groupName = customNames?.[index]?.trim() || `Kelompok ${index + 1}`;
    children.push(
      new Paragraph({
        text: groupName,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 },
      })
    );
    
    group.forEach((name, nameIndex) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${nameIndex + 1}. ${name}` }),
          ],
          spacing: { after: 100 },
        })
      );
    });
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'hasil-kelompok.docx');
}
