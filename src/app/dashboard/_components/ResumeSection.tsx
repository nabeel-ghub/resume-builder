"use client";
import { useState, useEffect } from "react";
import { ResumeList } from "./ResumeList";
import { Button } from "~/components/ui/button";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { CreateResumeSection } from "./CreateResumeSection";

export function ResumeSection() {
  const [isContainerVisible, setIsContainerVisible] = useState<boolean>(false);

  return (
    <div className="flex h-[85%] w-[80%] flex-col self-center">
      <>
        <Button onClick={() => setIsContainerVisible(true)} className="h-[40px] w-auto cursor-pointer self-end hover:bg-blue-500 hover:text-white text-left bg-white text-blue-500 transition-colors duration-[0.2s] ease"><IoIosAdd></IoIosAdd>Create new Resume</Button>
        {isContainerVisible && <CreateResumeSection setIsContainerVisible={setIsContainerVisible} />}
        <ResumeList />
      </>
    </div>
  );
}
