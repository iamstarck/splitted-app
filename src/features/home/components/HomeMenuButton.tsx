import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonWithIconProps } from "@/shared/types/definitions"
import { Link } from "react-router-dom"

interface HomeMenuButtonProps extends ButtonWithIconProps {
  pageRef: string
  className?: string
}

const HomeMenuButton = ({
  icon,
  text,
  pageRef,
  className
}: HomeMenuButtonProps) => {
  return (
    <Button
      variant={"outline"}
      asChild
      className={cn("h-full w-fit", className)}
    >
      <Link to={pageRef}>
        <div className="flex flex-col items-center gap-2">
          {icon}
          {text}
        </div>
      </Link>
    </Button>
  )
}

export default HomeMenuButton
