import { memo } from "react";
import Wrapper from "./Wrapper";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import MessageDisplayer from "./MessageDisplayer";
import { ClassInterface, shortMessageInetrface } from "@/lib/FrontendTypes";
import { useAuthUser } from "@/Context/authUserContext";

const Classwork = memo(() => {
  const context: ClassInterface = useOutletContext();
  const navigate = useNavigate();

  if (!context._id) {
    navigate("/");
    return;
  }
  const { authUser } = useAuthUser();
  const { data: messages } = useQuery({
    queryKey: ["classwork", context._id],
    queryFn: async () => {
      const res = await fetch(`/api/class/getclasswork/${context._id}`);
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      return data;
    },
    enabled: !!context._id,
  });
  return (
    <Wrapper>
      <div className="flex flex-col gap-2  h-full w-full   ">
        {messages && messages.length > 0
          ? messages.map((message: shortMessageInetrface) => (
              <MessageDisplayer
                key={message._id}
                message={message}
                isAdmin={
                  typeof context.admins === "object" &&
                  !!authUser &&
                  context.admins.includes(authUser?._id)
                }
              />
            ))
          : ""}
      </div>{" "}
    </Wrapper>
  );
});

export default Classwork;
