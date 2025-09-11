import { memo, useEffect } from "react";
import Wrapper from "./Wrapper";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import MessageDisplayer from "./MessageDisplayer";
import { ClassInterface, shortMessageInetrface } from "@/lib/FrontendTypes";
import { useAuthUser } from "@/Context/authUserContext";
import NoClassMessage from "./NoClassMessage";

const Classwork = memo(() => {
  const context: ClassInterface = useOutletContext();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!context._id) {
      navigate("/");
    }
  }, [navigate, context._id]);

  return (
    <Wrapper>
      <div className="flex flex-col gap-2  h-full w-full   ">
        {messages && messages.length > 0 ? (
          messages.map((message: shortMessageInetrface) => (
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
        ) : (
          <div className="flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
            <NoClassMessage />
          </div>
        )}
      </div>{" "}
    </Wrapper>
  );
});

export default Classwork;
