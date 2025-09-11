import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import CommentDisplayer from "./CommentDisplayer";
import { toast } from "react-toastify";
import { commentInterface } from "@/lib/FrontendTypes";
import { useAuthUser } from "@/Context/authUserContext";

const Comment = memo(
  ({ classID, messageID }: { classID: string; messageID: string }) => {
    const { data } = useQuery({
      queryKey: [classID, messageID, "comments"],
      queryFn: async () => {
        const res = await fetch(
          `/api/class/getComments/${classID}/${messageID}`,
        );
        const data:
          | commentInterface[]
          | {
              error: string;
            } = await res.json();
        if ("error" in data) {
          toast.error(data.error);
          return;
        }

        return data;
      },
    });
    const { authUser } = useAuthUser();
    return (
      <div>
        {data && data?.length > 0 ? (
          <div className="flex flex-col gap-5 md:gap-6 ">
            {data.map((comment) => (
              <CommentDisplayer
                key={comment._id}
                comment={comment}
                authUser={authUser?._id}
              />
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  },
);

export default Comment;
