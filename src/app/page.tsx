
"use client";

import React, { useState, useEffect } from 'react';
import ClockDisplay from '@/components/global-clock/ClockDisplay';
import { US_TIMEZONES, INDIA_TIMEZONE } from '@/lib/timezones';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const easternTimezoneDetails = US_TIMEZONES.find(tz => tz.value === 'America/New_York');
  const [currentDateForStaticClocks, setCurrentDateForStaticClocks] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDateForStaticClocks(new Date());
  }, []);

  const staticRowBackgroundColors = [
    'bg-slate-50',   // Very light gray
    'bg-emerald-50', // Very light green
    'bg-white',       // White (will blend with page background)
    'bg-pink-50'      // Very light pink
  ];

  const staticRowsData = React.useMemo(() => {
    if (!currentDateForStaticClocks) return [];

    const indianDateFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const [yearStr, monthStr, dayStr] = indianDateFormatter.format(currentDateForStaticClocks).split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;
    const day = parseInt(dayStr);

    // Base time: 4:30 PM IST (16:30 IST = 11:00 UTC)
    const baseUTCHour = 11;
    const baseUTCMinute = 0;

    // From 4:30 PM IST (16:30) to 11:30 PM IST (23:30)
    // This is 7 hours, which is 14 intervals of 30 minutes.
    // So, 15 rows are needed.
    const numberOfRows = 15;

    return Array.from({ length: numberOfRows }).map((_, index) => {
      const minutesOffset = index * 30;
      const currentStaticTime = new Date(Date.UTC(year, month, day, baseUTCHour, baseUTCMinute + minutesOffset, 0));
      return {
        indiaTime: currentStaticTime,
      };
    });
  }, [currentDateForStaticClocks]);

  return (
    <div className="flex flex-col items-start min-h-screen p-4 sm:p-8 bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Real-time clocks row - Highlighted */}
      <div className="flex flex-row gap-6 p-2 rounded-md bg-yellow-300 text-yellow-950 mb-2 w-full sm:w-auto">
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
      <div className="w-full sm:w-auto"> {/* Container for static rows to manage borders */}
        {currentDateForStaticClocks ? (
          staticRowsData.map((rowData, index) => {
            const bgColorClass = staticRowBackgroundColors[index % staticRowBackgroundColors.length];
            return (
              <div 
                key={`static-row-${index}`} 
                className={`flex flex-row gap-6 p-2 border-b border-slate-200 ${bgColorClass} last:border-b-0`}
              >
                <ClockDisplay
                  label="IST"
                  ianaTimezone={INDIA_TIMEZONE.value}
                  fixedDateTime={rowData.indiaTime}
                />
                {easternTimezoneDetails && (
                  <ClockDisplay
                    label="ET"
                    ianaTimezone={easternTimezoneDetails.value}
                    fixedDateTime={rowData.indiaTime} 
                  />
                )}
              </div>
            );
          })
        ) : (
          // Skeletons for static rows
          Array.from({ length: 15 }).map((_, i) => (
            <div key={`skel-row-${i}`} className="flex flex-row gap-6 p-2 border-b border-slate-200 last:border-b-0">
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
    </div>
  );
}
