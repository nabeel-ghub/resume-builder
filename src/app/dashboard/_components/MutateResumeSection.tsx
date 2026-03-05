"use client";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { MdCloseFullscreen } from "react-icons/md";
import { useRef, useState, type FormEvent } from "react";
import { SkillSection } from "./SkillSection";
import { Section } from "./Section";
import { type RouterOutputs } from "~/trpc/react";
type Resume = RouterOutputs["resume"]["getAll"][number];

interface Props {
  setIsContainerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialData?: Resume;
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

export function MutateResumeSection({ setIsContainerVisible, initialData }: Props) {
  const isEditMode = !!initialData;

  const utils = api.useUtils(); // For cache invalidation
  const createResume = api.resume.create.useMutation({
    onSuccess: () => {
      setIsContainerVisible(false);
    },
  });

  const updateResume = api.resume.update.useMutation({
    onSuccess: () => {
      void utils.resume.getAll.invalidate(); // Refresh the list
      void utils.resume.getById.invalidate({ id: initialData?.id }); // Refresh specific view
      setIsContainerVisible(false);
    },
  });

  //Initialize State with initialData if it exists
  const [skills, setSkills] = useState<skill[]>(initialData?.skills ?? []);
  const [projects, setProjects] = useState<section[]>(initialData?.projects ?? []);
  const [experience, setExperience] = useState<section[]>(initialData?.experiences ?? []);
  const [education, setEducation] = useState<section[]>(initialData?.educations ?? []);

  // Refs for uncontrolled inputs (pre-filled via defaultValue)
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const githubRef = useRef<HTMLInputElement>(null);
  const skillRef = useRef<HTMLInputElement>(null);

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);

  function handleSaveResume(e: React.FormEvent) {
    e.preventDefault();
    
    const payload = {
      name: nameRef.current?.value ?? "",
      phone: phoneRef.current?.value ?? "",
      email: emailRef.current?.value ?? "",
      address: addressRef.current?.value ?? "",
      summary: summaryRef.current?.value ?? "",
      skills: skills,
      linkedin: linkedinRef.current?.value ?? "",
      github: githubRef.current?.value ?? "",
      projects: projects,
      experiences: experience,
      educations: education,
    };

    if (isEditMode) {
      updateResume.mutate({ id: initialData.id, ...payload });
    } else {
      createResume.mutate(payload);
    }
  }

  return (
    <form
      onSubmit={handleSaveResume}
      className="ease absolute top-[0] left-[0] flex h-[100vh] w-[100vw] items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-xs transition-all transition-discrete duration-[1s]"
    >
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

        {/* Content Section */}
        <CardContent>
          <Label className="mb-2 text-white">Your name:</Label>
          <Input
            ref={nameRef}
            defaultValue={initialData?.name}
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your name"
          ></Input>
          <Label className="mb-2 text-white">Your Phone:</Label>
          <Input
            ref={phoneRef}
            defaultValue={initialData?.phone ?? ""}
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your phone"
            type="number"
          ></Input>
          <Label className="mb-2 text-white">Your Email:</Label>
          <Input
            ref={emailRef}
            defaultValue={initialData?.email ?? ""}
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your email"
            type="email"
          ></Input>
          <Label className="mb-2 text-white">Your address:</Label>
          <Input
            ref={addressRef}
            defaultValue={initialData?.address ?? ""}
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your address"
            type="address"
          ></Input>
          <Label className="mb-2 text-white">Professional Summary:</Label>
          <Textarea
            ref={summaryRef}
            defaultValue={initialData?.summary ?? ""}
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
            ref={linkedinRef}
            defaultValue={initialData?.linkedin ?? ""}
            className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
            placeholder="Enter your LinkedIn Address"
          ></Input>
          <Input
            ref={githubRef}
            defaultValue={initialData?.github ?? ""}
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

        <CardFooter className="border-[0] bg-transparent">
          <Button
            type="submit"
            className="mb-20 h-[50px] w-[100%] cursor-pointer bg-blue-500 text-white hover:bg-blue-800 hover:text-white"
          >
            {isEditMode ? "Update" : "Create"} Resume
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
