"use client";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { AiFillDelete } from "react-icons/ai";

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

interface ProjectSectionProps {
  section: string;
  sectionArray: section[] | null;
  sectionArraySetterFunction: React.Dispatch<React.SetStateAction<section[]>>;
  isAddingSection: boolean;
  setIsAddingSection: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Section({
  section,
  sectionArray,
  sectionArraySetterFunction,
  isAddingSection,
  setIsAddingSection,
}: ProjectSectionProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const bullet1Ref = useRef<HTMLInputElement>(null);
  const bullet2Ref = useRef<HTMLInputElement>(null);
  const bullet3Ref = useRef<HTMLInputElement>(null);

  function addSection() {
    if (section === "projects") {
      if (
        !titleRef.current ||
        !roleRef.current ||
        !linkRef.current ||
        !descriptionRef.current ||
        !bullet1Ref.current ||
        !bullet2Ref.current ||
        !bullet3Ref.current ||
        titleRef.current.value.trim().length <= 0 ||
        roleRef.current.value.trim().length <= 0 ||
        linkRef.current.value.trim().length <= 0 ||
        descriptionRef.current.value.trim().length <= 0
      ) {
        return setIsAddingSection(false);
      }
    } else {
      if (
        !titleRef.current ||
        !roleRef.current ||
        !descriptionRef.current ||
        !bullet1Ref.current ||
        !bullet2Ref.current ||
        !bullet3Ref.current ||
        titleRef.current.value.trim().length <= 0 ||
        roleRef.current.value.trim().length <= 0 ||
        descriptionRef.current.value.trim().length <= 0
      ) {
        return setIsAddingSection(false);
      }
    }

    const titleValue = titleRef.current.value;
    const roleValue = roleRef.current.value;
    let linkValue: string | null = null;
    if (section === "projects" && linkRef.current) {
      linkValue = linkRef.current.value;
    }
    const descriptionValue = descriptionRef.current.value;
    const bullet1Value = bullet1Ref.current.value || null;
    const bullet2Value = bullet2Ref.current.value || null;
    const bullet3Value = bullet3Ref.current.value || null;

    sectionArraySetterFunction((prev) => {
      const existingProjects = prev || [];
      if (existingProjects.length >= 3) {
        return existingProjects;
      }
      if (section === "projects" && linkValue) {
        return [
          ...existingProjects,
          {
            id: `${section} ${Date.now()}`,
            title: titleValue,
            role: roleValue,
            link: linkValue,
            description: descriptionValue,
            bullet1: bullet1Value,
            bullet2: bullet2Value,
            bullet3: bullet3Value,
          },
        ];
      } else {
        return [
          ...existingProjects,
          {
            id: `${section} ${Date.now()}`,
            title: titleValue,
            role: roleValue,
            description: descriptionValue,
            bullet1: bullet1Value,
            bullet2: bullet2Value,
            bullet3: bullet3Value,
          },
        ];
      }
    });

    titleRef.current.value = "";
    roleRef.current.value = "";
    if (section === "projects" && linkRef.current) {
      linkRef.current.value = "";
    }
    descriptionRef.current.value = "";
    setIsAddingSection(false);
  }

  function removeSection(index: string) {
    sectionArraySetterFunction((prev) => {
      if (!prev) return [];
      return prev.filter((item) => {
        return item.id !== index;
      });
    });
  }

  function handleChangeInputs(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    reference: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
    id?: string,
  ) {
    if (!reference.current) return;
    sectionArraySetterFunction((prev) => {
      if (!prev) return [];
      return prev.map((item) => {
        if (!reference.current) return item;
        if (item.id === id) {
          return {
            ...item,
            [reference.current.name]: reference.current.value,
          };
        } else {
          return item;
        }
      });
    });
  }

  return (
    <>
      <Label className="mb-2 text-white">
        {`${section.charAt(0).toUpperCase()}${section.slice(1).toLowerCase()}`}{" "}
        (Upto 3):
      </Label>
      <div>
        {isAddingSection ? (
          <>
            <Input
              placeholder={`Enter your ${section} title`}
              className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
              ref={titleRef}
            ></Input>
            <Input
              placeholder={`Enter your ${section === "education" ? "degree" : "role"}`}
              className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
              ref={roleRef}
            ></Input>
            {section === "projects" && (
              <Input
                placeholder="Enter your project link"
                className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
                ref={linkRef}
              ></Input>
            )}
            <Textarea
              placeholder={`Provide ${section} description`}
              className="mb-5 min-h-[90px] w-[100%] resize-none rounded-md text-white caret-white"
              ref={descriptionRef}
            ></Textarea>
            <Input
              placeholder="Enter bullet 1"
              className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
              ref={bullet1Ref}
            ></Input>
            <Input
              placeholder="Enter bullet 2"
              className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
              ref={bullet2Ref}
            ></Input>
            <Input
              placeholder="Enter bullet 3"
              className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
              ref={bullet3Ref}
            ></Input>
            <Button
              onClick={() => addSection()}
              className="mb-20 h-[40px] w-[100%] cursor-pointer bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
              type="button"
            >
              Save {section}
            </Button>
          </>
        ) : (
          <>
            <div className="mb-5 flex flex-row flex-wrap">
              <AnimatePresence>
                {sectionArray?.map((currSection, index) => (
                  <motion.div
                    key={currSection.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-auto w-[100%] flex-col"
                  >
                    <div className="mt-3 mb-2 flex w-[100%] flex-row items-center justify-between">
                      <Label className="text-md font-[700] text-blue-500">
                        {`${section.charAt(0).toUpperCase()}${section.slice(1).toLowerCase()} ${index + 1}`}
                      </Label>
                      <Button
                        onClick={() => removeSection(currSection.id)}
                        variant={"destructive"}
                        className="cursor-pointer"
                        type="button"
                      >
                        <span className="text-red-600">
                          <AiFillDelete></AiFillDelete>
                        </span>
                      </Button>
                    </div>
                    <Input
                      className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
                      defaultValue={currSection.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChangeInputs(e, titleRef, currSection.id)
                      }
                      ref={titleRef}
                      name="title"
                    ></Input>
                    <Input
                      className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
                      defaultValue={currSection.role}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChangeInputs(e, roleRef, currSection.id)
                      }
                      ref={roleRef}
                      name="role"
                    ></Input>
                    {currSection.link && (
                      <Input
                        className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
                        defaultValue={currSection.link}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChangeInputs(e, linkRef)
                        }
                        ref={linkRef}
                        name="link"
                      ></Input>
                    )}
                    <Textarea
                      className="mb-5 min-h-[90px] w-[100%] resize-none rounded-md text-white caret-white"
                      defaultValue={currSection.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleChangeInputs(e, descriptionRef)
                      }
                      ref={descriptionRef}
                      name="description"
                    ></Textarea>
                    {currSection.bullet1 && (
                      <Input
                        className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
                        defaultValue={currSection.bullet1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChangeInputs(e, bullet1Ref)
                        }
                        ref={bullet1Ref}
                        name="bullet1"
                      ></Input>
                    )}
                    {currSection.bullet2 && (
                      <Input
                        className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
                        defaultValue={currSection.bullet2}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChangeInputs(e, bullet2Ref)
                        }
                        ref={bullet2Ref}
                        name="bullet2"
                      ></Input>
                    )}
                    {currSection.bullet3 && (
                      <Input
                        className="mb-5 h-[35px] w-[100%] rounded-md text-white caret-white"
                        defaultValue={currSection.bullet3}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChangeInputs(e, bullet3Ref)
                        }
                        ref={bullet3Ref}
                        name="bullet3"
                      ></Input>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button
              onClick={() => setIsAddingSection(true)}
              className="mb-20 h-[40px] w-[100%] cursor-pointer bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
              type="button"
            >
              Add new {section}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
