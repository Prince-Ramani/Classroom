import ReactPlayer from "react-player";
import { memo } from "react";

const VideoPlayer = memo(({ source }: { source: string }) => {
  return (
    <div className="mt-2 w-full h-full  lg:min-h-96  rounded-md  overflow-hidden">
      <ReactPlayer
        src={source}
        controls={true}
        playing={true}
        className="min-w-[60%] w-full  lg:min-h-96 object-contain bg-black rounded-md "
      />
    </div>
  );
});

export default VideoPlayer;
