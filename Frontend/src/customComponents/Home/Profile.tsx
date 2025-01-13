import { useAuthUser } from "@/Context/authUserContext";
import { memo, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Camera, X } from "lucide-react";

const Profile = memo(() => {
  const { authUser } = useAuthUser();
  const queryclient = useQueryClient();
  const [profilePicture, setProfilePicture] = useState<File | undefined>(
    undefined
  );
  const [profilePreview, setProfilePreview] = useState<string>("");

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/updateprofile", {
        method: "PATCH",

        body: formData,
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
      setProfilePicture(undefined);
      setProfilePreview("");
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const { mutate: logout, isPending: pendingLogout } = useMutation({
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

      setProfilePicture(undefined);
      setProfilePreview("");
      toast.success(data.message);
      await queryclient.invalidateQueries({ queryKey: ["authUser"] });

      window.location.reload();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileExists = e.target.files?.[0];
    if (fileExists && authUser && !pendingLogout) {
      setProfilePicture(fileExists);
      setProfilePreview(URL.createObjectURL(fileExists));
    }
  };

  const handleClick = () => {
    if (!profilePicture) {
      toast.error("ProfilePicture requried to update!");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    if (authUser && !pendingLogout) update(formData);
  };

  return (
    <div className="cursor-pointer">
      <Popover>
        <PopoverTrigger asChild>
          <img
            src={authUser?.profilePicture}
            className="size-10 rounded-full shrink-0 object-cover hover:border border-black active:border"
          />
        </PopoverTrigger>
        <PopoverContent className=" relative h-fit w-48 sm:w-52 md:w-56 lg:w-64 right-10 lg:right-12 bg-white text-white p-0 border-none shadow-md  shadow-green-600/80  ring-1 ring-green-400/80  ">
          <div className=" h-full text-black w-full p-2 py-3 hover:bg-white/10 active:bg-green-600/40 transition-colors cursor-pointer select-none font-semibold ">
            <div className=" flex flex-col items-center">
              <label htmlFor="profilePicture" className="cursor-pointer">
                <div className="relative rounded-full mb-4 border-red-800 border-2 h-fit w-fit overflow-hidden">
                  <img
                    src={profilePreview || authUser?.profilePicture}
                    className="size-32 md:size-40  rounded-full shrink-0 object-cover"
                  />
                  {profilePreview ? (
                    ""
                  ) : (
                    <div className="absolute bottom-0 flex items-center justify-center w-full h-full bg-black/40 ">
                      <Camera className="size-3 text-white w-full h " />
                    </div>
                  )}
                </div>
              </label>
              {profilePreview ? (
                <div className=" flex justify-center items-center">
                  <button
                    className=" flex items-center justify-center hover:bg-black/20 rounded-full w-fit "
                    onClick={() => {
                      setProfilePreview("");
                      setProfilePicture(undefined);
                    }}
                    disabled={isPending}
                  >
                    <X className="size-6 text-red-600" />
                  </button>
                </div>
              ) : (
                ""
              )}

              <div className="text-sm md:text-base break-all tracking-tight">
                <div className="flex">
                  {" "}
                  <div className="h-full min-w-fit">Username</div> :{" "}
                  {authUser?.username}
                </div>
                <div className="flex">
                  {" "}
                  <div className="h-full min-w-fit">Email</div> :{" "}
                  {authUser?.email}
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profilePicture"
              />

              <button
                className="bg-blue-500  h-7 rounded-md text-white text-center w-full mt-4 hover:bg-blue-300 transition-colors p-0.5 disabled:bg-blue-300"
                disabled={isPending || !profilePicture}
                onClick={handleClick}
              >
                {isPending ? "Saving..." : "Save"}
              </button>
              <button
                className="bg-red-500 h-7  rounded-md text-white text-center w-full mt-2  hover:bg-red-300 transition-colors p-0.5 disabled:bg-red-300"
                disabled={isPending}
                onClick={() => logout()}
              >
                {pendingLogout ? "Loggingout..." : "Logout"}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

export default Profile;
