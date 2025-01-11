import { FormateDate } from "@/lib/Date";
import { commentInterface, ReplyInterface } from "@/lib/FrontendTypes";

import { memo, useState } from "react";
import LikeComment from "./LikeComment";
import { ChevronDown, Dot } from "lucide-react";
import ReplyComment from "./ReplyComment";
import DeleteCommentIcon from "./DeletCommentIcon";
import DeleteReply from "./DeleteReply";

const CommentDisplayer = memo(
  ({
    comment,
    authUser,
  }: {
    comment: commentInterface;
    authUser: string | undefined;
  }) => {
    if (!authUser) return;
    const [isOpen, setIsOpen] = useState(false);
    const [totalReplies, setTotalReplies] = useState(comment.replies);

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
          <div className="flex items-center ">
            <div className="font-semibold md:text-lg">
              {comment.commenter.username}
            </div>
            <Dot className="text-gray-600" />
            <div className="text-xs sm:text-sm tracking-tight   text-gray-600">
              {FormateDate(comment.commentedAt)}
            </div>
            {comment.commenter._id === authUser ? (
              <DeleteCommentIcon commentID={comment._id} />
            ) : (
              ""
            )}
          </div>
          <div className="tracking-wide break-all text-sm sm:text-base  w-full">
            {comment.commentContent}
          </div>
          <div className=" flex items-center gap-4 justify-center">
            <LikeComment
              likes={comment.likes}
              authUser={authUser}
              classID={comment.classID}
              commentID={comment._id}
            />
            <button
              className={`flex hover:bg-blue-500/20 transition-colors pr-3 text-xs sm:text-sm md:text-base rounded-sm items-center gap-1   ${
                isOpen ? "bg-blue-400/40" : ""
              } `}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <ChevronDown
                className={`hover:bg-white/20 rounded-full p-1 size-5 sm:size-6 md:size-7   animate-out transition-all duration-300 active:text-blue-700 ${
                  isOpen ? "rotate-180" : ""
                } `}
              />
              Replies ({totalReplies.length})
            </button>
          </div>
          {isOpen ? (
            <div className=" p-1 flex flex-col gap-3 ">
              <div className="font-bold tracking-wide text-lg p-2 underline underline-offset-2">
                Replies
              </div>
              <div className="w-full  ">
                <ReplyComment
                  classID={comment.classID}
                  commentID={comment._id}
                  commenterName={comment.commenter.username}
                  setTotalReplies={setTotalReplies}
                  totalReplies={totalReplies}
                />
              </div>

              {totalReplies.map((reply: ReplyInterface, index) => (
                <div
                  className={`flex gap-3 items-center ${
                    totalReplies.length - 1 !== index ? "border-b" : ""
                  } pb-1`}
                  key={index}
                >
                  <img
                    src={reply.replierId.profilePicture}
                    className="size-8"
                    alt="Replier profile picture"
                  />
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-3 w  ">
                      <div className="font-semibold md:text-lg md:tracking-wide">
                        {reply.replierId.username}
                      </div>
                      <div className="text-gray-500 tracking-tight text-xs md:text-sm ">
                        {FormateDate(reply.RepliedAt)}
                      </div>
                      {reply.replierId._id === authUser && reply._id ? (
                        <DeleteReply
                          commentID={comment._id}
                          replyID={reply._id}
                          setTotalReplies={setTotalReplies}
                          totalReplies={totalReplies}
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    <div>{reply.replyContent}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
);

export default CommentDisplayer;
