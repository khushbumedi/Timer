
"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
        // Fallback if regex fails, though unlikely for 'en-US' locale format
        setParsedTime(null); 
      }
    }
  }, [timeString]);

  if (timeString === null || dateString === null || daylight === null || (timeString && !parsedTime)) {
    return (
      <Card className="w-full shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto mt-1" />
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-3 pt-0">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-2.5 w-full mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-semibold text-primary">{label}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{dateString}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-3 pt-0">
        <div className="text-6xl font-mono font-bold text-foreground tabular-nums tracking-tight flex items-baseline justify-center">
          {parsedTime ? (
            <>
              <span>{parsedTime.hours}</span>
              <span className="opacity-50 text-5xl self-center mx-px">:</span>
              <span>{parsedTime.minutes}</span>
              <span className="opacity-50 text-5xl self-center mx-px">:</span>
              <span>{parsedTime.seconds}</span>
              {parsedTime.ampm && (
                <span className="text-4xl ml-1.5 font-medium">{parsedTime.ampm}</span>
              )}
            </>
          ) : (
            // Fallback, though skeleton should catch this state
            <span>{timeString}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {daylight ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
          <span>{daylight ? 'Daylight Hours' : 'Night Hours'}</span>
        </div>

        <div className="w-full pt-2">
          <div
            className={`h-2.5 rounded-full transition-colors duration-500 ${
              daylight ? 'bg-yellow-500' : 'bg-blue-700'
            }`}
            title={daylight ? 'Daylight' : 'Night'}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClockDisplay;
