
"use client";

import React, { useState, useEffect } from 'react';
import ClockDisplay from '@/components/global-clock/ClockDisplay';
import { US_TIMEZONES, INDIA_TIMEZONE } from '@/lib/timezones';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const easternTimezoneDetails = US_TIMEZONES.find(tz => tz.value === 'America/New_York');
  const [currentDateForStaticClocks, setCurrentDateForStaticClocks] = useState<Date | null>(null);

  useEffect(() => {
    // Set this once on mount to ensure all static clocks are relative to the same "today"
    // This ensures client-side determination of "today"
    setCurrentDateForStaticClocks(new Date());
  }, []);

  const staticRowsData = React.useMemo(() => {
    if (!currentDateForStaticClocks) return [];

    // Determine "today's" date components in India
    const indianDateFormatter = new Intl.DateTimeFormat('en-CA', { // en-CA gives YYYY-MM-DD
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const [yearStr, monthStr, dayStr] = indianDateFormatter.format(currentDateForStaticClocks).split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1; // JS Date months are 0-indexed
    const day = parseInt(dayStr);

    // Base time is 3:00 PM IST. IST is UTC+5:30.
    // So, 3:00 PM (15:00) IST = 9:30 UTC.
    const baseUTCHour = 9;
    const baseUTCMinute = 30;

    return Array.from({ length: 10 }).map((_, index) => {
      const minutesOffset = index * 30;
      const currentStaticTime = new Date(Date.UTC(year, month, day, baseUTCHour, baseUTCMinute + minutesOffset, 0));
      return {
        indiaTime: currentStaticTime,
      };
    });
  }, [currentDateForStaticClocks]);

  return (
    <div className="flex flex-col items-start min-h-screen p-4 sm:p-8 bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Real-time clocks row */}
      <div className="flex flex-row gap-6">
        <ClockDisplay
          key="india-realtime"
          label="IST"
          ianaTimezone={INDIA_TIMEZONE.value}
        />
        {easternTimezoneDetails && (
          <ClockDisplay
            key={easternTimezoneDetails.value + "-realtime"}
            label="ET"
            ianaTimezone={easternTimezoneDetails.value}
          />
        )}
      </div>

      {/* Static clocks rows */}
      {currentDateForStaticClocks ? (
        staticRowsData.map((rowData, index) => (
          <div key={`static-row-${index}`} className="flex flex-row gap-6 mt-2">
            <ClockDisplay
              label="IST"
              ianaTimezone={INDIA_TIMEZONE.value}
              fixedDateTime={rowData.indiaTime}
            />
            {easternTimezoneDetails && (
              <ClockDisplay
                label="ET"
                ianaTimezone={easternTimezoneDetails.value}
                fixedDateTime={rowData.indiaTime} // Pass the same Date object for ET conversion
              />
            )}
          </div>
        ))
      ) : (
        // Skeletons for static rows while currentDateForStaticClocks is loading
        Array.from({ length: 10 }).map((_, i) => (
          <div key={`skel-row-${i}`} className="flex flex-row gap-6 mt-2">
            <div className="flex items-baseline space-x-2 p-1 min-w-[200px]">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-7 w-36" />
            </div>
            <div className="flex items-baseline space-x-2 p-1 min-w-[200px]">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-7 w-36" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
