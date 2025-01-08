import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { memo } from "react";

const CustomTooltip = memo(
  ({
    children,
    side = "bottom",
    title,
  }: {
    children: React.ReactNode;
    title: string;
    side?: "bottom" | "top" | "left" | "right";
  }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent
            className="bg-black text-white rounded-md p-2 text-sm font-sans "
            side={side}
          >
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

export default CustomTooltip;
