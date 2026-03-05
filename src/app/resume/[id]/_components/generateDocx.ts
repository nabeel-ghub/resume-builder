import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle,  
} from "docx";
import { saveAs } from "file-saver";

export const generateDocx = async (resume: any) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // NAME 
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: resume.name.toUpperCase(),
                bold: true,
                size: 36,
                font: "Times New Roman",
              }),
            ],
          }),

          // CONTACT INFO 
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${resume.email}  |  ${resume.phone}  |  ${resume.address}`,
                size: 20, // 10pt
                font: "Calibri",
              }),
            ],
          }),

          // SUMMARY
          ...createSection("Professional Summary", [
            new Paragraph({
              children: [new TextRun({ text: resume.summary, size: 22, font: "Calibri" })],
            }),
          ]),

          // SKILLS
          ...(resume.skills?.length > 0 ? createSection("Skills", [
            new Paragraph({
              children: [
                new TextRun({
                  text: resume.skills.map((s: any) => s.title).join(", "),
                  size: 20,
                  font: "Calibri",
                }),
              ],
            }),
          ]) : []),

          // EXPERIENCE
          ...(resume.experiences?.length > 0 ? createSection("Experience", 
            resume.experiences.flatMap((exp: any) => createEntry(exp))
          ) : []),

          // PROJECTS
          ...(resume.projects?.length > 0 ? createSection("Projects", 
            resume.projects.flatMap((prj: any) => createEntry(prj))
          ) : []),

          // EDUCATION
          ...(resume.educations?.length > 0 ? createSection("Education", 
            resume.educations.flatMap((ed: any) => createEntry(ed))
          ) : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${resume.name.replace(/\s+/g, "_")}_Resume.docx`);
};

//Creates a section with a bold heading and a bottom border
function createSection(title: string, children: Paragraph[]): any[] {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 100 },
      border: {
        bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24,
          font: "Times New Roman",
        }),
      ],
    }),
    ...children,
  ];
}

//Creates a standard entry (Title, Role, Description, Bullets)
function createEntry(item: any): Paragraph[] {
  const paragraphs = [
    new Paragraph({
      spacing: { before: 200 },
      children: [
        new TextRun({ text: item.title, bold: true, size: 22, font: "Calibri" }),
        new TextRun({ text: `\t${item.role}`, italics: true, size: 20, font: "Calibri" }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: item.description, size: 20, font: "Calibri", color: "444444" })],
    }),
  ];

  if (item.bullet1) {
    paragraphs.push(new Paragraph({ text: item.bullet1, bullet: { level: 0 }}));
  }
  if (item.bullet2) {
    paragraphs.push(new Paragraph({ text: item.bullet2, bullet: { level: 0 }}));
  }

  return paragraphs;
}