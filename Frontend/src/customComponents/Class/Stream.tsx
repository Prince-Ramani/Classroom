import { memo } from "react";
import Wrapper from "./Wrapper";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthUser } from "@/Context/authUserContext";
import { ClassInterface, shortMessageInetrface } from "@/lib/FrontendTypes";
import MessageDisplayer from "./MessageDisplayer";
import CreateMessage from "./createMessage";

const Stream = memo(() => {
  const { authUser } = useAuthUser();
  const { classID } = useParams();
  const navigate = useNavigate();

  if (!classID || classID.trim() === "") navigate("/");
  const context: ClassInterface = useOutletContext();

  const { data: messages } = useQuery({
    queryKey: ["messages", classID],
    queryFn: async () => {
      const res = await fetch(`/api/class/getmessages/${classID}`);
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      console.log(data);
      return data;
    },
    enabled: !!classID,
  });

  return (
    <Wrapper>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full  ">
          {typeof context.admins === "object" &&
          !!authUser &&
          context.admins.includes(authUser?._id) ? (
            <CreateMessage
              profile={authUser.profilePicture}
              classID={classID}
            />
          ) : (
            ""
          )}
        </div>

        <div className="flex flex-col gap-2  h-full w-full   ">
          {messages && messages.length > 0
            ? messages.map((message: shortMessageInetrface) => (
                <MessageDisplayer message={message} key={message._id} />
              ))
            : ""}
        </div>
      </div>
    </Wrapper>
  );
});

export default Stream;
