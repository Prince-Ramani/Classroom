import VideoPlayer from "@/components/VideoPLayer";
import { FormateDate } from "@/lib/Date";
import { shortMessageInetrface } from "@/lib/FrontendTypes";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const MessageDisplayer = memo(
  ({ message }: { message: shortMessageInetrface }) => {
    const navigate = useNavigate();
    return (
      <div
        className="border rounded-lg  p-2 lg:p-3 cursor-pointer hover:bg-black/5 transition-colors active:bg-blue-200"
        onClick={() => navigate(`/message/${message.classID}/${message._id}`)}
      >
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
              <div key={index}>
                <img
                src={i}
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
              </div>
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
