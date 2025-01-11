import { Plus } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

const AddButton = ({ setIsOpen }: { setIsOpen: any }) => {
  const navigate = useNavigate();
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Plus className="size-8 text-gray-700 hover:bg-slate-300/30 transition-colors cursor-pointer rounded-full p-0.5 shrink-0 active:bg-green-500" />
        </PopoverTrigger>
        <PopoverContent className=" relative h-fit w-48 sm:w-52 md:w-56 lg:w-64 right-10 lg:right-32 bg-black/90 text-white p-0 border-none shadow-md  shadow-green-600/80  ring-1 ring-green-400/80  ">
          <div
            className=" h-full w-full p-2 py-3 hover:bg-white/10 active:bg-green-600/40 transition-colors cursor-pointer select-none font-semibold tracking-wide border-b border-gray-500"
            onClick={() => setIsOpen(true)}
          >
            Join class
          </div>
          <div
            className=" h-full w-full p-2 py-3 hover:bg-white/10 active:bg-green-600/40 transition-colors cursor-pointer select-none font-semibold tracking-wide"
            onClick={() => navigate("/createclass")}
          >
            Create class
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AddButton;
