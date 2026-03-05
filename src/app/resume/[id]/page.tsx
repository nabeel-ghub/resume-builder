"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { DownloadMenu } from "./_components/DownloadMenu";
import { generateDocx } from "./_components/generateDocx";

export default function ViewResumePage() {
  const params = useParams();
  const id = Number(params.id);

  const {
    data: resume,
    isLoading,
    error,
  } = api.resume.getById.useQuery({ id });

  if (isLoading) return <ResumeSkeleton />;
  if (error)
    return (
      <div className="mt-20 text-center text-white">Resume not found.</div>
    );
  if (!resume) return null;

  return (
    <div className="min-h-screen bg-zinc-950 p-4 font-sans text-slate-200 md:p-10">
      <DownloadMenu
        resumeName={resume.name}
        onPrint={() => window.print()}
        onDocx={() => generateDocx(resume)}
      ></DownloadMenu>
      <div className="mx-auto max-w-4xl rounded-sm bg-white p-8 text-black shadow-2xl">
        {/* Header Section */}
        <header className="mb-6 flex flex-col items-center space-y-3 border-b-2 border-slate-900 pb-4">
          <h1 className="text-5xl font-bold tracking-tighter uppercase">
            {resume.name}
          </h1>
          <div className="mt-2 flex w-[500px] flex-wrap justify-center space-y-2 text-xs font-medium text-slate-600">
            <a
              href={`mailto:${resume.email}`}
              className="border-r-1 border-black pr-2"
            >
              {resume.email}
            </a>
            <span className="border-r-1 border-black pr-2 pl-2">
              {resume.phone}
            </span>
            <span className="border-r-1 border-black pr-2 pl-2">
              {resume.address}
            </span>
            {resume.linkedin && (
              <a className="pr-2 pl-2" href={resume.linkedin}>
                LinkedIn
              </a>
            )}
            {resume.github && (
              <a className="pr-2 pl-2" href={resume.github}>
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
              {resume.skills?.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded border border-slate-200 bg-slate-100 px-2 py-1 text-xs"
                >
                  {skill.title}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {resume.experiences && resume.experiences.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 border-b text-lg font-bold">Experience</h2>
            {resume.experiences?.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold">{exp.title}</h3>
                  <span className="text-xs italic">{exp.role}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{exp.description}</p>
                <ul className="mt-2 ml-5 list-disc space-y-1 text-xs">
                  {exp.bullet1 && <li>{exp.bullet1}</li>}
                  {exp.bullet2 && <li>{exp.bullet2}</li>}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 border-b text-lg font-bold">Projects</h2>
            {resume.projects.map((prj) => (
              <div key={prj.id} className="mb-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold">{prj.title}</h3>
                  <span className="text-xs italic">{prj.role}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{prj.description}</p>
                <ul className="mt-2 ml-5 list-disc space-y-1 text-xs">
                  {prj.bullet1 && <li>{prj.bullet1}</li>}
                  {prj.bullet2 && <li>{prj.bullet2}</li>}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {resume.educations && resume.educations.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 border-b text-lg font-bold">Education</h2>
            {resume.educations.map((ed) => (
              <div key={ed.id} className="mb-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold">{ed.title}</h3>
                  <span className="text-xs italic">{ed.role}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{ed.description}</p>
                <ul className="mt-2 ml-5 list-disc space-y-1 text-xs">
                  {ed.bullet1 && <li>{ed.bullet1}</li>}
                  {ed.bullet2 && <li>{ed.bullet2}</li>}
                </ul>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function ResumeSkeleton() {
  return (
    <div className="mx-auto mt-20 flex max-w-4xl flex-col space-y-4">
      <Skeleton className="h-12 w-[300px] self-center" />
      <Skeleton className="h-4 w-[500px] self-center" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
