import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CircleAlertIcon } from "lucide-react";
import CurrencyDropdown from "../CurrencyDropdown";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { BillMetaFormValues } from "../../lib/billMeta-validation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker12 } from "@/components/ui/time-picker/time-picker-12h";
import { Textarea } from "@/components/ui/textarea";

interface BillMetaSectionProps {
  form: UseFormReturn<BillMetaFormValues>;
}

const BillMetaSection = ({ form }: BillMetaSectionProps) => {
  const billForm = form;
  const {
    control,
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
            <CircleAlertIcon size={"14px"} /> {errors.title.message}
          </FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="bill-date" className="text-base">
          Date
        </FieldLabel>
        <Controller
          control={control}
          name="date"
          render={({ field }) => {
            const selectedDate = field.value ?? undefined;

            return (
              <div className="flex items-start gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      id="bill-date"
                      className="justify-start font-normal text-base"
                    >
                      {field.value ? (
                        field.value.toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) field.onChange(date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <TimePicker12
                  date={selectedDate}
                  setDate={(newDate) => {
                    if (newDate) {
                      field.onChange(newDate);
                    }
                  }}
                />
              </div>
            );
          }}
        />
      </Field>

      <CurrencyDropdown control={billForm.control} errors={errors} />

      <Field>
        <FieldLabel htmlFor="bill-note" className="text-base">
          Note
        </FieldLabel>
        <Textarea
          id="bill-note"
          placeholder="Example: Transfer to account 123456789 (Bank XYZ) under John Doe"
          className="min-h-32 resize-none"
          {...register("note")}
        />
      </Field>
    </FieldSet>
  );
};

export default BillMetaSection;
