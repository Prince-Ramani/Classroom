import { cn } from "@/lib/utils";
import { memo } from "react";

const Wrapper = memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div
        className={cn(
          "flex flex-1 flex-grow  flex-col items-center p-2  lg:mx-20  xl:mx-44",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

export default Wrapper;
