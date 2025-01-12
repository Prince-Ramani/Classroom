import { cn } from "@/lib/utils";
import { memo } from "react";
import PeopleOptions from "./PeopleOptions";

const PeopleDisplayer = memo(
  ({
    member,
    className,
    classID,
    isAdmin = false,
    isHimself,
    isHimselfAdmin,
  }: {
    member: {
      username: string;
      _id: string;
      profilePicture: string;
    };
    classID: string;
    className: string;
    isHimselfAdmin: boolean;
    isAdmin?: boolean;
    isHimself: boolean;
  }) => {
    return (
      <div
        className={cn(
          "flex gap-3 md:gap-4 lg:gap-5 items-center p-1 lg:p-2 lg:pb-4",
          className
        )}
      >
        <img
          src={member.profilePicture}
          className="size-8 lg:size-10 rounded-full"
        />
        <div className="font-semibold  text-base sm:text-lg ">
          {member.username}
        </div>
        {!isHimself && isHimselfAdmin ? (
          <div className=" rounded-full hover:bg-black/10 transition-colors p-0.5 ml-auto">
            <PeopleOptions
              isAdmin={isAdmin}
              classID={classID}
              personID={member._id}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
);

export default PeopleDisplayer;
