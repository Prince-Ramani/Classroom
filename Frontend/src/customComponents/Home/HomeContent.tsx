import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { toast } from "react-toastify";
import ClassDisplayer from "./ClassDisplayer";
import { ClassInterface } from "@/lib/FrontendTypes";
import NoMessage from "../Class/NoMessage";
import { Pin, PinOff } from "lucide-react";

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
      {!!data && !isLoading ? (
        <div className="flex flex-col w-full h-full  items-center">
          {/* Pinned classes*/}
          {!!data.pinnedClasses && data.pinnedClasses.length > 0 ? (
            <>
              <div className="w-full md:w-[90%] flex gap-2 pl-2  text-blue-700 border-b border-blue-700" />
              <div className="w-full md:w-[90%] flex gap-2 pl-2 py-2 md:py-4 text-blue-700 border-b border-blue-700">
                <Pin className="size-5 " />
                Pinned classes :
              </div>
              <div className=" p-1 min-h-full w-full md:w-[90%] grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 items-start content-start gap-y-6 sm:gap-y-4 md:gap-y-2 pt-5">
                {data.pinnedClasses.map((d: ClassInterface) => (
                  <ClassDisplayer
                    key={d._id}
                    classDetails={d}
                    isPinnedClass={true}
                  />
                ))}
              </div>

              <div className="w-full md:w-[90%] flex gap-2 pl-2 pt-4 text-blue-700 border-b border-blue-700" />
            </>
          ) : (
            ""
          )}
          {/* Normal class*/}
          {!!data.classes && data.classes.length > 0 ? (
            <>
              <div className="w-full md:w-[90%] flex gap-2 py-2 md:py-4 pl-2  text-gray-700 border-b border-blue-700">
                <PinOff className="size-5 " />
                Unpinned classes :
              </div>
              <div
                className={`p-1 min-h-full w-full md:w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 items-start content-start gap-y-6 sm:gap-y-4 md:gap-y-2 pt-5`}
              >
                {data.classes.map((d: ClassInterface) => (
                  <ClassDisplayer
                    key={d._id}
                    classDetails={d}
                    isPinnedClass={false}
                  />
                ))}
              </div>
            </>
          ) : (
            ""
          )}
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
