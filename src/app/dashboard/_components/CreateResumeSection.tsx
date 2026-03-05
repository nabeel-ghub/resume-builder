"use client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { MdCloseFullscreen } from "react-icons/md";
import { useRef, useState } from "react";
import { SkillSection } from "./SkillSection";
import { Section } from "./Section";
import { set } from "zod";

interface Props {
  setIsContainerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

type skill = {
  id: number;
  title: string;
};

type section = {
  id: string;
  title: string;
  role: string;
  link?: string;
  description: string;
  bullet1: string | null;
  bullet2: string | null;
  bullet3: string | null;
};



export function CreateResumeSection({ setIsContainerVisible }: Props) {
  const [skills, setSkills] = useState<skill[] | null>([]);
  const skillRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<section[] | null>([]);
  const [isAddingProject, setIsAddingProject] = useState<boolean>(false);
  const [experience, setExperience] = useState<section[] | null>([]);
  const [isAddingExperience, setIsAddingExperience] = useState<boolean>(false);
  const [education, setEducation] = useState<section[] | null>([]);
  const [isAddingEducation, setIsAddingEducation] = useState<boolean>(false);
  

  return (
    <form className="ease absolute top-[0] left-[0] flex h-[100vh] w-[100vw] items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-xs transition-all transition-discrete duration-[1s]">
      <Card className="h-[80%] w-[80%] self-center overflow-y-scroll border-[1px] border-gray-600 bg-linear-to-b from-gray-900 to-black shadow-2xl md:p-10">
        <CardHeader className="text-xl font-[500] text-white">
          <div className="flex min-w-[100%] flex-row items-center justify-between">
            <Label className="text-2xl font-[500] text-white">
              Fill in the details
            </Label>
            <Button
              onClick={() => setIsContainerVisible(false)}
              className="ease h-[20px] w-[20px] cursor-pointer rounded-sm bg-white p-3 text-blue-500 transition-colors duration-[0.2s] hover:bg-blue-500 hover:text-white"
            >
              <MdCloseFullscreen size={5}></MdCloseFullscreen>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Label className="mb-2 text-white">Your name:</Label>
          <Input
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your name"
          ></Input>
          <Label className="mb-2 text-white">Your Phone:</Label>
          <Input
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your phone"
            type="number"
          ></Input>
          <Label className="mb-2 text-white">Your Email:</Label>
          <Input
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your email"
            type="email"
          ></Input>
          <Label className="mb-2 text-white">Your address:</Label>
          <Input
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your address"
            type="address"
          ></Input>
          <Label className="mb-2 text-white">Professional Summary:</Label>
          <Textarea
            className="mb-5 min-h-[90px] w-[100%] resize-none rounded-md text-white caret-white"
            placeholder="Enter your professional summary"
          ></Textarea>

          {/* Skills Section */}
          <SkillSection
            skills={skills}
            setSkills={setSkills}
            skillRef={skillRef}
          ></SkillSection>
          <Label className="mb-2 text-white">Links:</Label>
          <Input
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your LinkedIn Address"
          ></Input>
          <Input
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your Github Link"
          ></Input>

          {/* Experience Section */}
          <Section
            section={"experience"}
            sectionArray={experience}
            sectionArraySetterFunction={setExperience}
            isAddingSection={isAddingExperience}
            setIsAddingSection={setIsAddingExperience}
          ></Section>

          {/* Project Section */}
          <Section
            section={"projects"}
            sectionArray={projects}
            sectionArraySetterFunction={setProjects}
            isAddingSection={isAddingProject}
            setIsAddingSection={setIsAddingProject}
          ></Section>

          {/* Education Section */}
          <Section
            section={"education"}
            sectionArray={education}
            sectionArraySetterFunction={setEducation}
            isAddingSection={isAddingEducation}
            setIsAddingSection={setIsAddingEducation}
          ></Section>
        </CardContent>
      </Card>
    </form>
  );
}
