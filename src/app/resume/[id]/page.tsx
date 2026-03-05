"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { DownloadMenu } from "./_components/DownloadMenu";

export default function ViewResumePage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: resume, isLoading, error } = api.resume.getById.useQuery({ id });

  if (isLoading) return <ResumeSkeleton />;
  if (error) return <div className="text-white text-center mt-20">Resume not found.</div>;
  if (!resume) return null;

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-10 font-sans text-slate-200">
    <DownloadMenu resumeName={resume.name} onPrint={() => window.print()} onDocx={() => {}}></DownloadMenu>
      <div className="max-w-4xl mx-auto bg-white text-black p-8 shadow-2xl rounded-sm">
        
        {/* Header Section */}
        <header className="border-b-2 space-y-3 border-slate-900 pb-4 mb-6 flex flex-col items-center">
          <h1 className="text-5xl font-bold uppercase tracking-tighter">{resume.name}</h1>
          <div className="flex flex-wrap space-y-2 mt-2 w-[500px] justify-center text-xs font-medium text-slate-600">
            <a href={`mailto:${resume.email}`} className="border-r-1 pr-2 border-black">{resume.email}</a>
            <span className="pl-2 pr-2 border-r-1 border-black">{resume.phone}</span>
            <span className="pl-2 pr-2 border-r-1 border-black">{resume.address}</span>
            {resume.linkedin && <a className="pl-2 pr-2" href={resume.linkedin}>LinkedIn</a>}
            {resume.github && <a className="pl-2 pr-2" href={resume.github}>GitHub</a>}
          </div>
        </header>

        {/* Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-bold border-b mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-lg font-bold border-b mb-4">Experience</h2>
          {resume.experiences?.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{exp.title}</h3>
                <span className="text-xs italic">{exp.role}</span>
              </div>
              <p className="text-sm text-slate-700 mt-1">{exp.description}</p>
              <ul className="list-disc ml-5 mt-2 text-xs space-y-1">
                {exp.bullet1 && <li>{exp.bullet1}</li>}
                {exp.bullet2 && <li>{exp.bullet2}</li>}
              </ul>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-bold border-b mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills?.map((skill) => (
              <span key={skill.id} className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                {skill.title}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ResumeSkeleton() {
  return (
    <div className="max-w-4xl mx-auto mt-20 space-y-4">
      <Skeleton className="h-12 w-[300px]" />
      <Skeleton className="h-4 w-[500px]" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}