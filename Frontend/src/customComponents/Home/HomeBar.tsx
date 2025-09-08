import AddButton from "@/something/AddButton";

import { memo, useState } from "react";
import Profile from "./Profile";
import JoinClassDialog from "./JoinClassDialog";
import HomeSidebar from "./HomeSidebar";

const HomeBar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen ? <JoinClassDialog isOpen={isOpen} setIsOpen={setIsOpen} /> : ""}
      <div className="border-b-2 p-3  backdrop-blur-lg  z-20 sticky  top-0 w-full flex items-center justify-between  lg:px-10">
        <div className="flex items-center gap-5">
          <HomeSidebar />
          <div className="font-semibold text-xl text-gray-700">Classroom</div>
        </div>
        <div>
          <div className="flex gap-10 items-center">
            <AddButton setIsOpen={setIsOpen} />
            <Profile />
          </div>
        </div>
      </div>
    </>
  );
});

export default HomeBar;
