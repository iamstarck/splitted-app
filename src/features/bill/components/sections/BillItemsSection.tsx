import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ItemGroup } from "@/components/ui/item";
import BillItem from "../BillItem";
import { CoffeeIcon, PlusIcon } from "lucide-react";
import type { currencyId } from "../../types/bill";
import { useSelectBillItems } from "@/stores/selectors/bill.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { useState } from "react";

const BillItemsSection = ({ currency }: { currency: currencyId }) => {
  const items = useSelectBillItems() ?? [];
  const addItem = useDataStore((state) => state.addItemToBill);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  const handleAddItem = () => {
    if (!name.trim() || price === 0 || price === null) return;

    addItem(name, price);
    setName("");
    setPrice(null);
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex gap-2">
        <CoffeeIcon />
        <p className="text-base font-medium">Items</p>
      </div>

      <div className="space-y-3">
        <Input
          type="name"
          placeholder="Item description"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddItem();
            }
          }}
        />

        <div className="flex gap-2">
          <InputGroup>
            <InputGroupInput
              type="number"
              min={0}
              value={price ?? 0}
              onChange={(e) => setPrice(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />

            {currency && <InputGroupAddon>{currency}</InputGroupAddon>}
          </InputGroup>
          <Button type="button" onClick={handleAddItem}>
            <PlusIcon />
          </Button>
        </div>
      </div>

      {items.length > 0 && (
        <ItemGroup className="space-y-2">
          {items.map((item) => (
            <BillItem key={item.id} item={item} currency={currency} />
          ))}
        </ItemGroup>
      )}
    </div>
  );
};

export default BillItemsSection;
