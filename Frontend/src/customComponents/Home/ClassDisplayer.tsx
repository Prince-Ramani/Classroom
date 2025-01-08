import { ClassInterface } from "@/lib/FrontendTypes";
import CustomTooltip from "@/something/CustomTooltip";
import { MoreVertical } from "lucide-react";
import { memo } from "react";

const ClassDisplayer = memo(
  ({ classDetails }: { classDetails: ClassInterface }) => {
    return (
      <div className="border-2  rounded-md  h-fit w-full cursor-pointer hover:border-green-600 transition-all duration-200 ">
        <div className="h-32 rounded-sm relative ">
          <img
            src={
              "https://res.cloudinary.com/dwxzguawt/image/upload/v1736314821/891619-cool-wallpaper-of-study-1920x1080_qvhpn6.jpg" ||
              classDetails.banner
            }
            alt="Class banner"
            className="h-full object-cover w-full rounded-sm rounded-b-none"
          />
          <div className="absolute top-1.5 left-2 text-white flex justify-between items-center w-full px-3">
            <div className=" first-letter:capitalize font-bold tracking-wide">
              {classDetails.name}
            </div>
            <div>
              <CustomTooltip title="More">
                <div className="rounded-full p-1 h-fit w-fit  hover:bg-white/20 ">
                  <MoreVertical className=" text-white top-0 right-2 size-5 shrink-0rounded-full  " />
                </div>
              </CustomTooltip>
            </div>
          </div>
        </div>
        <div className="font-medium text-xs md:text-sm h-20 p-1 ">
          {classDetails.description}
        </div>
        <div className="border p-2 bg-white rounded-sm"></div>
      </div>
    );
  }
);

export default ClassDisplayer;
