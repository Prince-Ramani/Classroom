import { useAuthUser } from "@/Context/authUserContext";

import CustomTooltip from "@/something/CustomTooltip";
import { ArrowLeft } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ClassHeader = memo(
  ({ classname, classID }: { classname: string; classID: string }) => {
    const { authUser } = useAuthUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentlyOn, setCurrentlyOn] = useState<
      "stream" | "classwork" | "people" | undefined
    >(undefined);

    useEffect(() => {
      const path = location.pathname.split("/")[3];
      if (path === "people") {
        setCurrentlyOn("people");
        return;
      }
      if (path === "classwork") {
        setCurrentlyOn("classwork");
        return;
      }

      setCurrentlyOn("stream");
    }, [location, navigate]);

    return (
      <div className="hidden md:flex  backdrop-blur-lg shadow-lg shadow-gray-500/30  z-20 sticky text-gray-700  top-0 w-full  items-center justify-between  lg:px-10">
        <div className="flex items-center gap-5 p-4 px-3">
          <div
            className="hover:bg-gray-500/20 rounded-full p-1 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <CustomTooltip title="Back">
              <ArrowLeft className="shrink-0 " />
            </CustomTooltip>
          </div>
          <div className="font-semibold text-xl ">{classname}</div>
        </div>

        <div className="flex self-end cursor-pointer   ">
          <div
            className={`flex flex-col gap-2 w-32  text-center  `}
            onClick={() => navigate(`/class/${classID}`)}
          >
            <div
              className={`${
                currentlyOn === "stream"
                  ? "text-blue-600 font-semibold"
                  : "hover:text-gray-500"
              }`}
            >
              Stream
            </div>

            <div
              className={`w-full rounded-t-full ${
                currentlyOn === "stream"
                  ? "border-blue-600 border-2"
                  : "border-transparent"
              }`}
            />
          </div>

          <div
            className={`flex flex-col gap-2 w-32  text-center`}
            onClick={() => navigate("classwork")}
          >
            <div
              className={`${
                currentlyOn === "classwork"
                  ? "text-blue-600 font-semibold"
                  : "hover:text-gray-500"
              }`}
            >
              Classwork
            </div>

            <div
              className={`w-full rounded-t-full ${
                currentlyOn === "classwork"
                  ? "border-blue-600 border-2"
                  : "border-transparent"
              }`}
            />
          </div>
          <div
            className={`flex flex-col gap-2 w-32  text-center`}
            onClick={() => navigate("people")}
          >
            <div
              className={`${
                currentlyOn === "people"
                  ? "text-blue-600 font-semibold"
                  : "hover:text-gray-500"
              }`}
            >
              People
            </div>

            <div
              className={`w-full rounded-t-full ${
                currentlyOn === "people"
                  ? "border-blue-600 border-2"
                  : "border-transparent"
              }`}
            />
          </div>
        </div>

        <div>
          <div className="flex gap-10  items-center  ">
            <img
              src={authUser?.profilePicture}
              className="size-10 rounded-full shrink-0 object-cover hover:border border-black active:border"
            />
          </div>
        </div>
      </div>
    );
  }
);
export default ClassHeader;
