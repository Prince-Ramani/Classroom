import { ClassInterface } from "@/lib/FrontendTypes";
import { TrendingUp } from "lucide-react";
import { memo } from "react";
import ClassDisplayerOptions from "./ClassDisplayerOptions";
import { useNavigate } from "react-router-dom";

const ClassDisplayer = memo(
  ({
    classDetails,
    isPinnedClass,
  }: {
    classDetails: ClassInterface;
    isPinnedClass: boolean;
  }) => {
    const navigate = useNavigate();
    const handleClick = (e: any) => {
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
        className={`  border-2 ${isPinnedClass ? " border-transparent " : ""} rounded-md  h-fit w-full cursor-pointer hover:border-green-600 transition-all duration-200 `}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick(e);
        }}
      >
        <div className="h-32 rounded-sm relative ">
          <img
            src={classDetails.banner}
            alt="Class banner"
            className="h-full object-cover w-full rounded-sm rounded-b-none"
          />
          <div className="absolute top-1.5  text-white flex justify-between items-center w-full px-2">
            <div className=" first-letter:capitalize font-bold tracking-wide">
              {classDetails.name}
            </div>
            <ClassDisplayerOptions
              classID={classDetails._id}
              isPinnedClass={isPinnedClass}
            />
          </div>
          <div className="absolute bottom-2 text-white text-xs lg:text-sm left-2">
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
  },
);

export default ClassDisplayer;
