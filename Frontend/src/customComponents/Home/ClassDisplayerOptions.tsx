import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MoreVertical } from "lucide-react";
import { memo } from "react";
import { toast } from "react-toastify";

const ClassDisplayerOptions = memo(
  ({ classID, className }: { classID: string; className?: string }) => {
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/class/leaveclass/${classID}`, {
          method: "POST",
        });
        const data = await res.json();

        return data;
      },
      onSuccess(data) {
        if ("error" in data) return toast.error(data.error);
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["classes"] });
      },
    });
    return (
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="rounded-full p-1 h-fit w-fit  hover:bg-white/20 ">
              <MoreVertical
                className={cn(
                  ` text-white top-0 right-2 size-5 shrink-0 rounded-full   `,
                  className
                )}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            className={` relative h-fit right-5 w-24   bg-white  text-black p-0 border-none shadow-md  shadow-red-600/80  ring-1 ring-red-400/80  `}
          >
            <button
              className=" h-full w-full p-1   border-none outline-none hover:bg-black/10 active:bg-red-600/40 text-center transition-colors cursor-pointer select-none font-semibold tracking-wide border-b border-gray-500"
              onClick={() => mutate()}
            >
              Unroll
            </button>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

export default ClassDisplayerOptions;
