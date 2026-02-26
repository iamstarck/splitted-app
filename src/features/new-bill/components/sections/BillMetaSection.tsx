import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CircleAlertIcon } from "lucide-react";
import CurrencyDropdown from "../CurrencyDropdown";

const BillMetaSection = () => {
  return (
    <FieldSet className="space-y-3 w-full">
      <Field className="grid w-full items-center gap-2">
        <FieldLabel htmlFor="bill-title" className="text-base font-medium">
          Bill Title
        </FieldLabel>
        <Input
          type="text"
          id="bill-title"
          placeholder="eg: Hangout with high school friends"
        />

        <FieldError className="inline-flex items-center gap-1 text-destructive">
          <CircleAlertIcon size={"14px"} /> Error message
        </FieldError>
      </Field>

      <CurrencyDropdown />
    </FieldSet>
  );
};

export default BillMetaSection;
