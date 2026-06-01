import { Button } from "@/components/ui/button"
import { Item, ItemActions } from "@/components/ui/item"
import AvatarInitials from "@/shared/components/AvatarInitials"
import { XIcon } from "lucide-react"
import type { PersonProps } from "../../features/bill/types/bill"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

type PersonItemProps = {
  person: PersonProps
  onAction?: (personId: string) => void
}

const PersonItem = ({ person, onAction }: PersonItemProps) => {
  return (
    <Item variant={"muted"} className="justify-between py-1">
      <div className="flex items-center gap-2">
        <AvatarInitials name={person.name} className="w-10 h-10" />

        <p>{person.name}</p>
      </div>
      {onAction && (
        <ItemActions>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant={"ghost"} size={"sm"}>
                <XIcon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unfriend your buddy?</AlertDialogTitle>
                <AlertDialogDescription className="w-full border text-wrap">
                  Make sure it's just business and nothing personal.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant={"destructive"}
                  onClick={() => onAction(person.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ItemActions>
      )}
    </Item>
  )
}

export default PersonItem
