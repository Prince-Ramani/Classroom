import { useAuthUser } from "@/Context/authUserContext";
import AddButton from "@/something/AddButton";

import { Menu } from "lucide-react";
import { memo } from "react";

const HomeBar = memo(() => {
  const { authUser } = useAuthUser();
  return (
    <div className="border-b-2 p-3  backdrop-blur-lg  z-20 sticky  top-0 w-full flex items-center justify-between  lg:px-10">
      <div className="flex items-center gap-5">
        <div>
          <Menu />
        </div>
        <div className="font-semibold text-xl text-gray-700">Classroom</div>
      </div>
      <div>
        <div className="flex gap-10 items-center">
          <AddButton />
          <img
            src={authUser?.profilePicture}
            className="size-10 rounded-full shrink-0 object-cover hover:border border-black active:border"
          />
        </div>
      </div>
    </div>
  );
});

export default HomeBar;
