import { memo } from "react";
import TextareaAutosize from "react-textarea-autosize";

const CreateMessage = memo(({ profile }: { profile: string }) => {
  return (
    <div className="border w-full bg-white p-4 rounded-lg shadow-md  shadow-gray-500/30 flex items-center">
      <img src={profile} className="size-10 xl:size-12 rounded-full" />
      <TextareaAutosize
        placeholder="Share something with your class..."
        minRows={1}
        maxRows={5}
        className="w-full focus:outline-none h-full pl-3 md:text-lg resize-none"
      />
    </div>
  );
});

export default CreateMessage;
