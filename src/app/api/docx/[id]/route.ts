import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, HeadingLevel } from "docx";
import { db } from "~/server/db";
import { resumes as resumeTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { env } from "process";

// --- TYPE DEFINITIONS (Vulnerability Check: Prevents 'any' related crashes) ---
interface ResumeEntry {
  title?: string;
  company?: string;
  role?: string;
  location?: string;
  date?: string;
  description?: string;
  bullet1?: string;
  bullet2?: string;
  bullet3?: string;
}

interface Skill {
  title: string;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const resumeId = Number(id);
    const {searchParams} = new URL(req.url);
    const targetEmail = searchParams.get("email");

    // 1. Validation: Prevent SQL Injection/Invalid ID crashes
    if (isNaN(resumeId)) {
      return new Response("Invalid ID", { status: 400 });
    }

    const [mainResume] = await db.select().from(resumeTable).where(eq(resumeTable.id, resumeId));
    if (!mainResume) return new Response("Resume Not Found", { status: 404 });

    // 2. Data Sanitization: Ensure JSON columns are arrays (prevents .map is not a function)
    const expData = (mainResume.experiences as ResumeEntry[]) || [];
    const skillData = (mainResume.skills as Skill[]) || [];
    const prjData = (mainResume.projects as ResumeEntry[]) || [];
    const eduData = (mainResume.educations as ResumeEntry[]) || [];

    // 3. Document Generation
    const doc = new Document({
      sections: [{
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } }
        },
        children: [
          // HEADER (NAME)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: mainResume.name.toUpperCase(),
                bold: true,
                size: 36,
                font: "Times New Roman",
                color: "000000",
              }),
            ],
          }),

          // CONTACT INFO
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `${mainResume.email ?? ""}  |  ${mainResume.phone?? ""}  |  ${mainResume.address ?? ""}`,
                size: 20,
                font: "Calibri",
                color: "000000",
              }),
            ],
          }),

          // SUMMARY
          ...createSection("Professional Summary", [
            new Paragraph({
              children: [new TextRun({ text: mainResume.summary || "", size: 22, font: "Calibri", color: "000000" })],
            }),
          ]),

          // SKILLS
          ...(skillData.length > 0 ? createSection("Skills", [
            new Paragraph({
              children: [
                new TextRun({
                  text: skillData.map(s => s.title).join(", "),
                  size: 20,
                  font: "Calibri",
                  color: "000000",
                }),
              ],
            }),
          ]) : []),

          // EXPERIENCE
          ...(expData.length > 0 ? createSection("Experience", 
            expData.flatMap(exp => createEntry(exp))
          ) : []),

          // PROJECTS
          ...(prjData.length > 0 ? createSection("Projects", 
            prjData.flatMap(prj => createEntry(prj))
          ) : []),
        ],
      }],
    });

    // --- HELPERS (Encapsulated to prevent scope leakage) ---

    function createSection(title: string, paragraphs: Paragraph[]) {
      return [
        new Paragraph({
          spacing: { before: 300, after: 100 },
          border: {
            bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 },
          },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 24,
              font: "Times New Roman",
              color: "000000",
            }),
          ],
        }),
        ...paragraphs,
      ];
    }

    function createEntry(item: ResumeEntry) {
      const rows: Paragraph[] = [
        new Paragraph({
          spacing: { before: 150 },
          children: [
            new TextRun({ text: item.title || item.company || "", bold: true, size: 22, font: "Calibri", color: "000000" }),
            new TextRun({ text: `\t${item.role || ""}`, italics: true, size: 20, font: "Calibri", color: "000000" }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: item.description || "", size: 20, font: "Calibri", color: "333333" })],
        }),
      ];

      // Sanitized Bullet Mapping
      [item.bullet1, item.bullet2, item.bullet3].forEach(bullet => {
        if (bullet) {
          rows.push(new Paragraph({
            text: `• ${bullet}`,
            spacing: { before: 40 },
          }));
        }
      });

      return rows;
    }

    const buffer = await Packer.toBuffer(doc);

     const resend = new Resend(env.RESEND_TOKEN);

    const data = await resend.emails.send({
      from: 'Resume Builder <onboarding@resend.dev>',
      to: [targetEmail ?? ""],
      subject: 'Your Professional Resume from Resume Builder',
      html: '<strong>Attached is your professional resume generated by ResumeBuilder.</strong>',
      attachments: [
        {
          filename: 'resume.docx',
          content: Buffer.from(buffer), // The Puppeteer output
        },
      ],
    });
    

    return new Response(Buffer.from(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${mainResume.name.replace(/\s+/g, '_')}_Resume.docx"`,
      },
    });

  } catch (error) {
    console.error("DOCX Critical Failure:", error);
    return new Response("Document Generation Failed", { status: 500 });
  }
}