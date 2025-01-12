import VideoPlayer from "@/components/VideoPLayer";
import { FormateDate } from "@/lib/Date";
import { shortMessageInetrface } from "@/lib/FrontendTypes";
import { BookA, BookMarked, FileText, Pin } from "lucide-react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import MessageOptions from "./messageOptions";

const MessageDisplayer = memo(
  ({
    message,
    isAdmin,
  }: {
    message: shortMessageInetrface;
    isAdmin: boolean;
  }) => {
    const navigate = useNavigate();
    const handleClick = (e: any) => {
      console.log(e.target.tagName);
      if (
        e.target.tagName === "morevertical" ||
        e.target.tagName === "SPAN" ||
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "svg" ||
        e.target.tagName === "circle" ||
        e.target.tagName === "TEXTAREA"
      )
        return;

      navigate(`/message/${message.classID}/${message._id}`);
    };
    return (
      <div
        className="border rounded-lg  p-2 lg:p-3 cursor-pointer hover:bg-black/5 transition-colors active:bg-blue-200"
        onClick={handleClick}
      >
        {message.isPinned ? (
          <div className="flex gap-1  items-center text-gray-500 p-1 md:p-2">
            <Pin className="size-4  rotate-45 " />
            <div className="text-xs md:text-sm  font-semibold">Pinned</div>
          </div>
        ) : (
          ""
        )}
        {message.type === "Classwork" ? (
          <div className="items-center w-full   flex gap-2 md:gap-3 lg:gap-4 xl:gap-5 ">
            <div className="bg-blue-500 rounded-full ">
              <BookA className=" size-10 p-1.5   text-white " />
            </div>
            <div className="flex flex-col ">
              <div className="text-lg font-medium">Classwork:</div>
              <div className="text-gray-500 text-xs tracking-tight">
                Posted {FormateDate(message.createdAt)}
              </div>
            </div>

            {isAdmin ? (
              <div className="ml-auto">
                <MessageOptions
                  classID={message.classID}
                  messageID={message._id}
                  oldContent={message.content}
                  isPinned={message.isPinned}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {message.type === "Assignment" ? (
          <div className="items-center w-full   flex gap-2 md:gap-3 lg:gap-4 xl:gap-5 ">
            <div className="bg-orange-500 rounded-full ">
              <BookMarked className=" size-10 p-1.5   text-white " />
            </div>
            <div className="flex flex-col ">
              <div className="text-lg font-medium">New assignment:</div>
              <div className="text-gray-500 text-xs tracking-tight">
                Posted {FormateDate(message.createdAt)}
              </div>
            </div>
            {isAdmin ? (
              <div className="ml-auto">
                <MessageOptions
                  classID={message.classID}
                  messageID={message._id}
                  oldContent={message.content}
                  isPinned={message.isPinned}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        {message.type === "Normal" ? (
          <div className="items-center w-full  flex gap-2 md:gap-3 lg:gap-4 xl:gap-5 ">
            <img
              src={message.uploadedBy.profilePicture}
              className="size-10 rounded-full"
            />
            <div className="flex flex-col ">
              <div className="text-lg font-medium">
                {message.uploadedBy.username}
              </div>
              <div className="text-gray-500 text-xs ">
                {FormateDate(message.createdAt)}
              </div>
            </div>
            {isAdmin ? (
              <div className="ml-auto">
                <MessageOptions
                  classID={message.classID}
                  messageID={message._id}
                  oldContent={message.content}
                  isPinned={message.isPinned}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

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

        {message.attachedPdfs.length > 0 ? (
          <div className="flex gap-3 flex-col">
            {message.attachedPdfs.map((p, index) => (
              <a href={p.link} target="_blank" key={index}>
                <div className="text-red-600  w-fit flex gap-3 items-center border border-red-600 rounded-full p-2 hover:bg-red-600/20 cursor-pointer">
                  <FileText className="size-5" />
                  <div className="font-semibold text-xs md:text-base">
                    {p.fileName}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          ""
        )}
        <div className="border-t-2 my-2 " />
        <div className="flex w-full p-2 font-semibold ">
          Comments : {message.commentLength}
        </div>
      </div>
    );
  }
);

export default MessageDisplayer;
