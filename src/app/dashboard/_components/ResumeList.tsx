import { type RouterOutputs } from "~/trpc/react";
type Resume = RouterOutputs["resume"]["getAll"][number];
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import { FaEye } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { api } from "~/trpc/react";


interface ResumeListProps {
  resumeData: Resume[] | undefined;
  onEdit: (index: Resume) => void;
}

export function ResumeList({ resumeData, onEdit }: ResumeListProps) {
    const utils = api.useUtils();

    const deleteMutation = api.resume.delete.useMutation({
  onSuccess: () => {
    void utils.resume.getAll.invalidate();
  },
  onError: (err) => {
    alert(err.message);
  }
});

const handleDelete = (id: number) => {
  if (window.confirm("Are you sure you want to delete this resume?")) {
    deleteMutation.mutate({ id });
  }
};

  return (
    <>
      {resumeData?.map((resume) => (
        <Card
          key={resume.id}
          className="mt-5 h-auto border-gray-700 bg-gray-800 text-white"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-blue-500">{resume.name}</h3>
              <p className="text-sm text-gray-400">
                Last edited: {format(resume.lastEdited, "PPP")}
              </p>
            </div>
            <div className="flex h-[80px] w-[80px] flex-row justify-around">
              <Button
                onClick={() => (window.location.href = `/resume/${resume.id}`)}
                className="h-[40px] w-[60px] cursor-pointer bg-white text-blue-600 hover:bg-blue-700 hover:text-white"
              >
                <FaEye></FaEye>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-gray-300">
              {resume.summary}
            </p>
            <div className="mt-5">
              <Button onClick={() => onEdit(resume)} className="h-[40px] w-[60px] cursor-pointer bg-blue-600 hover:bg-blue-700">
                <FiEdit2></FiEdit2>
              </Button>
              <Button onClick={() => handleDelete(resume.id)} variant={"destructive"} className="h-[40px] w-[60px] ml-2 border-[0] hover:border-[1.5px] hover:border-red-600 hover:border-dotted transition-all duration-[0.3s] ease cursor-pointer">
                <AiFillDelete></AiFillDelete>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
