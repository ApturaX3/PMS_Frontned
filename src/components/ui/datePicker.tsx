'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({
  dueDate,
  setDueDate,
}: {
  dueDate: string | Date | undefined;
  setDueDate: (date: string | Date | undefined) => void;
}) {
  // Handle the date selection from the calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDueDate(date); // Update the selected date
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !dueDate && 'text-muted-foreground',
          )}
        >
          <CalendarIcon />
          {dueDate ? (
            format(new Date(dueDate), 'MMMM dd, yyyy') // Format date to 'Month day, Year' (e.g. December 31, 2024)
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dueDate instanceof Date ? dueDate : undefined}
          onSelect={handleDateSelect} // Update date on select
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
