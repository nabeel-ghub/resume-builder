"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { DownloadMenu } from "./_components/DownloadMenu";

type section = {
  id: string;
  title: string;
  role: string;
  link?: string;
  description: string;
  bullet1: string | null;
  bullet2: string | null;
  bullet3: string | null;
}

export default function ViewResumePage() {
  const params = useParams();
  const id = Number(params.id);

  const {
    data: resume,
    isLoading,
    error,
  } = api.resume.getById.useQuery({ id });

  if (isLoading) return <ResumeSkeleton />;
  if (error || !resume)
    return (
      <div className="mt-20 text-center text-white">Resume not found.</div>
    );

    function handlePrint() {
        window.location.href = `/api/pdf/${id}?email=${resume?.email}`;
    }

    function handleDocx() {
        window.location.href = `/api/docx/${id}?email=${resume?.email}`;
    }

  return (
    //Main Wrapper
    <div className="resume-ready flex min-h-screen w-full flex-col items-center bg-zinc-950 p-4 font-sans text-slate-200 md:p-10 print:bg-white print:p-0">
      <div className="no-print mb-6 w-full max-w-[800px]">
        <DownloadMenu
          resumeName={resume.name}
          onPrint={() => handlePrint()}
          onDocx={() => handleDocx()}
        />
      </div>

      <div className="mx-auto min-h-[1132px] w-full max-w-[800px] rounded-sm bg-white p-6 text-black shadow-2xl md:p-12 print:m-0 print:max-w-none print:rounded-none print:shadow-none">
        {/* Header Section */}
        <header className="mb-6 flex flex-col items-center space-y-3 border-b-2 border-slate-900 pb-4">
          <h1 className="text-center text-3xl font-bold tracking-tighter uppercase md:text-5xl">
            {resume.name}
          </h1>
          <div className="mt-2 flex w-full flex-wrap justify-center gap-x-2 gap-y-1 text-center text-[10px] font-medium text-slate-600 md:text-xs">
            <a
              href={`mailto:${resume.email}`}
              className="border-r border-black pr-2"
            >
              {resume.email}
            </a>
            <span className="border-r border-black pr-2 pl-1">
              {resume.phone}
            </span>
            <span
              className={
                resume.linkedin || resume.github
                  ? "border-r border-black pr-2 pl-1"
                  : "pl-1"
              }
            >
              {resume.address}
            </span>
            {resume.linkedin && (
              <a
                className="border-r border-black pr-2 pl-1"
                href={resume.linkedin}
              >
                LinkedIn
              </a>
            )}
            {resume.github && (
              <a className="pl-1" href={resume.github}>
                GitHub
              </a>
            )}
          </div>
        </header>

        {/* Summary */}
        <section className="mb-8">
          <h2 className="mb-2 border-b text-lg font-bold">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </section>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-2 border-b text-lg font-bold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-semibold md:text-xs"
                >
                  {skill.title}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Content Lists */}
        {resume.experiences && (
          <ResumeSection title="Experience" items={resume.experiences} />
        )}
        {resume.projects && (
          <ResumeSection title="Projects" items={resume.projects} />
        )}
        {resume.educations && (
          <ResumeSection title="Education" items={resume.educations} />
        )}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0 !important;
          }
          html,
          body {
            background-color: white !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

type ResumeSectionProps = { title: string; items: section[] };
function ResumeSection({ title, items }: ResumeSectionProps) {
  if (!items || items.length === 0) return <div className="mb-8"><h2 className="mb-4 border-b text-lg font-bold">{title}</h2><p className="text-sm text-muted-foreground">No items available.</p></div>;
  return (
    <section className="mb-8">
      <h2 className="mb-4 border-b text-lg font-bold">{title}</h2>
      {items.map((item) => (
        <div key={item.id} className="mb-4 break-inside-avoid">
          <div className="flex flex-col justify-between md:flex-row md:items-baseline">
            <h3 className="font-bold">{item.title}</h3>
            <span className="text-[10px] italic md:text-xs">{item.role}</span>
          </div>
          <p className="mt-1 text-sm text-slate-700">{item.description}</p>
          <ul className="mt-2 ml-5 list-disc space-y-1 text-xs">
            {item.bullet1 && <li>{item.bullet1}</li>}
            {item.bullet2 && <li>{item.bullet2}</li>}
          </ul>
        </div>
      ))}
    </section>
  );
}

function ResumeSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-10">
      {/* Skeleton for the Top Menu */}
      <div className="mx-auto mb-6 flex max-w-[800px] justify-end">
        <Skeleton className="h-10 w-40 bg-zinc-800" />
      </div>

      {/* Skeleton for the A4 Paper */}
      <div className="mx-auto w-full max-w-[800px] bg-white p-8 shadow-2xl md:p-16">
        {/* Header Skeleton */}
        <div className="mb-10 flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-64 bg-slate-200" />
          <Skeleton className="h-4 w-80 bg-slate-100" />
        </div>

        {/* Summary Skeleton */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-6 w-32 bg-slate-200" />
          <Skeleton className="h-4 w-full bg-slate-100" />
          <Skeleton className="h-4 w-full bg-slate-100" />
          <Skeleton className="h-4 w-3/4 bg-slate-100" />
        </div>

        {/* Experience Section Skeleton */}
        <div className="mb-8 space-y-6">
          <Skeleton className="h-6 w-32 bg-slate-200" />

          {/* Job Item 1 */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-48 bg-slate-100" />
              <Skeleton className="h-4 w-24 bg-slate-50" />
            </div>
            <Skeleton className="h-4 w-full bg-slate-50" />
            <Skeleton className="h-3 w-1/2 bg-slate-50" />
          </div>

          {/* Job Item 2 */}
          <div className="space-y-3 pt-4">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-40 bg-slate-100" />
              <Skeleton className="h-4 w-24 bg-slate-50" />
            </div>
            <Skeleton className="h-4 w-full bg-slate-50" />
          </div>
        </div>

        {/* Education Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 bg-slate-200" />
          <Skeleton className="h-4 w-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
