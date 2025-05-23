
"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getFormattedDateTime, isDaylight } from '@/lib/timezones';
import { Skeleton } from '@/components/ui/skeleton';

interface ClockDisplayProps {
  label: string;
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
  const [dateString, setDateString] = useState<string | null>(null);
  const [daylight, setDaylight] = useState<boolean | null>(null);
  const [parsedTime, setParsedTime] = useState<ParsedTime | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const { timeString: newTimeString, dateString: newDateString } = getFormattedDateTime(now, ianaTimezone);
      setTimeString(newTimeString);
      setDateString(newDateString);
      setDaylight(isDaylight(now, ianaTimezone));
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
        setParsedTime(null);
      }
    }
  }, [timeString]);

  if (timeString === null || dateString === null || daylight === null || (timeString && !parsedTime)) {
    return (
      <div className="flex items-baseline space-x-2 p-2 rounded-md">
        <Skeleton className="h-6 w-20" /> {/* Label */}
        <Skeleton className="h-7 w-28" /> {/* Time */}
        <Skeleton className="h-5 w-24" /> {/* Date */}
        <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon */}
      </div>
    );
  }

  return (
    <div className="flex items-baseline space-x-2 text-foreground p-1">
      <span className="font-semibold text-lg">{label}:</span>
      {parsedTime ? (
        <>
          <span className="text-2xl font-mono tabular-nums tracking-tight">
            {parsedTime.hours}<span className="opacity-70">:</span>{parsedTime.minutes}<span className="opacity-70">:</span>{parsedTime.seconds}
          </span>
          <span className="text-xl font-medium">{parsedTime.ampm}</span>
        </>
      ) : (
        // Fallback, should ideally not be hit if skeleton catches loading state
        <span className="text-2xl font-mono tabular-nums tracking-tight">{timeString}</span>
      )}
      <span className="text-sm text-muted-foreground ml-1">({dateString})</span>
      {daylight !== null && (
        <span className="text-sm ml-1">
          {daylight ? <Sun className="w-4 h-4 inline text-yellow-400" /> : <Moon className="w-4 h-4 inline text-blue-400" />}
        </span>
      )}
    </div>
  );
};

export default ClockDisplay;
