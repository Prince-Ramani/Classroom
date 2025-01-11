import { ClassInterface } from "@/lib/FrontendTypes";

import { TrendingUp } from "lucide-react";
import { memo } from "react";
import ClassDisplayerOptions from "./ClassDisplayerOptions";
import { useNavigate } from "react-router-dom";

const ClassDisplayer = memo(
  ({ classDetails }: { classDetails: ClassInterface }) => {
    const navigate = useNavigate();
    const handleClick = (e: any) => {
      console.log(e.target.tagName);
      if (
        e.target.tagName === "circle" ||
        e.target.tagName === "SPAN" ||
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "svg"
      )
        return;

      navigate(`/class/${classDetails._id}`);
    };
    return (
      <div
        className="border-2  rounded-md  h-fit w-full cursor-pointer hover:border-green-600 transition-all duration-200 "
        onClick={handleClick}
      >
        <div className="h-32 rounded-sm relative ">
          <img
            src={
              "https://res.cloudinary.com/dwxzguawt/image/upload/v1736314821/891619-cool-wallpaper-of-study-1920x1080_qvhpn6.jpg" ||
              classDetails.banner
            }
            alt="Class banner"
            className="h-full object-cover w-full rounded-sm rounded-b-none"
          />
          <div className="absolute top-1.5  text-white flex justify-between items-center w-full px-2">
            <div className=" first-letter:capitalize font-bold tracking-wide">
              {classDetails.name}
            </div>
            <ClassDisplayerOptions classID={classDetails._id} />
          </div>
          <div className="absolute bottom-2 text-white text-xs left-2">
            {classDetails.teacherName}
          </div>
        </div>
        <div className="font-medium text-xs  h-16 p-2 bg-white break-all lg:text-sm ">
          {classDetails.description}
        </div>
        <div className=" border-t  border-b p-1 px-3 md:p-2 bg-white rounded-b-sm flex gap-3 items-center text-gray-700">
          <TrendingUp className="size-5 " />
          <div className="text-xs font-medium ">
            Total members :{" "}
            {typeof classDetails.admins === "number" &&
            typeof classDetails.members === "number"
              ? classDetails.members + classDetails.admins
              : ""}
          </div>
        </div>
      </div>
    );
  }
);

export default ClassDisplayer;
