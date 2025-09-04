import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { toast } from "react-toastify";
import ClassDisplayer from "./ClassDisplayer";
import { ClassInterface } from "@/lib/FrontendTypes";
import NoMessage from "../Class/NoMessage";

const HomeContent = memo(() => {
  const { data, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await fetch("/api/class/getclasses");
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      return data;
    },
  });
  return (
    <div className=" flex flex-grow p-2 justify-center    w-full h-full ">
      {data && data.length > 0 && !isLoading ? (
        <div className=" p-1 min-h-full w-full md:w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 items-start content-start gap-y-6 sm:gap-y-4 md:gap-y-2">
          {data.map((d: ClassInterface) => (
            <ClassDisplayer key={d._id} classDetails={d} />
          ))}
        </div>
      ) : (
        ""
      )}

      {data && data.length === 0 && !isLoading ? (
        <div className="flex w-full h-full justify-center items-center">
          <NoMessage />
        </div>
      ) : (
        ""
      )}
    </div>
  );
});

export default HomeContent;
