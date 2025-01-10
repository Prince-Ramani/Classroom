import CustomTooltip from "@/something/CustomTooltip";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { memo, useState } from "react";

import { toast } from "react-toastify";

const LikeComment = memo(
  ({
    likes,
    authUser,
    classID,
    commentID,
  }: {
    likes: string[];
    authUser: string;
    classID: string;
    commentID: string;
  }) => {
    const [isLiked, setIsLiked] = useState(likes.includes(authUser));
    const [totalLikes, setTotalLikes] = useState(likes);

    const { mutate, isPending } = useMutation({
      mutationFn: async () => {
        const res = await fetch(
          `/api/comment/likecomment/${classID}/${commentID}`,
          {
            method: "POST",
          }
        );
        const data = await res.json();
        return data;
      },
      onSuccess: (data) => {
        if ("error" in data) return toast.error(data.error);

        if (isLiked) {
          setIsLiked(false);
          setTotalLikes((p) => p.filter((o) => o !== authUser));

          return toast.success(data.message);
        }
        setIsLiked(true);
        setTotalLikes((p) => [...p, authUser]);

        return toast.success(data.message);
      },
    });

    if (!classID || !commentID) return;
    return (
      <div className=" flex items-center justify-center">
        <CustomTooltip title={`${isLiked ? "Unlike" : "Like"}`}>
          <button
            className="p-1 hover:bg-pink-800/40 transition-colors cursor-pointer rounded-full"
            disabled={isPending}
            onClick={() => mutate()}
          >
            <Heart
              className={`size-4 sm:size-5 transition-colors   text-gray-600 ${
                isLiked ? "fill-pink-600 text-transparent" : ""
              } `}
            />
          </button>
        </CustomTooltip>
        <span>{totalLikes.length}</span>
      </div>
    );
  }
);

export default LikeComment;
