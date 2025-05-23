"use client";

import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TimezoneOption } from '@/lib/timezones';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (value: string) => void;
  timezones: TimezoneOption[];
  placeholder?: string;
}

const TimezoneSelector: FC<TimezoneSelectorProps> = ({
  selectedTimezone,
  onTimezoneChange,
  timezones,
  placeholder = "Select US Timezone",
}) => {
  return (
    <Select value={selectedTimezone} onValueChange={onTimezoneChange}>
      <SelectTrigger className="w-full bg-card/80 backdrop-blur-sm text-foreground border-border focus:ring-accent">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-popover text-popover-foreground border-border">
        {timezones.map((tz) => (
          <SelectItem key={tz.value} value={tz.value}>
            {tz.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimezoneSelector;
