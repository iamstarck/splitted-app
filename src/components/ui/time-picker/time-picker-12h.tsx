"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";
import { TimePeriodSelect } from "./period-select";
import { Period } from "./time-picker-utils";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker12({ date, setDate }: TimePickerProps) {
  const period: Period = date && date.getHours() >= 12 ? "PM" : "AM";

  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-1 items-center">
        <TimePickerInput
          picker="12hours"
          id="12hours"
          period={period}
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
        <Label htmlFor="12hours" className="text-xs">
          Hours
        </Label>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <TimePickerInput
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
        <Label htmlFor="minutes12" className="text-xs">
          Minutes
        </Label>
      </div>
      <TimePeriodSelect
        period={period}
        date={date}
        setDate={setDate}
        ref={periodRef}
        onLeftFocus={() => secondRef.current?.focus()}
      />
    </div>
  );
}
