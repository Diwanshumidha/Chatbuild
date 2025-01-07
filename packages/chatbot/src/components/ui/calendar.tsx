"use client";

import * as React from "react";

import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("chatbot-calendar", className)}
      //   components={{
      //     IconLeft: ({ className, ...props }) => (
      //       <IoChevronBackOutline className={cn("h-4 w-4", className)} {...props} />
      //     ),
      //     IconRight: ({ className, ...props }) => (
      //       <IoChevronForwardOutline className={cn("h-4 w-4", className)} {...props} />
      //     ),
      //   }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
