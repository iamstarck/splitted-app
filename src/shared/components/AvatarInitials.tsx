import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/shared/utils/utils";
import clsx from "clsx";

interface AvatarInitialsProps {
  name: string;
  className?: string;
}

const AvatarInitials = ({ name, className }: AvatarInitialsProps) => {
  return (
    <Avatar className={clsx(className ?? "")}>
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarInitials;
