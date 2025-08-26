import Profile from "@/customComponents/Home/Profile";

import CustomTooltip from "@/something/CustomTooltip";
import {
  ArrowLeft,
  ClipboardList,
  MessagesSquare,
  Settings,
  Users,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ClassHeader = memo(
  ({
    classname,
    classID,
    isAdmin,
  }: {
    classname: string;
    classID: string;
    isAdmin: boolean;
  }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentlyOn, setCurrentlyOn] = useState<
      "stream" | "classwork" | "people" | "settings" | undefined
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
      if (path === "settings") {
        setCurrentlyOn("settings");
        return;
      }

      setCurrentlyOn("stream");
    }, [location, navigate]);

    return (
      <>
        <div
          className={` flex md:hidden   border-b p-2 backdrop-blur-lg sticky  top-0 z-50 bg-white/70 sm:p-3 md:p-4 md:pl-10 gap-4 items-cente  text-gray-700 shadow-md  shadow-black/30`}
        >
          <button
            className="hover:bg-gray-500/20 rounded-full p-1 cursor-pointer"
            onClick={() => {
              if (currentlyOn === "settings") {
                navigate(`/class/${classID}`);
                return;
              }
              navigate("/");
            }}
          >
            <CustomTooltip title="Back">
              <ArrowLeft className="shrink-0 " />
            </CustomTooltip>
          </button>

          <div className="font-semibold text-2xl">{classname}</div>

          <div className="flex items-center ml-auto  ">
            {isAdmin ? (
              <button
                className={`group  hover:bg-black/10 rounded-full cursor-pointer items-center flex transition-colors ${
                  currentlyOn === "settings" ? "bg-blue-500 text-white " : ""
                }  p-1`}
                onClick={() => navigate(`/class/${classID}/settings`)}
              >
                <CustomTooltip title="Settings">
                  <Settings className="size-6 group-hover:text-blue-500" />
                </CustomTooltip>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="hidden md:flex  backdrop-blur-lg shadow-lg shadow-gray-500/30  z-20 sticky text-gray-700  top-0 w-full  items-center justify-between  lg:px-10">
          <div className="flex items-center gap-5 p-4 px-3">
            <button
              className="hover:bg-gray-500/20 rounded-full p-1 cursor-pointer"
              onClick={() => navigate(`/`)}
            >
              <CustomTooltip title="Back">
                <ArrowLeft className="shrink-0 " />
              </CustomTooltip>
            </button>
            <div className="font-semibold text-xl ">{classname}</div>
          </div>

          <div className="flex self-end cursor-pointer   ">
            <button
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
            </button>

            <button
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
            </button>

            <button
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
              ></div>
            </button>
          </div>

          <div className="flex items-center  gap-x-10">
            {isAdmin ? (
              <button
                className={`group  hover:bg-black/10 rounded-full cursor-pointer items-center flex transition-colors ${
                  currentlyOn === "settings" ? "bg-blue-500 text-white " : ""
                }  p-1`}
                onClick={() => navigate(`/class/${classID}/settings`)}
              >
                <CustomTooltip title="Settings">
                  <Settings className="size-6 group-hover:text-blue-500" />
                </CustomTooltip>
              </button>
            ) : (
              ""
            )}
            <Profile />
          </div>
        </div>

        <div className="border-t border-gray-400/50 p-1 md:hidden  fixed bottom-0 w-full bg-white z-[100] ">
          <div className={` flex justify-around items-center `}>
            <button
              className=" hover:bg-white/20 rounded-full cursor-pointer "
              onClick={() => navigate(`/class/${classID}`)}
            >
              <CustomTooltip title="Stream">
                <div className="flex flex-col  items-center  h-fit w-fit  justify-center ">
                  <MessagesSquare
                    className={`size-6  rounded-md      ${
                      currentlyOn === "stream" ? "text-blue-400" : ""
                    } `}
                  />
                  <div
                    className={`  ${
                      currentlyOn === "stream"
                        ? "text-blue-500 font-semibold"
                        : "text-xs"
                    }`}
                  >
                    Stream
                  </div>
                </div>
              </CustomTooltip>
            </button>

            <button
              className=" hover:bg-white/20 rounded-full p-1 cursor-pointer "
              onClick={() => navigate("classwork")}
            >
              <div className="flex flex-col  items-center  h-fit w-fit  justify-center ">
                <ClipboardList
                  className={`size-6  rounded-md      ${
                    currentlyOn === "classwork" ? "text-blue-400" : ""
                  } `}
                />
                <div
                  className={`  ${
                    currentlyOn === "classwork"
                      ? "text-blue-500 font-semibold"
                      : "text-xs"
                  }`}
                >
                  Classwork
                </div>
              </div>
            </button>

            <button
              className=" hover:bg-white/20 rounded-full p-1 cursor-pointer "
              onClick={() => navigate("people")}
            >
              <CustomTooltip title="Peopl">
                <div className="flex flex-col  items-center  h-fit w-fit  justify-center ">
                  <Users
                    className={`size-6  rounded-md      ${
                      currentlyOn === "people" ? "text-blue-400" : ""
                    } `}
                  />
                  <div
                    className={`  ${
                      currentlyOn === "people"
                        ? "text-blue-500 font-semibold"
                        : "text-xs"
                    }`}
                  >
                    People
                  </div>
                </div>
              </CustomTooltip>
            </button>
          </div>
        </div>
      </>
    );
  },
);
export default ClassHeader;
