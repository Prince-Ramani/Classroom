import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthUser } from "@/Context/authUserContext";
import { ReplyInterface } from "@/lib/FrontendTypes";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "react-toastify";

const DeleteReply = memo(
  ({
    commentID,
    replyID,
    setTotalReplies,
    totalReplies,
  }: {
    commentID: string;
    replyID: string;
    totalReplies: ReplyInterface[];
    setTotalReplies: any;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { authUser } = useAuthUser();

    const { mutate, isPending } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/comment/deleteReply/${commentID}/${replyID}`,
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

        const newR = totalReplies.filter((r) => replyID !== r._id);

        setTotalReplies(newR);
        setIsOpen(false);
      },
    });

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
                        Delete reply
                      </div>
                      <div className="text-white">@{authUser?.username}?</div>
                    </div>
                    <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                      "Are you sure you want to delete this reply?! This reply
                      will no longer show up in this comment."
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
        <button
          className="p-1 hover:bg-rose-600/20 rounded-full ml-auto cursor-pointer "
          onClick={() => setIsOpen(true)}
        >
          <Trash className="size-4 sm:size-5 text-red-900" />
        </button>
      </>
    );
  }
);

export default DeleteReply;
