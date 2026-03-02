import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon, EyeIcon } from "lucide-react";
import AvatarInitials from "@/shared/components/AvatarInitials";
import { formatDate } from "../utils/formatTime";
import type { currencyId, PersonProps } from "@/features/bill/types/bill";
import { formatter } from "@/shared/utils/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useDeleteBillById } from "@/stores/selectors/bill.selectors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface BillListItemProps {
  id: string;
  title: string;
  date: Date;
  currency: currencyId;
  total: number;
  people: PersonProps[];
}

const BillListItem = ({
  id,
  title,
  date,
  currency,
  total,
  people,
}: BillListItemProps) => {
  const deleteBillById = useDeleteBillById();

  const handleDeleteBill = (billId: string) => {
    deleteBillById(billId);
    toast.success("Bill deleted successfully!", { position: "top-center" });
  };

  return (
    <Item variant={"muted"} className="shadow-xs">
      <ItemContent className="gap-4">
        <div className="flex justify-between text-left gap-8">
          <div>
            <p className="text-lg font-bold leading-none">{title}</p>
            <p className="text-base">{formatDate(date)}</p>
          </div>

          <p className="font-bold text-xl text-chart-1">
            {currency}
            {formatter.format(total)}
          </p>
        </div>

        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {people.map((person) => (
            <AvatarInitials key={person.id} name={person.name} />
          ))}
        </div>
      </ItemContent>
      <ItemFooter>
        <ItemActions className="w-full justify-end gap-3">
          <Button variant={"secondary"} size={"icon"} asChild>
            <Link to={`/detail/${id}`}>
              <EyeIcon />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/edit/${id}`}>Edit</Link>
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete bill?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this bill.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant={"destructive"}
                      onClick={() => handleDeleteBill(id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </ItemFooter>
    </Item>
  );
};

export default BillListItem;
