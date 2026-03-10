import type { ReactNode } from "react";

interface EmptyListPlaceholderProps {
  message: string;
  subMessage?: string;
  icon: ReactNode;
}

const EmptyListPlaceholder = ({
  message,
  subMessage,
  icon: Icon,
}: EmptyListPlaceholderProps) => {
  return (
    <div className="flex flex-col items-center text-muted-foreground gap-2 select-none py-16 text-center">
      {Icon}
      <div>
        <p className="font-semibold">{message}</p>
        {subMessage && <p>{subMessage}</p>}
      </div>
    </div>
  );
};

export default EmptyListPlaceholder;
