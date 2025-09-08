import { useNotification } from "@/Context/notificationContext";
import { ArrowLeft } from "lucide-react";
import CustomTooltip from "@/something/CustomTooltip";
import { useNavigate } from "react-router-dom";
import { FormateDate } from "@/lib/Date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import NoNotification from "./NoNotifications";

const NotificationPage = () => {
  const { notifications } = useNotification();
  const navigate = useNavigate();

  const queryclient = useQueryClient();

  const { mutate: markAllAsReaded, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/markAllAsReaded", {
        method: "PUT",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) {
        return toast.error(data.error, {
          position: "top-center",
        });
      }
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div className="flex justify-center items-center  ">
      <div className="w-full h-full min-h-screen max-w-2xl  border-x flex flex-col ">
        <div className=" flex  gap-2 border-b p-4 bg-slate-200/80 items-center">
          <button
            className="rounded-full md:hover:bg-white/70 "
            onClick={() => navigate("/")}
          >
            <CustomTooltip title="Back">
              <ArrowLeft />
            </CustomTooltip>
          </button>
          <div className="font-semibold">Notifications</div>
        </div>
        {!!notifications && notifications.length === 0 ? (
          <div className="flex flex-col ">
            <button
              className="bg-blue-400  cursor-pointer w-full p-1 px-4 md:hover:bg-blue-400/70 active:bg-green-400/70 disabled:bg-gray-700/70 text-white"
              onClick={() => markAllAsReaded()}
              disabled={isPending}
            >
              Mark all as readed
            </button>
            {notifications.map((noti) => {
              return (
                <button
                  key={noti._id}
                  className={`flex w-full text-start items-center gap-2 p-2 border-b ${!noti.readed ? "bg-blue-100/50 md:hover:bg-white/20" : "md:hover:bg-black/5"}`}
                  onClick={() =>
                    navigate(
                      `/message/${noti.message.classID}/${noti.message._id}`,
                    )
                  }
                >
                  <div className="shrink-0">
                    <img
                      src={noti.message.uploadedBy.profilePicture}
                      className="rounded-full size-12 object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex gap-1 items-center">
                      <div className="text-sm md:text-base md:font-semibold">
                        {noti.message.uploadedBy.username}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {FormateDate(noti.message.createdAt)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {noti.message.type !== "Normal" ? (
                          <div
                            className={`${noti.message.type === "Assignment" ? "text-pink-800" : "text-green-500"} font-semibold text-sm md:text-base pl-2 `}
                          >
                            {noti.message.type}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm 2xl:text-base text-gray-600 break-all break-words ">
                      {noti.message.content.length > 200
                        ? noti.message.content.slice(0, 201) + "..."
                        : noti.message.content}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <NoNotification />
        )}
      </div>
    </div>
  );
};
export default NotificationPage;
