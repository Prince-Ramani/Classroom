import VideoPlayer from "@/components/VideoPLayer";
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
        {message.attachedVideo ? (
          <div>
            <VideoPlayer source={message.attachedVideo} />
          </div>
        ) : (
          ""
        )}
        {message.attachedImages.length > 0 ? (
          <div className="p-2 flex  gap-2 flex-wrap">
            {message.attachedImages.map((i, index) => (
              <a href={i} target="_blank">
                <img
                  src={i}
                  key={index}
                  className={` ${
                    message.attachedImages.length == 1
                      ? "h-full w-full max-h-[400px]"
                      : message.attachedImages.length === 2
                      ? "size-36 sm:size-48 md:size-52 lg:size-64"
                      : message.attachedImages.length > 1
                      ? "size-36 sm:size-48 md:size-52 lg:size-64"
                      : ""
                  } object-cover rounded-sm`}
                />
              </a>
            ))}
          </div>
        ) : (
          ""
        )}
        <div className="border " />
        <div className="flex w-full p-2 font-semibold ">
          Comments : {message.commentLength}
        </div>
      </div>
    );
  }
);

export default MessageDisplayer;
