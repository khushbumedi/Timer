
"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { getFormattedDateTime } from '@/lib/timezones';
import { Skeleton } from '@/components/ui/skeleton';

interface ClockDisplayProps {
  label: string; // Will be "IST" or "ET"
  ianaTimezone: string;
  fixedDateTime?: Date; // Optional: if provided, displays this static time
}

interface ParsedTime {
  hours: string;
  minutes: string;
  seconds: string;
  ampm: string;
}

const ClockDisplay: FC<ClockDisplayProps> = ({ label, ianaTimezone, fixedDateTime }) => {
  const [timeString, setTimeString] = useState<string | null>(null);
  const [parsedTime, setParsedTime] = useState<ParsedTime | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const dateToUse = fixedDateTime || new Date(); // Use fixedDateTime if provided, else current time
      const { timeString: newTimeString } = getFormattedDateTime(dateToUse, ianaTimezone);
      setTimeString(newTimeString);
    };

    updateDateTime(); // Initial call

    if (!fixedDateTime) { // Only set interval if not a fixed time
      const intervalId = setInterval(updateDateTime, 1000);
      return () => clearInterval(intervalId);
    }
  }, [ianaTimezone, fixedDateTime]); // Add fixedDateTime to dependency array

  useEffect(() => {
    if (timeString) {
      const match = timeString.match(/(\d{1,2}):(\d{2}):(\d{2})\s(AM|PM)/i);
      if (match) {
        setParsedTime({
          hours: match[1],
          minutes: match[2],
          seconds: match[3],
          ampm: match[4],
        });
      } else {
        // Fallback for safety, though expected format should match
        setParsedTime({ hours: '--', minutes: '--', seconds: '--', ampm: '--' });
      }
    }
  }, [timeString]);

  if (!parsedTime) {
    return (
      <div className="flex items-baseline space-x-2 p-1">
        <Skeleton className="h-6 w-8" /> {/* Label (IST/ET) */}
        <Skeleton className="h-7 w-36" /> {/* Time (HH:MM:SS AM/PM) */}
      </div>
    );
  }

  return (
    <div className="flex items-baseline space-x-2 text-foreground p-1 min-w-[200px]"> {/* Added min-width for consistency */}
      <span className="font-semibold text-lg w-8">{label}</span> {/* Fixed width for label */}
      <span className="text-2xl font-mono tabular-nums tracking-tight">
        {parsedTime.hours}<span className="opacity-70">:</span>{parsedTime.minutes}<span className="opacity-70">:</span>{parsedTime.seconds}
      </span>
      <span className="text-xl font-medium">{parsedTime.ampm}</span>
    </div>
  );
};

export default ClockDisplay;
