import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/Context/authUserContext";
import { ReplyInterface } from "@/lib/FrontendTypes";
import { useMutation } from "@tanstack/react-query";
import { memo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
const ReplyComment = memo(
  ({
    classID,
    commentID,
    commenterName,
    setTotalReplies,
    totalReplies,
  }: {
    commentID: string;
    classID: string;
    commenterName: string;
    setTotalReplies: any;
    totalReplies: ReplyInterface[];
  }) => {
    const { authUser } = useAuthUser();
    const [replyContent, setReplyContent] = useState("");
    if (!authUser) return;
    const { isPending, mutate } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/comment/replycomment/${classID}/${commentID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ replyContent }),
          }
        );
        const data = await res.json();

        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);
        setReplyContent("");
        const newR = [
          {
            replyContent,
            replierId: {
              username: authUser.username,
              profilePicture: authUser.profilePicture,
              _id: authUser._id,
            },
            repliedAt: Date.now,
          },
          ...totalReplies,
        ];

        setTotalReplies(newR);
        return toast.success(data.message);
      },
    });

    const handleClick = () => {
      if (!replyContent || replyContent.trim() === "") {
        toast.error("Reply must have content!");
        return;
      }

      if (replyContent.length > 100) {
        toast.error("Reply cann't exceed 100 charachters!");
        return;
      }
      mutate();
    };

    return (
      <>
        <div className="w-full flex gap-3 flex-col ">
          <div className="w-full flex gap-2">
            <img
              src={authUser?.profilePicture}
              alt="Profile picture "
              className="rounded-full size-8 md:size-10"
            />
            <TextareaAutosize
              minRows={2}
              maxRows={2}
              className="w-full  placeholder:text-black p-2 rounded-md focus:outline-none focus:border-blue-600 resize-none"
              placeholder={`Reply ${commenterName}`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </div>

          <div className="flex">
            <Button
              size="lg"
              className="focus:border-2 w-24 ml-auto mr-2  border-white"
              disabled={isPending}
              onClick={handleClick}
            >
              {isPending ? "Replying..." : "Reply"}
            </Button>
          </div>
        </div>
      </>
    );
  }
);

export default ReplyComment;
