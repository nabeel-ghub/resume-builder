"use client";
import { Button } from "~/components/ui/button";
import { FaFilePdf, FaFileWord, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { generateDocx } from "./generateDocx";


interface MenuProps {
  resumeName: string;
  onPrint: () => void;
  onDocx: () => void;
}

export function DownloadMenu({ resumeName, onPrint, onDocx }: MenuProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-zinc-400 cursor-pointer"
            onClick={() => router.back()}
          > 
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <h2 className="hidden text-sm font-medium text-zinc-200 md:block">
            Viewing: <span className="text-blue-400">{resumeName}</span>
          </h2>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={onDocx}
            className="bg-blue-600 text-white hover:bg-blue-700 h-9 cursor-pointer"
          >
            <FaFileWord className="mr-2" /> DOCX
          </Button>
          <Button 
            onClick={onPrint}
            className="bg-red-600 text-white hover:bg-red-700 h-9 cursor-pointer"
          >
            <FaFilePdf className="mr-2" /> PDF
          </Button>
        </div>
      </div>
    </div>
  );
}