import { Button } from "@/components/ui/button";
import type { ButtonWithIconProps } from "@/shared/types/definitions";
import { Link } from "react-router-dom";

interface HomeMenuButtonProps extends ButtonWithIconProps {
  pageRef: string;
}

const HomeMenuButton = ({ icon, text, pageRef }: HomeMenuButtonProps) => {
  return (
    <Button variant={"outline"} asChild className="h-full w-fit">
      <Link to={pageRef}>
        <div className="flex flex-col items-center gap-2">
          {icon}
          {text}
        </div>
      </Link>
    </Button>
  );
};

export default HomeMenuButton;
