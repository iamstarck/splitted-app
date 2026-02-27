import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CircleAlertIcon } from "lucide-react";
import CurrencyDropdown from "../CurrencyDropdown";
import type { UseFormReturn } from "react-hook-form";
import type { BillMetaFormValues } from "../../lib/billMeta-validation";

interface BillMetaSectionProps {
  form: UseFormReturn<BillMetaFormValues>;
}

const BillMetaSection = ({ form }: BillMetaSectionProps) => {
  const billForm = form;
  const {
    register,
    formState: { errors },
  } = form;

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
          {...register("title")}
        />

        {errors.title && (
          <FieldError className="inline-flex items-center gap-1 text-destructive">
            <CircleAlertIcon size={"14px"} /> Error message
          </FieldError>
        )}
      </Field>

      <CurrencyDropdown control={billForm.control} errors={errors} />
    </FieldSet>
  );
};

export default BillMetaSection;
