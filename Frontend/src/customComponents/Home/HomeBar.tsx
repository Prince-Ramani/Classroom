import { useAuthUser } from "@/Context/authUserContext";
import AddButton from "@/something/AddButton";

import { Menu } from "lucide-react";
import { memo, useState } from "react";
import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const HomeBar = memo(() => {
  const { authUser } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const [joinId, setJoinId] = useState("");

  const queryclient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/class/joinclass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classID: joinId }),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) return toast.error(data.error);
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["classes"] });
      setIsOpen(false);
    },
  });

  return (
    <>
      {isOpen ? (
        <div className="">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="  flex items-center border-none justify-center pb-10 min-w-full h-full    z-50 flex-col bg-blue-200/10 bg-opacity-50 ">
              <DialogTitle />
              <div className="bg-black p-3 rounded-3xl max-w-[275px] sm:max-w-[300px]  md:max-w-xs w-full">
                {isPending ? (
                  <div className=" absolute inset-0 z-[51] flex justify-center items-center rounded-2xl bg-blue-50/20 cursor-not-allowed">
                    <Loading />
                  </div>
                ) : (
                  ""
                )}
                <DialogDescription />
                <div className=" w-full  flex flex-col p-4 ">
                  <div className="font-bold ">
                    <div className="text-white font-extrabold text-xl tracking-wide">
                      Join class{" "}
                    </div>
                  </div>
                  <div className="text-gray-500  leading-tight text-sm tracking-wide pt-2">
                    <div className="text-white pb-4 font-semibold md:text-lg ">
                      Enter 4 digit class id
                    </div>
                    <input
                      className="bg-transparent border border-white   w-full p-2 text-white focus:outline-2 focus:outline-blue-500 rounded-md"
                      value={joinId}
                      onChange={(e) => setJoinId(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex flex-col gap-2 mt-7">
                      <button
                        className={`bg-white text-black font-semibold rounded-full p-2 text-sm ${
                          1 ? "opacity-75" : "hover:opacity-90"
                        }  `}
                        disabled={isPending}
                        onClick={() => mutate()}
                      >
                        Join
                      </button>

                      <button
                        className={`bg-transparent  ring-1 text-white ring-white/50 font-semibold rounded-full p-2 text-sm ${
                          1 ? "opacity-75" : "hover:bg-white/10"
                        } 
                  `}
                        disabled={isPending}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        Cancle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        ""
      )}
      <div className="border-b-2 p-3  backdrop-blur-lg  z-20 sticky  top-0 w-full flex items-center justify-between  lg:px-10">
        <div className="flex items-center gap-5">
          <div>
            <Menu />
          </div>
          <div className="font-semibold text-xl text-gray-700">Classroom</div>
        </div>
        <div>
          <div className="flex gap-10 items-center">
            <AddButton setIsOpen={setIsOpen} />
            <img
              src={authUser?.profilePicture}
              className="size-10 rounded-full shrink-0 object-cover hover:border border-black active:border"
            />
          </div>
        </div>
      </div>
    </>
  );
});

export default HomeBar;
