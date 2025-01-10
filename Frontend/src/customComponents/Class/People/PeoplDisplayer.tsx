import { cn } from "@/lib/utils";
import { memo } from "react";

const PeopleDisplayer = memo(
  ({
    member,
    className,
  }: {
    member: {
      username: string;
      _id: string;
      profilePicture: string;
    };
    className: string;
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
      </div>
    );
  }
);

export default PeopleDisplayer;
