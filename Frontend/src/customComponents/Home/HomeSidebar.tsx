import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthUser } from "@/Context/authUserContext";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Menu, Settings } from "lucide-react";
import { toast } from "react-toastify";

const HomeSidebar = () => {
  const { authUser } = useAuthUser();

  const queryclient = useQueryClient();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      const data = await res.json();

      return data;
    },
    onSuccess: async (data) => {
      if ("error" in data) {
        return toast.error(data.error, {
          position: "top-center",
        });
      }

      toast.success(data.message);
      await queryclient.invalidateQueries({ queryKey: ["authUser"] });

      window.location.reload();
    },
  });

  if (!authUser) return;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-1 bg-white rounded-sm  text-gray-700">
          <Menu />
        </button>
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-slate-200 p-0">
        <SheetHeader className="p-6">
          <SheetTitle>User Menu</SheetTitle>
        </SheetHeader>

        <div className="flex  flex-col pt-4 gap-2 h-full ">
          <div className="flex flex-col bg-slate-200 rounded-md  gap-2 p-6 ">
            <img
              src={authUser.profilePicture}
              alt="user-profilePicture"
              className=" size-28 xl:size-32 rounded-full object-cover self-start"
            />
            <div className="pl-2 flex  flex-col text-gray-700 text-sm ">
              <Label>{authUser.username}</Label>
              <Label>{authUser.email}</Label>
            </div>
          </div>

          <div className="w-full   flex  flex-1 flex-col text-gray-900 bg-white border-t 400 ">
            <button className="flex justify-center gap-4 w-full p-2  md:hover:opacity-80 focus-within:outline-blue-700">
              <div className="w-[40%] flex items-center justify-end pr-2">
                <Bell className="text-gray-900" />
              </div>
              <div className="w-[60%] flex items-center ">Notifications</div>
            </button>

            <button className="flex justify-center gap-4 w-full p-2  md:hover:opacity-80 focus-within:outline-blue-700">
              <div className="w-[40%] flex items-center justify-end pr-2">
                <Settings className="text-gray-900" />
              </div>
              <div className="w-[60%] flex items-center ">Settings</div>
            </button>

            <div className="w-full p-4 ">
              <button
                className="bg-red-500 w-full rounded-sm p-1.5 text-white md:hover:bg-red-300 text-center font-semibold disabled:bg-gray-700"
                onClick={() => {
                  if (!isPending) logout();
                }}
                disabled={isPending}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HomeSidebar;
