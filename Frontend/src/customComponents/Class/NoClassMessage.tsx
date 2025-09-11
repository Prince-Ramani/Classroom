import { MessageCircleOff } from "lucide-react";

const NoClassMessage = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-4 text-gray-600">
      <MessageCircleOff className="size-24" />
      <p className="text-center text-sm md:text-base">
        There are no messages in this class yet.
      </p>
    </div>
  );
};
export default NoClassMessage;
