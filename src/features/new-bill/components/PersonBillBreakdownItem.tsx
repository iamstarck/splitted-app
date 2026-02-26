import { Item, ItemContent, ItemHeader } from "@/components/ui/item";
import AvatarInitials from "@/shared/components/AvatarInitials";

const PersonBillBreakdownItem = () => {
  return (
    <Item variant={"muted"}>
      <ItemHeader>
        <div className="flex items-center gap-2">
          <AvatarInitials name={"User"} />

          <p>{"User"}</p>
        </div>

        <p className="text-lg font-bold text-accent-foreground">$23.55</p>
      </ItemHeader>

      <ItemContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between ml-10">
            <p className="text-sm">Items:</p>
            <p className="text-sm">$23.55</p>
          </div>

          <div className="ml-10">
            <ol className="list-decimal list-inside">
              <li className="text-sm font-medium text-primary">Item 2</li>
            </ol>
          </div>
        </div>

        {/* <div>
          <div className="flex justify-between ml-10">
            <p className="text-sm">Tax:</p>
            <p className="text-sm">{currency}100</p>
          </div>
          <div className="flex justify-between ml-10">
            <p className="text-sm">Tip:</p>
            <p className="text-sm">{currency}2.000</p>
          </div>
        </div> */}
      </ItemContent>
    </Item>
  );
};

export default PersonBillBreakdownItem;
