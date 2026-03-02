import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

const BackButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Button variant="outline" size={"lg"} type="button" onClick={onClick}>
      <ArrowLeftIcon className="scale-150" />
    </Button>
  );
};

export default BackButton;
