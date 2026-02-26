import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

const BackButton = () => {
  return (
    <Button variant="outline" size={"lg"} asChild>
      <Link to="/">
        <ArrowLeftIcon className="scale-150" />
      </Link>
    </Button>
  );
};

export default BackButton;
