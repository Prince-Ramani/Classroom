import { FormateDate } from "@/lib/Date";
import { shortMessageInetrface } from "@/lib/FrontendTypes";
import { memo } from "react";

const MessageDisplayer = memo(
  ({ message }: { message: shortMessageInetrface }) => {
    return (
      <div className="border rounded-lg  p-2 lg:p-3 cursor-pointer">
        <div className="items-center w-full  flex gap-2 md:gap-3 lg:gap-4 xl:gap-5 ">
          <img
            src={message.uploadedBy.profilePicture}
            className="size-10 rounded-full"
          />
          <div className="flex flex-col ">
            <div className="text-lg font-medium">
              {message.uploadedBy.username}
            </div>
            <div className="text-gray-500 text-sm">
              {FormateDate(message.createdAt)}
            </div>
          </div>
        </div>
        <div className=" p-2 break-words text-sm sm:text-base  ">
          {message.content}kcndkvlndlkvndnvlkdnlkvndlknvldkn
        </div>
        <div className="border " />
        <div className="flex w-full p-2 font-semibold ">
          Comments : {message.commentLength}
        </div>
      </div>
    );
  }
);

export default MessageDisplayer;
