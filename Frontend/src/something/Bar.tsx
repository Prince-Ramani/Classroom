import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "./CustomTooltip";
import { cn } from "@/lib/utils";

const Bar = ({
  title,
  backButton = true,
  className,
}: {
  title: string;
  backButton?: boolean;
  className?: string;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        " flex  border-b p-2 sm:p-3 md:p-4 md:pl-10 gap-4 items-cente  text-gray-700 shadow-md  shadow-black/30",
        className,
      )}
    >
      {backButton ? (
        <button
          className="hover:bg-gray-500/20 rounded-full p-1 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <CustomTooltip title="Back">
            <ArrowLeft className="shrink-0 " />
          </CustomTooltip>
        </button>
      ) : (
        ""
      )}
      <div className="font-semibold text-2xl">{title}</div>
    </div>
  );
};

export default Bar;
