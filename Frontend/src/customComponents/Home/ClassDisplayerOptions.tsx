import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DoorClosed, DoorOpen, MoreVertical, Pin, PinOff } from "lucide-react";
import { memo } from "react";
import { toast } from "react-toastify";

const ClassDisplayerOptions = memo(
  ({
    classID,
    className,
    isPinnedClass,
  }: {
    classID: string;
    className?: string;
    isPinnedClass: boolean;
  }) => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
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

    const { mutate: PinAClass, isPending: pinningClass } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/class/pinAClass/${classID}`, {
          method: "PATCH",
        });
        const data = await res.json();

        return data;
      },
      onSuccess(data) {
        if ("error" in data) return toast.error(data.error);
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      },
    });

    return (
      <span>
        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-full p-1 h-fit w-fit  hover:bg-white/20 ">
              <MoreVertical
                className={cn(
                  ` text-white top-0 right-2 size-5 shrink-0 rounded-full   `,
                  className,
                )}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            className={` relative h-fit right-5 w-24   bg-white  text-black p-0 border-none shadow-md  shadow-red-600/80  ring-1 ring-red-400/80  `}
          >
            <button
              className=" h-full w-full p-1  border-none  outline-none hover:bg-black/10 active:bg-red-600/40 text-center transition-colors  cursor-pointer select-none font-semibold tracking-wide  "
              onClick={() => PinAClass()}
              disabled={pinningClass || isPending}
            >
              <div
                className={` flex justify-center items-center gap-2 ${isPinnedClass ? "text-red-400" : "text-blue-500"}`}
              >
                {isPinnedClass ? (
                  <>
                    <PinOff className="h-fit w-5 rotate-[-40deg] " />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-fit w-5 rotate-45" />
                    Pin
                  </>
                )}
              </div>
            </button>

            <button
              className=" h-full w-full p-1   border-t outline-none hover:bg-black/10 active:bg-red-600/40 text-center transition-colors cursor-pointer select-none font-semibold tracking-wide  border-gray-500 text-red-400"
              onClick={() => mutate()}
              disabled={pinningClass || isPending}
            >
              <div className="flex justify-center items-center gap-2">
                <DoorOpen className="h-fit w-5 " />
                Unroll
              </div>
            </button>
          </PopoverContent>
        </Popover>
      </span>
    );
  },
);

export default ClassDisplayerOptions;
