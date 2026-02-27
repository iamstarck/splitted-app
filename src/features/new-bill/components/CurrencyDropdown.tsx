import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleAlertIcon } from "lucide-react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { BillMetaFormValues } from "../lib/billMeta-validation";
import { CURRENCIES } from "../types/bill";

interface CurrencyDropdownProps {
  control: Control<BillMetaFormValues>;
  errors?: FieldErrors<BillMetaFormValues>;
}

const CurrencyDropdown = ({ control, errors }: CurrencyDropdownProps) => {
  return (
    <Field className="grid w-full items-center gap-2">
      <FieldLabel className="text-base font-medium">Currency</FieldLabel>

      <Controller
        control={control}
        name="currency"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CURRENCIES).map(([id, label]) => (
                <SelectItem key={id} value={id}>
                  {id} - {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {errors?.currency && (
        <FieldError className="inline-flex items-center gap-1 text-destructive">
          <CircleAlertIcon size={14} />
          {errors.currency.message}
        </FieldError>
      )}
    </Field>
  );
};

export default CurrencyDropdown;
