import CustomTooltip from "@/something/CustomTooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { memo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";

const AddComment = memo(
  ({ classID, messageID }: { classID: string; messageID: string }) => {
    const [commentContent, setCommentContent] = useState("");

    const queryclient = useQueryClient();

    const { mutate, isPending } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/comment/sendComment/${classID}/${messageID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ commentContent }),
          }
        );
        const data = await res.json();
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);
        queryclient.invalidateQueries({
          queryKey: [classID, messageID, "comments"],
        });
        setCommentContent("");
        return toast.success(data.message);
      },
    });

    const handleClick = () => {
      if (!commentContent) {
        toast.error("Comment content required!");
        return;
      }
      if (commentContent.length > 100) {
        toast.error("Comment can't exceed 100 charachters required!");
        return;
      }
      mutate();
    };

    console.log(commentContent);

    return (
      <div className="w-full flex items-start   rounded-md  mb-5 ">
        <TextareaAutosize
          className="w-full bg-transparent resize-none  border-2 border-black placeholder:text-black p-1 rounded-md  focus:placeholder:text-blue-600  placeholder:text-base focus:border-blue-600 focus:outline-none text-sm md:text-lg "
          minRows={2}
          maxRows={2}
          value={commentContent}
          placeholder="Add comment"
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <div
          className="ml-auto cursor-pointer hover:bg-black/20 rounded-full p-2"
          onClick={handleClick}
        >
          <CustomTooltip title="Send">
            <Send
              className={`ml-auto  size-7 md:size-8 text-black ${
                commentContent.length > 3 ? "text-blue-600" : ""
              }`}
            />
          </CustomTooltip>
        </div>
      </div>
    );
  }
);

export default AddComment;
