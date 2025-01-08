import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { toast } from "react-toastify";
import ClassDisplayer from "./ClassDisplayer";
import { ClassInterface } from "@/lib/FrontendTypes";

const HomeContent = memo(() => {
  const { data } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await fetch("/api/class/getclasses");
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      console.log(data);
      return data;
    },
  });
  return (
    <div className=" flex flex-grow p-2 justify-center   w-full h-full border">
      <div className="border p-1 min-h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data && data.length > 0
          ? data.map((d: ClassInterface) => (
              <ClassDisplayer key={d._id} classDetails={d} />
            ))
          : ""}
      </div>
    </div>
  );
});

export default HomeContent;
