import { ChevronRight } from "lucide-react";
import boyHand from "../../assets/boy-raising-his-hand.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JoinClassDialog from "../Home/JoinClassDialog";
const NoMessage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen ? <JoinClassDialog isOpen={isOpen} setIsOpen={setIsOpen} /> : ""}
      <div className=" w-full h-full flex justify-center items-center flex-col">
        <img
          src={boyHand}
          alt="boy-rasing-hand"
          className="size-56 sm:size-64 lg:size-72 xl:size-80 2xl:size-96"
        />
        <div className="flex-col flex gap-7">
          <div className="flex flex-col items-center justify-center ">
            <div>
              <b className="text-xl lg:text-2xl">Welcome to Classroom!</b>
            </div>
            <div>You have't joined any classes yet.</div>
          </div>
          <div className="w-full flex justify-center gap-12 items-center max-w-xl ">
            <button
              className="bg-green-500 p-2  md:px-4 text-white  rounded-md md:hover:bg-green-100 active:bg-green-700"
              onClick={() => setIsOpen(true)}
            >
              Join a class
            </button>

            <button
              className="bg-blue-500 p-2 md:px-3 text-white rounded-md md:hover:bg-blue-100 active:bg-blue-700"
              onClick={() => navigate("/createclass")}
            >
              Create a class
            </button>
          </div>
          <div className="text-gray-600">
            <b className="underline">Tips :</b>
            <div className="flex justify-start items-center text-sm sm:text-base">
              <ChevronRight className="size-5 text-blue-700" />
              Ask your teacher for a class code
            </div>

            <div className="flex justify-start items-center text-sm sm:text-base">
              <ChevronRight className="size-5 text-blue-700" />
              Use it to join instantly
            </div>
            <div className="flex justify-start items-center text-sm sm:text-base">
              <ChevronRight className="size-5 text-blue-700" />
              Or create your own class to invite others
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoMessage;
