import { useNavigate } from "react-router-dom";
import SnorlaxBuddy from "../../assets/snorlax-sleeping.png";

const NoNotification = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col  items-center h-full flex-1  bg-gray-50 gap-4">
      <div className="flex justify-center items-center">
        <img src={SnorlaxBuddy} alt="snorlax-and-buddy-sleeping" className="" />
      </div>
      <div className="text-center 4xl:text-lg ">
        <div>You're all caught up!</div>
        <div>No new notifications right now.</div>
      </div>
      <button
        className="bg-blue-400 text-white rounded-md py-1 md:py-2 px-20 font-semibold md:hover:bg-blue-400/70 active:bg-green-400/70 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Go Back!
      </button>
    </div>
  );
};

export default NoNotification;
