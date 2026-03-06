"use client";
import { useState, useEffect } from "react";
import { ResumeList } from "./ResumeList";
import { MutateResumeSection } from "./MutateResumeSection";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";
type Resume = RouterOutputs["resume"]["getAll"][number];

//Ui Components and Icons
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Spinner } from "~/components/ui/spinner";
import { IoIosAdd } from "react-icons/io";

export function ResumeSection() {
  const [isContainerVisible, setIsContainerVisible] = useState<boolean>(false);
  const { data: resumeData, isLoading, error } = api.resume.getAll.useQuery();
  const [initialData, setInitialData] = useState<Resume>();

  function handleEdit(resume: Resume) {
    setInitialData(resume);
    setIsContainerVisible(true);
  }

  const utils = api.useUtils();


  return (
    <div className="flex h-[85%] w-[80%] flex-col self-center mb-20">
      <>
        <Button
          onClick={() => setIsContainerVisible(true)}
          className="ease h-[40px] w-auto cursor-pointer self-end bg-white text-left text-blue-600 transition-colors duration-[0.2s] hover:bg-blue-600 hover:text-white"
        >
          <IoIosAdd></IoIosAdd>Create new Resume
        </Button>
        {isLoading && (
          <Empty className="w-full">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-blue-500 text-white">
                <Spinner />
              </EmptyMedia>
              <EmptyTitle className="text-blue-500 text-2xl">Loading your resumes</EmptyTitle>
              <EmptyDescription className="text-gray-400">
                Please wait while your resumes are loading. Do not refresh the
                page.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {isContainerVisible && (
          <MutateResumeSection
            initialData={initialData ? initialData : undefined}
            setIsContainerVisible={setIsContainerVisible}
          />
        )}
        <ResumeList onEdit={(resume: Resume) => handleEdit(resume)} resumeData={resumeData} />
      </>
    </div>
  );
}
