import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink,
} from "docx";
import { db } from "~/server/db";
import { resumes as resumeTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { env } from "~/env";

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const resumeId = Number(id);
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get("email");

    // 1. Validation: Prevent SQL Injection/Invalid ID crashes
    if (isNaN(resumeId)) {
      return new Response("Invalid ID", { status: 400 });
    }

    const [mainResume] = await db
      .select()
      .from(resumeTable)
      .where(eq(resumeTable.id, resumeId));
    if (!mainResume) return new Response("Resume Not Found", { status: 404 });

    // 2. Data Sanitization: Ensure JSON columns are arrays (prevents .map is not a function)
    const expData = (mainResume.experiences as ResumeEntry[]) || [];
    const skillData = (mainResume.skills as Skill[]) || [];
    const prjData = (mainResume.projects as ResumeEntry[]) || [];
    const eduData = (mainResume.educations as ResumeEntry[]) || [];

    // 3. Document Generation
    const doc = new Document({
      sections: [
        {
          properties: {
            page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
          },
          children: [
            // HEADER (NAME)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: mainResume.name.toUpperCase(),
                  bold: true,
                  size: 70,
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
                // 1. Email Link
                createHyperlink(
                  mainResume.email ?? "Email",
                  `mailto:${mainResume.email}`,
                ),

                // 2. Separator + Phone + Address
                new TextRun({
                  text: `  |  ${mainResume.phone ?? ""}  |  ${mainResume.address ?? ""}  |  `,
                  size: 20,
                  font: "Calibri",
                  color: "000000",
                }),

                // 3. LinkedIn Link
                createHyperlink("LinkedIn", mainResume.linkedin ?? ""),

                new TextRun({ text: "  |  ", size: 20, font: "Calibri" }),

                // 4. Github Link
                createHyperlink("Github", mainResume.github ?? ""),
              ],
            }),

            // SUMMARY
            ...createSection("Professional Summary", [
              new Paragraph({
                children: [
                  new TextRun({
                    text: mainResume.summary || "",
                    size: 22,
                    font: "Calibri",
                    color: "000000",
                  }),
                ],
              }),
            ]),

            // SKILLS
            ...(skillData.length > 0
              ? createSection("Skills", [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: skillData.map((s) => s.title).join(", "),
                        size: 22,
                        font: "Calibri",
                        color: "000000",
                      }),
                    ],
                  }),
                ])
              : []),

            // EXPERIENCE
            ...(expData.length > 0
              ? createSection(
                  "Experience",
                  expData.flatMap((exp) => createEntry(exp)),
                )
              : []),

            // PROJECTS
            ...(prjData.length > 0
              ? createSection(
                  "Projects",
                  prjData.flatMap((prj) => createEntry(prj)),
                )
              : []),

              ...(eduData.length > 0
              ? createSection(
                  "Education",
                  eduData.flatMap((edu) => createEntry(edu)),
                )
              : []),
          ],
        },
      ],
    });

    // --- HELPERS (Encapsulated to prevent scope leakage) ---
    function createSection(title: string, paragraphs: Paragraph[]) {
      return [
        new Paragraph({
          spacing: { before: 300, after: 300 },
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 27,
              font: "Times New Roman",
              color: "000000",
            }),
          ],
        }),
        ...paragraphs,
      ];
    }
    // Helper to create a clickable link
    function createHyperlink(text: string, url: string) {
      return new ExternalHyperlink({
        children: [
          new TextRun({
            text: text,
            style: "Hyperlink", // Standard Word blue/underline style
            color: "0563C1", // Professional blue
            underline: {},
          }),
        ],
        link: url.startsWith("http") ? url : `https://${url}`,
      });
    }

    function createEntry(item: ResumeEntry) {
      const rows: Paragraph[] = [
        new Paragraph({
          spacing: { before: 150, after: 150 },
          children: [
            new TextRun({
              text: item.title || item.company || "",
              bold: true,
              size: 22,
              font: "Calibri",
              color: "000000",
            }),
            new TextRun({
              text: ` - ${item.role || ""}`,
              italics: true,
              size: 18,
              font: "Calibri",
              color: "000000",
            }),
          ],
        }),
        new Paragraph({
            spacing: {before: 150, after: 150},
          children: [
            new TextRun({
              text: item.description || "",
              size: 19,
              font: "Calibri",
              color: "333333",
            }),
          ],
        }),
      ];

      //  Bullet Mapping
      [item.bullet1, item.bullet2, item.bullet3].forEach((bullet) => {
        if (bullet) {
          rows.push(
            new Paragraph({
              spacing: { before: 40 },
              children: [
                new TextRun({
                    size: 18,
                    text: `• ${bullet}`,
                })
              ]
            }),
          );
        }
      });

      return rows;
    }

    const buffer = await Packer.toBuffer(doc);

    const resend = new Resend(env.RESEND_TOKEN);

    /*const data = await resend.emails.send({
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
    });*/

    return new Response(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${mainResume.name.replace(/\s+/g, "_")}_Resume.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX Critical Failure:", error);
    return new Response("Document Generation Failed", { status: 500 });
  }
}
