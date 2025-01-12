import { memo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Loading from "@/components/Loading";
import TextareaAutosize from "react-textarea-autosize";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuthUser } from "@/Context/authUserContext";

const MessageOptions = memo(
  ({
    className,
    classID,
    messageID,
    oldContent,
    isPinned,
  }: {
    className?: string;
    classID: string;
    messageID: string;
    oldContent: string;
    isPinned: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const queryclient = useQueryClient();
    const [content, setContent] = useState(oldContent);
    const [pinned, setIsPinned] = useState(isPinned);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    let isPopoverDisabled = false;

    const { authUser } = useAuthUser();

    const { mutate, isPending } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/message/deletemessage/${classID}/${messageID}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);
        toast.success(data.message);
        queryclient.invalidateQueries({
          queryKey: ["messages", classID],
        });
        queryclient.invalidateQueries({
          queryKey: [classID, messageID],
        });
        setIsOpen(false);
        setIsPopoverOpen(false);
      },
    });

    const { mutate: Edit, isPending: pendingEdit } = useMutation({
      mutationFn: async () => {
        if (content.trim() === oldContent)
          return toast.error("No changes made!");
        const res = await fetch(
          `/api/message/editmessage/${classID}/${messageID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          }
        );
        const data = await res.json();
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);
        toast.success(data.message);
        queryclient.invalidateQueries({
          queryKey: ["messages", classID],
        });
        setIsEditOpen(false);
        setIsPopoverOpen(false);
      },
    });

    const { mutate: pinMessage, isPending: pendingPin } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/message/pinmessage/${classID}/${messageID}`,
          {
            method: "PATCH",
          }
        );
        const data = await res.json();
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);
        toast.success(data.message);
        queryclient.invalidateQueries({
          queryKey: ["messages", classID],
        });
        setIsPopoverOpen(false);
        setIsPinned((p) => !p);
      },
    });

    const handleEdit = () => {
      if (!content) {
        toast.error("Content required for message!");
        return;
      }
      if (content.length < 3 || content.length > 1200) {
        toast.error("Content should have character range betweeen 3 and 1200!");
        return;
      }
      Edit();
    };

    return (
      <>
        {isOpen ? (
          <div className="">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="  flex items-center border-none justify-center pb-10 min-w-full h-full    z-50 flex-col bg-blue-200/10 bg-opacity-50 ">
                <DialogTitle />
                <div className="bg-black p-3 rounded-3xl max-w-[275px] sm:max-w-[300px]  md:max-w-xs w-full">
                  {isPending ? (
                    <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
                      <Loading />
                    </div>
                  ) : (
                    ""
                  )}
                  <DialogDescription />
                  <div className=" w-full  flex flex-col p-4 ">
                    <div className="font-bold ">
                      <div className="text-red-700 font-extrabold">
                        Delete message
                      </div>
                      <div className="text-white">@{authUser?.username}?</div>
                    </div>
                    <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                      "Are you sure you want to delete this message?! This
                      message will no longer show up in this class."
                    </div>
                    <div>
                      <div className="flex flex-col gap-2 mt-7">
                        <button
                          className={`bg-white text-black font-semibold rounded-full p-2 text-sm ${
                            isPending ? "opacity-75" : "hover:opacity-90"
                          }  `}
                          disabled={isPending}
                          onClick={() => mutate()}
                        >
                          Delete
                        </button>

                        <button
                          className={`bg-transparent  ring-1 text-white ring-white/50 font-semibold rounded-full p-2 text-sm ${
                            isPending ? "opacity-75" : "hover:bg-white/10"
                          } 
                      `}
                          disabled={isPending}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        >
                          Cancle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          ""
        )}

        {isEditOpen ? (
          <div className="">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="  flex items-center border-none justify-center pb-10 min-w-full h-full    z-50 flex-col bg-blue-200/10 bg-opacity-50 ">
                <DialogTitle />
                <div className="bg-black p-3 rounded-3xl max-w-[275px] sm:max-w-[300px]  md:max-w-lg  w-full">
                  {pendingEdit ? (
                    <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
                      <Loading />
                    </div>
                  ) : (
                    ""
                  )}
                  <DialogDescription />
                  <div className=" w-full  flex flex-col p-4 ">
                    <div className="font-bold ">
                      <div className="text-blue-500 font-bold tracking-wide text-lg">
                        Edit message
                      </div>
                    </div>

                    <div className="mt-3">
                      <TextareaAutosize
                        placeholder="Edit content"
                        minRows={3}
                        maxRows={5}
                        className="w-full bg-transparent text-white focus:border-blue-500 focus:outline-none h-full border rounded-sm p-1 text-sm  md:text-base resize-none  "
                        value={content}
                        autoFocus
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex flex-col gap-2 mt-3">
                        <button
                          className={`bg-white text-black font-semibold rounded-full p-2 text-sm ${
                            isPending ? "opacity-75" : "hover:opacity-90"
                          }  `}
                          disabled={pendingEdit}
                          onClick={handleEdit}
                        >
                          Edit
                        </button>

                        <button
                          className={`bg-transparent  ring-1 text-white ring-white/50 font-semibold rounded-full p-2 text-sm ${
                            isPending ? "opacity-75" : "hover:bg-white/10"
                          } 
                      `}
                          disabled={pendingEdit}
                          onClick={() => {
                            setIsEditOpen(false);
                          }}
                        >
                          Cancle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          ""
        )}
        <span>
          <Popover
            open={isPopoverDisabled ? false : isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
          >
            {" "}
            <PopoverTrigger asChild>
              <div className="rounded-full   p-1 h-fit w-fit  hover:bg-white/20 ">
                <MoreVertical
                  className={cn(
                    `  top-0 right-2 size-5 shrink-0 rounded-full   `,
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
                className=" h-full w-full p-1 text-sm md:text-base  border-b outline-none hover:bg-black/10 active:bg-red-600/40 text-center transition-colors cursor-pointer select-none font-semibold tracking-wide  border-gray-500"
                onClick={() => setIsEditOpen(true)}
                disabled={pendingPin}
              >
                Edit
              </button>
              <button
                className=" h-full w-full p-1 text-sm md:text-base  border-b outline-none hover:bg-black/10 active:bg-red-600/40 text-center transition-colors cursor-pointer select-none font-semibold tracking-wide  border-gray-500"
                onClick={() => pinMessage()}
                disabled={pendingPin}
              >
                {pinned ? "Unpin" : "Pin"}
              </button>
              <button
                className=" h-full w-full p-1  text-sm md:text-base  border-none outline-none hover:bg-black/10 active:bg-red-600/40 text-center transition-colors cursor-pointer select-none font-semibold tracking-wide border-b border-gray-500"
                onClick={() => setIsOpen(true)}
                disabled={pendingPin}
              >
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </span>
      </>
    );
  }
);

export default MessageOptions;
