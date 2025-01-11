import { FullMessageInterface } from "@/lib/FrontendTypes";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../Class/Wrapper";
import Bar from "@/something/Bar";
import Loading from "@/components/Loading";
import { FormateDate } from "@/lib/Date";
import VideoPlayer from "@/components/VideoPLayer";
import { FileText } from "lucide-react";
import AddComment from "./AddComment";
import Comment from "./Comment";

const FullMessage = memo(() => {
  const { classID, messageID } = useParams();
  const navigate = useNavigate();

  if (!classID) navigate("/");
  if (!messageID) navigate("/");
  const { data, isPending } = useQuery({
    queryKey: [classID, messageID],
    queryFn: async () => {
      const res = await fetch(`/api/class/getMessage/${classID}/${messageID}`);
      const data: FullMessageInterface | { error: string } = await res.json();
      if (!data || typeof data === "undefined" || "error" in data) {
        toast.error(data.error);
        return;
      }
      return data;
    },
  });

  return (
    <>
      {data && !isPending ? (
        <div className="flex flex-col flex-grow  min-h-screen">
          <Bar title={data.classname} />
          <Wrapper className="pt-7">
            <div className=" w-full  flex flex-col gap-2 ">
              <div className="flex gap-4 items-center border-b border-orange-800 pb-5">
                <img
                  src={data.uploadedBy.profilePicture}
                  alt="Profil picture"
                  className="size-12"
                />
                <div className="flex gap-0.5 flex-col">
                  <div className="font-semibold tracking-wide md:text-lg xl:text-xl">
                    {data.uploadedBy.username}
                  </div>
                  <div className="text-xs text-gray-600 sm:text-sm">
                    {FormateDate(data.createdAt)}
                  </div>
                </div>
              </div>

              <div className=" pb-4">
                <div className="md:text-lg break-all">{data.content}</div>

                {data.attachedImages.length > 0 ||
                data.attachedVideo ||
                data.attachedPdfs.length > 0 ? (
                  <div className="text-lg md:text-2xl py-4 font-semibold text-gray-700">
                    Attachments
                  </div>
                ) : (
                  ""
                )}
                {data.attachedImages.length > 0 ? (
                  <div
                    className={`grid grid-cols-2 gap-0.5 xl:gap-3 items-center justify-center`}
                  >
                    {data.attachedImages.map((i, index) => (
                      <a href={i} target="_blank" className="  ">
                        <img
                          src={i}
                          key={index}
                          className="rounded-md object-cover h-48 sm:h-52 md:h-56 xl:h-64  w-full aspect-square   border border-gray-700/20"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  ""
                )}

                {data.attachedVideo ? (
                  <div
                    className={`flex items-center justify-center max-h-[600px] max-w-[1111px]   `}
                  >
                    <VideoPlayer source={data.attachedVideo} />
                  </div>
                ) : (
                  ""
                )}

                {data.attachedPdfs.length > 0 ? (
                  <div className="flex gap-3 flex-col">
                    {data.attachedPdfs.map((p, index) => (
                      <a href={p.link} target="_blank" key={index}>
                        <div className="text-red-600  w-fit flex gap-3 items-center border border-red-600 rounded-full p-2 hover:bg-red-600/20 cursor-pointer">
                          <FileText className="size-7" />
                          <div className="font-semibold text-sm sm:text-base lg:text-lg">
                            {p.fileName}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="border-t-2 border-gray-500/30 w-full mt-5" />

            <div className="w-full flex  flex-col">
              <div className="font-semibold  sm:text-lg md:text-xl lg:text-2xl py-5">
                Class comments
              </div>

              {classID !== undefined && messageID !== undefined ? (
                <>
                  <AddComment classID={classID} messageID={messageID} />
                  <Comment messageID={messageID} classID={classID} />
                </>
              ) : (
                ""
              )}
            </div>
          </Wrapper>
          ;
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
});

export default FullMessage;
