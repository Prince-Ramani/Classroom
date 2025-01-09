import { memo } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ClassHeader from "./ClassHeader";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Bar from "@/something/Bar";

const ClassLayout = memo(() => {
  const { classID } = useParams();
  const navigate = useNavigate();

  if (!classID) navigate("/");

  const { data } = useQuery({
    queryKey: [classID, "class"],
    queryFn: async () => {
      const res = await fetch(`/api/class/getclass/${classID}`);
      const data = await res.json();
      if ("error" in data) return toast.error(data.error);
      console.log(data);
      return data;
    },
    enabled: !!classID,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  return (
    <div className="min-h-screen w-full flex flex-col ">
      <ClassHeader classname={data?.name} classID={data?._id} />
      <Bar title={data?.name} className="h-12 md:hidden sm:h-14" />
      <main className="min-h-full w-full flex-col flex flex-grow sm:p-1 sm:px-2 md:p-2 ">
        <div className="relative flex p-1  h-40 md:h-48  lg:h-56 xl:h-72 my-2  items-center justify-center rounded-md lg:mx-20  xl:mx-44">
          <img
            src={data?.banner}
            className="h-full w-full object-cover rounded-md  bg-purple-600 border-black/20"
          />
          <div className="absolute bottom-4 text-xl sm:text-2xl  md:top-2 left-4  lg:text-3xl font-semibold tracking-wide text-white  md:p-4 first-letter:capitalize">
            {data?.name}
          </div>
        </div>
        {data ? <Outlet context={data} /> : ""}
      </main>
    </div>
  );
});

export default ClassLayout;
