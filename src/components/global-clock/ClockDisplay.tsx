
"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { getFormattedDateTime } from '@/lib/timezones';
import { Skeleton } from '@/components/ui/skeleton';

interface ClockDisplayProps {
  label: string; // Will be "IST" or "ET"
  ianaTimezone: string;
}

interface ParsedTime {
  hours: string;
  minutes: string;
  seconds: string;
  ampm: string;
}

const ClockDisplay: FC<ClockDisplayProps> = ({ label, ianaTimezone }) => {
  const [timeString, setTimeString] = useState<string | null>(null);
  const [parsedTime, setParsedTime] = useState<ParsedTime | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // We only need the timeString from this utility function now
      const { timeString: newTimeString } = getFormattedDateTime(now, ianaTimezone);
      setTimeString(newTimeString);
    };

    updateDateTime(); // Initial call
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, [ianaTimezone]);

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
        setParsedTime(null); // Should not happen with expected format
      }
    }
  }, [timeString]);

  if (!parsedTime) { // Simplified loading state, rely on parsedTime
    return (
      <div className="flex items-baseline space-x-2 p-1">
        <Skeleton className="h-6 w-8" /> {/* Label (IST/ET) */}
        <Skeleton className="h-7 w-36" /> {/* Time (HH:MM:SS AM/PM) */}
      </div>
    );
  }

  return (
    <div className="flex items-baseline space-x-2 text-foreground p-1">
      <span className="font-semibold text-lg">{label}</span> {/* Display label directly, no colon */}
      {/* Parsed time display */}
      <span className="text-2xl font-mono tabular-nums tracking-tight">
        {parsedTime.hours}<span className="opacity-70">:</span>{parsedTime.minutes}<span className="opacity-70">:</span>{parsedTime.seconds}
      </span>
      <span className="text-xl font-medium">{parsedTime.ampm}</span>
    </div>
  );
};

export default ClockDisplay;
