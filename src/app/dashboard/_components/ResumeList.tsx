import { type RouterOutputs } from "~/trpc/react";
type Resume = RouterOutputs["resume"]["getAll"][number];
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import { FaEye } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";

interface ResumeListProps {
    resumeData: Resume[] | undefined;
}

export function ResumeList({resumeData}: ResumeListProps) {
    return(
        <>
        {resumeData?.map((resume) => (
            <Card key={resume.id} className="mt-5 border-gray-700 bg-gray-800 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-blue-500">{resume.name}</h3>
                  <p className="text-sm text-gray-400">Last edited: {format(resume.lastEdited, "PPP")}</p>
                </div>
                <div className="w-[100px] h-[80px] flex flex-row items-center justify-around">
                <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-[40px] h-[40px]"><FiEdit2></FiEdit2></Button>
                <Button onClick={() => window.location.href = `/resume/${resume.id}`} className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-[40px] h-[40px]"><FaEye></FaEye></Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-gray-300">{resume.summary}</p>
              </CardContent>
            </Card>
          ))}
        </>
    )
}