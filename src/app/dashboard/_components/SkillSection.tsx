import { AnimatePresence, motion } from "framer-motion";
import { IoIosAdd } from "react-icons/io";
import { Label} from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type skill = {
  id: number;
  title: string;
};

interface SkillSectionProps {
  skills: skill[] | null;
  setSkills: React.Dispatch<React.SetStateAction<skill[] | null>>;
  skillRef: React.RefObject<HTMLInputElement | null>;
}


export function SkillSection({skills, setSkills, skillRef}: SkillSectionProps) {

  function addSkill() {
    if (!skillRef.current) return;
    if (skillRef.current.value.trim().length <= 0) {
      skillRef.current.value = "";
      return;
    }
    const currentSkillValue = skillRef.current.value;
    setSkills((prev) => {
      const existingSkills = prev || [];
      if (existingSkills.length >= 10) {
        return existingSkills;
      }
      return [
        ...existingSkills,
        { id: Date.now(), title: currentSkillValue },
      ];
    });
    skillRef.current.value = "";
  }

  function removeSkill(index: number) {
    setSkills((prev) => {
      if(!prev) return [];
      return prev.filter((p) => p.id !== index);
    });
  }

  return (
    <>
      <Label className="mb-2 text-white">Skills (Upto 10):</Label>
      <div className="mb-5 flex flex-row flex-wrap">
        <>
          <AnimatePresence>
            {skills?.map((skill, index) => (
              <motion.input
                key={skill.id}
                name={`skill-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => removeSkill(skill.id)}
                onFocus={() => removeSkill(skill.id)}
                defaultValue={skill.title}
                className="mr-3 mb-2 flex h-8 w-32 cursor-pointer items-center justify-center rounded-md border-[1.5px] border-dotted border-blue-500 bg-transparent pr-5 pl-5 text-white hover:border-red-600 hover:text-red-600"
              >
              </motion.input>
            ))}
          </AnimatePresence>
          <div className="flex flex-row flex-nowrap">
            <Input
              ref={skillRef}
              placeholder="Enter skill"
              className="h-8 w-32 rounded-r-[0] text-white caret-blue-500 shadow-[0]"
            ></Input>
            <Button
              onClick={() => addSkill()}
              className="h-8 w-8 cursor-pointer rounded-l-[0] bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
              type="button"
            >
              <IoIosAdd></IoIosAdd>
            </Button>
          </div>
        </>
      </div>
    </>
  );
}
