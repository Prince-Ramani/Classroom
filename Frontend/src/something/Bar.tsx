import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "./CustomTooltip";

const Bar = ({
  title,
  backButton = true,
}: {
  title: string;
  backButton?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex  border-b p-2 sm:p-3 md:p-4 md:pl-10 gap-4 items-cente  text-gray-700 shadow-md  shadow-black/30 ">
      {backButton ? (
        <div
          className="hover:bg-gray-500/20 rounded-full p-1 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <CustomTooltip title="Back">
            <ArrowLeft className="shrink-0 " />
          </CustomTooltip>
        </div>
      ) : (
        ""
      )}
      <div className="font-semibold text-2xl">{title}</div>
    </div>
  );
};

export default Bar;
