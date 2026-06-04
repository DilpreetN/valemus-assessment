import type { FC } from "react";
import { Spinner } from "../ui/spinner";

type LoadingSpinnerProps = {
  text?: string;
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center">
      <Spinner className="size-6" />
      {text}
    </div>
  );
};

export default LoadingSpinner;
