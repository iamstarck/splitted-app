import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ItemGroup } from "@/components/ui/item";
import BillItem from "../BillItem";
import { CoffeeIcon, PlusIcon } from "lucide-react";
import { CURRENCIES, type currencyId } from "../../types/bill";
import { useSelectBillItems } from "@/stores/selectors/bill.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { BillMetaFormValues } from "../../lib/billMeta-validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BillItemsSection = ({ form, currency }: { form: UseFormReturn<BillMetaFormValues>, currency: currencyId }) => {
  const items = useSelectBillItems() ?? [];
  const addItem = useDataStore((state) => state.addItemToBill);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [displayPrice, setDisplayPrice] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (currency === "Rp") {
      const numericString = val.replace(/\D/g, "");
      if (!numericString) {
        setDisplayPrice("");
        setPrice(null);
        return;
      }
      const num = Number(numericString);
      setDisplayPrice(new Intl.NumberFormat("id-ID").format(num));
      setPrice(num);
    } else {
      const validChars = val.replace(/[^0-9.]/g, "");
      const parts = validChars.split(".");
      const numericValue = parts[0] + (parts.length > 1 ? "." + parts[1] : "");

      if (!numericValue) {
        setDisplayPrice("");
        setPrice(null);
        return;
      }

      if (numericValue.endsWith(".")) {
        setDisplayPrice(numericValue);
        setPrice(Number(numericValue));
        return;
      }

      const num = Number(numericValue);
      const integerPart = parts[0];
      const formattedInteger = new Intl.NumberFormat("en-US").format(Number(integerPart));
      const display = parts.length > 1 ? `${formattedInteger}.${parts[1]}` : formattedInteger;

      setDisplayPrice(display);
      setPrice(num);
    }
  };

  const handleAddItem = () => {
    if (!name.trim() || price === 0 || price === null) return;

    addItem(name, price);
    setName("");
    setPrice(null);
    setDisplayPrice("");
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
          placeholder="Item Name"
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
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    // Clear price input to avoid complex formatting conversions when currency changes
                    setPrice(null);
                    setDisplayPrice("");
                  }}
                >
                  <SelectTrigger className="w-fit border-0 bg-transparent shadow-none px-3 focus:ring-0 cursor-pointer font-medium hover:bg-muted/50 rounded-l-md transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCIES).map(([id]) => (
                      <SelectItem key={id} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <InputGroupInput
              type="text"
              placeholder="0"
              value={displayPrice}
              onChange={handlePriceChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />
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
