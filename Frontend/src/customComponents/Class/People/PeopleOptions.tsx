import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo, useState } from "react";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const PeopleOptions = memo(
  ({
    classID,
    personID,
    className,
    isAdmin,
  }: {
    classID: string;
    personID: string;
    className?: string;
    isAdmin: boolean;
  }) => {
    const queryclient = useQueryClient();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    let isPopoverDisabled = false;

    const { mutate: makeAdmin, isPending: pendingAdmin } = useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/class/makeadmin`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ classID, personID }),
        });
        const data = await res.json();
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);
        toast.success(data.message);
        queryclient.invalidateQueries({
          queryKey: [classID, "people"],
        });
        setIsPopoverOpen(false);
      },
    });

    const { mutate: remove, isPending: pendingRemove } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/class/removemember/${classID}/${personID}`,
          {
            method: "PATCH",
          },
        );
        const data = await res.json();
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);
        toast.success(data.message);
        queryclient.invalidateQueries({
          queryKey: [classID, "people"],
        });
        setIsPopoverOpen(false);
      },
    });

    return (
      <div>
        {" "}
        <Popover
          open={isPopoverDisabled ? false : isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
        >
          {" "}
          <PopoverTrigger asChild>
            <button className="rounded-full   p-1 h-fit w-fit  hover:bg-white/20 ">
              <MoreVertical
                className={cn(
                  `  top-0 right-2 size-5 shrink-0 rounded-full   `,
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
              className=" h-full w-full p-1 text-sm md:text-base  border-b outline-none hover:bg-black/10 active:bg-red-600/40 text-center transition-colors cursor-pointer select-none font-semibold tracking-wide  border-gray-500"
              onClick={() => makeAdmin()}
              disabled={pendingAdmin || pendingRemove}
            >
              {!isAdmin ? "Make admin" : "Remove admin"}
            </button>
            <button
              className=" h-full w-full p-1 text-sm md:text-base   outline-none hover:bg-black/10 active:bg-red-600/40 text-center transition-colors cursor-pointer select-none font-semibold tracking-wide  border-gray-500"
              onClick={() => remove()}
              disabled={pendingAdmin || pendingRemove}
            >
              Remove
            </button>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

export default PeopleOptions;
