import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleAlertIcon } from "lucide-react";

const CurrencyDropdown = () => {
  return (
    <Field className="grid w-full items-center gap-2">
      <FieldLabel className="text-base font-medium">Currency</FieldLabel>

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">$ - US Dollar</SelectItem>
          <SelectItem value="rp">Rp - Rupiah</SelectItem>
        </SelectContent>
      </Select>

      <FieldError className="inline-flex items-center gap-1 text-destructive">
        <CircleAlertIcon size={14} />
        Error message
      </FieldError>
    </Field>
  );
};

export default CurrencyDropdown;
