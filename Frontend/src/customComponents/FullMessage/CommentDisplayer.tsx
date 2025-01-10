import { FormateDate } from "@/lib/Date";
import { commentInterface } from "@/lib/FrontendTypes";

import { memo } from "react";
import LikeComment from "./LikeComment";

const CommentDisplayer = memo(
  ({
    comment,
    authUser,
  }: {
    comment: commentInterface;
    authUser: string | undefined;
  }) => {
    if (!authUser) return;

    return (
      <div className="  flex items-center gap-2 border-b border-gray-600/20  pb-1">
        <div className="self-start shrink-0">
          <img
            src={comment.commenter.profilePicture}
            alt="commenter profile picture"
            className="size-8 md:size-10 rounded-full"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-1">
            <div className="font-semibold md:text-lg">
              {comment.commenter.username}
            </div>
            <div className="text-xs sm:text-sm tracking-tight  text-gray-600">
              {FormateDate(comment.commentedAt)}
            </div>
          </div>
          <div className="tracking-wide break-all text-sm sm:text-base  w-full">
            {comment.commentContent}
          </div>
          <LikeComment
            likes={comment.likes}
            authUser={authUser}
            classID={comment.classID}
            commentID={comment._id}
          />
        </div>
      </div>
    );
  }
);

export default CommentDisplayer;
